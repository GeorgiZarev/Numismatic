import { loadEnvConfig } from "./loadEnv.js";

loadEnvConfig();

import { Kysely } from "kysely";
import { NeonHTTPDialect } from "kysely-neon";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
  throw new Error("Missing required database environment variables");
}

const DB_URL = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`;

/** @type {import('./kyselySchema.js').Database} */
const db = new Kysely({
  dialect: new NeonHTTPDialect({
    connectionString: DB_URL,
  }),
});

export default db;
