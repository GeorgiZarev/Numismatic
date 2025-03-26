import { sql } from "./db.js";
import fs from "fs";
import path from "path";

/**
 
** This function initializes the database by reading SQL files from the /config/sql folder and executing them separately.
*/
async function initDB() {
  try {
    const sqlFiles = ["extensions.sql", "users.sql"];

    for (const file of sqlFiles) {
      const filePath = path.resolve("config/sql", file);
      const query = fs.readFileSync(filePath, "utf-8");

      await sql(query);
      console.log(`✅ Executed ${file}`);
    }

    console.log("✅ Database initialized successfully.");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
}

export default initDB;