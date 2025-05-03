import { loadEnvConfig } from "./loadEnv.js";

import { neon } from "@neondatabase/serverless";

loadEnvConfig();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
  throw new Error("❌ Database environment variables are missing.");
}

/**
 * ! If you are experiencing any problems with the queries try this command: npm install kysely kysely-neon --legacy-peer-deps

 */

export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);
