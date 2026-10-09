import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import pg from "pg";
import { loadEnvConfig } from "../config/loadEnv.js";

loadEnvConfig();

const testUrl = process.env.INVENTORY_TEST_DATABASE_URL;
const run = testUrl ? describe : describe.skip;
const orderData = {
  customer_name: "Inventory Tester", phone: "+359888000000", email: "inventory@example.com",
  city: "Sofia", address: "Example Street 10", payment_method: "cash_on_delivery",
};

run("inventory SQL against an isolated database", () => {
  const schema = `inventory_test_${randomUUID().replaceAll("-", "")}`;
  let first;
  let second;
  let userId;

  beforeAll(async () => {
    const configuredHost = process.env.PGHOST;
    const configuredDatabase = process.env.PGDATABASE;
    const url = new URL(testUrl);
    if (url.hostname === configuredHost && url.pathname.slice(1) === configuredDatabase) {
      throw new Error("Inventory tests refuse to use the configured application database");
    }

    first = new pg.Client({ connectionString: testUrl });
    second = new pg.Client({ connectionString: testUrl });
    await first.connect();
    await second.connect();
    await first.query(`CREATE SCHEMA "${schema}"`);
    await first.query(`SET search_path TO "${schema}", public`);
    await second.query(`SET search_path TO "${schema}", public`);
    await first.query(`
      CREATE TABLE users (id uuid PRIMARY KEY);
      CREATE TABLE coins (
        id uuid PRIMARY KEY, name text NOT NULL, price numeric(10,2) NOT NULL,
        photo_url text, status text NOT NULL DEFAULT 'active',
        stock_quantity integer NOT NULL CHECK (stock_quantity >= 0),
        zero_stock_action text NOT NULL DEFAULT 'hide', expected_delivery_date date,
        restocked_at timestamp
      );
      CREATE TABLE orders (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id),
        customer_name text NOT NULL, phone text NOT NULL, email text, city text NOT NULL,
        address text NOT NULL, postal_code text, address_line_2 text, country text,
        delivery_notes text, payment_method text, total numeric(10,2) NOT NULL,
        status text NOT NULL DEFAULT 'new', updated_at timestamp DEFAULT now()
      );
      CREATE TABLE order_items (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES orders(id),
        coin_id uuid REFERENCES coins(id), coin_name text NOT NULL, photo_url text,
        price numeric(10,2) NOT NULL, quantity integer NOT NULL
      );
    `);
    for (const file of ["place_order_with_stock.sql", "update_order_status_with_stock.sql"]) {
      await first.query(fs.readFileSync(path.resolve("config/sql", file), "utf8"));
    }
    userId = randomUUID();
    await first.query("INSERT INTO users(id) VALUES($1)", [userId]);
  });

  afterAll(async () => {
    if (first) {
      await first.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
      await first.end();
    }
    if (second) await second.end();
  });

  beforeEach(async () => {
    await first.query("DELETE FROM order_items");
    await first.query("DELETE FROM orders");
    await first.query("DELETE FROM coins");
  });

  const addCoin = async (quantity, action = "hide") => {
    const id = randomUUID();
    await first.query(
      "INSERT INTO coins(id, name, price, stock_quantity, zero_stock_action) VALUES($1, $2, $3, $4, $5)",
      [id, `Product ${id}`, 50, quantity, action]
    );
    return id;
  };

  const place = (client, items) => client.query(
    "SELECT place_order_with_stock($1::uuid, $2::jsonb, $3::jsonb) AS id",
    [userId, JSON.stringify(orderData), JSON.stringify(items)]
  );

  test("two simultaneous orders cannot both reserve the last unit", async () => {
    const id = await addCoin(1);
    const results = await Promise.allSettled([
      place(first, [{ coin_id: id, quantity: 1 }]),
      place(second, [{ coin_id: id, quantity: 1 }]),
    ]);
    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(results.filter((result) => result.status === "rejected")).toHaveLength(1);
    expect((await first.query("SELECT stock_quantity FROM coins WHERE id=$1", [id])).rows[0].stock_quantity).toBe(0);
    expect((await first.query("SELECT COUNT(*)::int AS count FROM orders")).rows[0].count).toBe(1);
  });

  test("zero-stock rules and manual hiding control catalog visibility", async () => {
    const hidden = await addCoin(0, "hide");
    const shown = await addCoin(0, "show");
    const review = await addCoin(0, "review_delete");
    const inStock = await addCoin(2);
    const manual = await addCoin(2);
    await first.query("UPDATE coins SET status='hidden' WHERE id=$1", [manual]);
    const visible = await first.query(
      "SELECT id FROM coins WHERE status='active' AND (stock_quantity>0 OR zero_stock_action='show')"
    );
    expect(visible.rows.map((row) => row.id).sort()).toEqual([shown, inStock].sort());
    expect(visible.rows.map((row) => row.id)).not.toContain(hidden);
    expect(visible.rows.map((row) => row.id)).not.toContain(review);
    await first.query("UPDATE coins SET stock_quantity=1, restocked_at=now() WHERE id=$1", [hidden]);
    const afterRestock = await first.query(
      "SELECT id FROM coins WHERE status='active' AND (stock_quantity>0 OR zero_stock_action='show')"
    );
    expect(afterRestock.rows.map((row) => row.id)).toContain(hidden);
    expect(afterRestock.rows.map((row) => row.id)).not.toContain(manual);
  });

  test("a failed multi-item order rolls back every reservation", async () => {
    const available = await addCoin(1);
    const unavailable = await addCoin(0, "show");
    await expect(place(first, [
      { coin_id: available, quantity: 1 },
      { coin_id: unavailable, quantity: 1 },
    ])).rejects.toThrow(/Insufficient stock/);
    expect((await first.query("SELECT stock_quantity FROM coins WHERE id=$1", [available])).rows[0].stock_quantity).toBe(1);
    expect((await first.query("SELECT COUNT(*)::int AS count FROM orders")).rows[0].count).toBe(0);
  });

  test("cancellation restores once, without marking an admin restock", async () => {
    const id = await addCoin(1);
    const order = await place(first, [{ coin_id: id, quantity: 1 }]);
    const orderId = order.rows[0].id;
    await first.query("SELECT update_order_status_with_stock($1::uuid, 'cancelled')", [orderId]);
    await first.query("SELECT update_order_status_with_stock($1::uuid, 'cancelled')", [orderId]);
    const restored = (await first.query("SELECT stock_quantity, restocked_at FROM coins WHERE id=$1", [id])).rows[0];
    expect(restored.stock_quantity).toBe(1);
    expect(restored.restocked_at).toBeNull();
  });

  test("a sent order cannot be cancelled", async () => {
    const id = await addCoin(1);
    const orderId = (await place(first, [{ coin_id: id, quantity: 1 }])).rows[0].id;
    await first.query("SELECT update_order_status_with_stock($1::uuid, 'sent')", [orderId]);
    await expect(first.query("SELECT update_order_status_with_stock($1::uuid, 'cancelled')", [orderId]))
      .rejects.toThrow(/Dispatched orders/);
    expect((await first.query("SELECT stock_quantity FROM coins WHERE id=$1", [id])).rows[0].stock_quantity).toBe(0);
  });
});
