import { sql } from "./NeonClient.js";
import fs from "fs";
import path from "path";

/**
 
** This function initializes the database by reading SQL files from the /config/sql folder and executing them separately.
*/
async function initDB() {
  try {
    const sqlFiles = ["extensions.sql", "users.sql", "coins.sql", "orders.sql", "addresses.sql"];

    for (const file of sqlFiles) {
      const filePath = path.resolve("config/sql", file);
      const rawSQL = fs.readFileSync(filePath, "utf-8");

      const statements = rawSQL
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        await sql(`${statement}`); // ✅ Works with Neon
      }

      console.log(`✅ Executed ${file}`);
    }

    console.log("✅ Database initialized successfully.");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

export default initDB;
