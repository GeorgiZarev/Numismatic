import fs from "node:fs";
import path from "node:path";
import pg from "pg";
import { loadEnvConfig } from "../config/loadEnv.js";

loadEnvConfig();

const client = new pg.Client({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: true },
});

const statements = [
  "ALTER TABLE coins ADD COLUMN IF NOT EXISTS company VARCHAR(255)",
  "ALTER TABLE coins ADD COLUMN IF NOT EXISTS volume_ml INTEGER",
  "ALTER TABLE coins ADD COLUMN IF NOT EXISTS suitable_metals VARCHAR(255)",
  "ALTER TABLE coins ADD COLUMN IF NOT EXISTS pieces_per_box INTEGER",
  "ALTER TABLE coins ADD COLUMN IF NOT EXISTS size_stock JSONB NOT NULL DEFAULT '[]'::jsonb",
  "ALTER TABLE order_items ADD COLUMN IF NOT EXISTS size_mm NUMERIC(6,2)",
  "ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_volume_ml_check",
  "ALTER TABLE coins ADD CONSTRAINT coins_volume_ml_check CHECK (volume_ml > 0)",
  "ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_pieces_per_box_check",
  "ALTER TABLE coins ADD CONSTRAINT coins_pieces_per_box_check CHECK (pieces_per_box > 0)",
  "ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_size_stock_check",
  "ALTER TABLE coins ADD CONSTRAINT coins_size_stock_check CHECK (jsonb_typeof(size_stock) = 'array')",
];

try {
  await client.connect();
  await client.query("BEGIN");
  for (const statement of statements) await client.query(statement);
  for (const name of ["place_order_with_stock.sql", "update_order_status_with_stock.sql"]) {
    await client.query(fs.readFileSync(path.resolve("config/sql", name), "utf8"));
  }
  await client.query("COMMIT");
  console.log("Accessory inventory migration applied.");
} catch (error) {
  await client.query("ROLLBACK").catch(() => {});
  console.error("Accessory inventory migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
