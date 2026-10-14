import db from "../../config/kysely.js";
import { sql } from "kysely";
import { sql as neonSql } from "../../config/NeonClient.js";

const orderDay = sql`(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Sofia')::date`;

export const Orders = {
  create: async ({ userId, orderData, items }) => {
    const [result] = await neonSql(
      "SELECT place_order_with_stock($1::uuid, $2::jsonb, $3::jsonb) AS id",
      [userId, JSON.stringify(orderData), JSON.stringify(items)]
    );
    return Orders.getById(result.id);
  },

  getByUserId: async (userId) => {
    const orders = await db
      .selectFrom("orders")
      .selectAll()
      .where("user_id", "=", userId)
      .orderBy("created_at", "desc")
      .execute();

    return attachItems(orders);
  },

  getById: async (id) => {
    const orders = await db
      .selectFrom("orders")
      .selectAll()
      .where("id", "=", id)
      .execute();

    const [order] = await attachItems(orders);
    return order;
  },

  getCities: async () => {
    const rows = await db
      .selectFrom("orders")
      .select(sql`MIN(TRIM(city))`.as("city"))
      .where(sql`TRIM(city)`, "<>", "")
      .groupBy(sql`LOWER(TRIM(city))`)
      .orderBy(sql`LOWER(TRIM(city))`)
      .execute();
    return rows.map((row) => row.city);
  },

  getAll: async (filters = {}) => {
    let query = db
      .selectFrom("orders")
      .selectAll();

    if (filters.status) {
      query = query.where("status", "=", filters.status);
    }

    if (filters.search?.trim()) {
      const searchTerm = `%${filters.search.trim().toLowerCase()}%`;
      query = query.where((eb) =>
        eb.or([
          sql`LOWER(customer_name) LIKE ${searchTerm}`,
          sql`LOWER(phone) LIKE ${searchTerm}`,
          sql`LOWER(email) LIKE ${searchTerm}`,
          sql`LOWER(city) LIKE ${searchTerm}`,
          sql`LOWER(address) LIKE ${searchTerm}`,
        ])
      );
    }

    if (filters.city?.trim()) {
      query = query.where(sql`LOWER(TRIM(city))`, "=", filters.city.trim().toLowerCase());
    }

    // Whole calendar days in the shop's time zone; a start date alone means that single day.
    if (filters.fromDate) {
      query = query
        .where(orderDay, ">=", sql`${filters.fromDate}::date`)
        .where(orderDay, "<=", sql`${filters.toDate || filters.fromDate}::date`);
    } else if (filters.toDate) {
      query = query.where(orderDay, "<=", sql`${filters.toDate}::date`);
    }

    const orders = await query
      .orderBy("created_at", "desc")
      .execute();

    return attachItems(orders);
  },

  updateStatus: async (id, status) => {
    await neonSql("SELECT update_order_status_with_stock($1::uuid, $2::text)", [id, status]);
    return Orders.getById(id);
  },
};

async function attachItems(orders) {
  if (orders.length === 0) return [];

  const orderIds = orders.map((order) => order.id);
  const items = await db
    .selectFrom("order_items")
    .selectAll()
    .where("order_id", "in", orderIds)
    .execute();

  return orders.map((order) => ({
    ...order,
    items: items.filter((item) => item.order_id === order.id),
  }));
}
