import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

/**
 
*! This creates a SQL connection using out env variables, DO NOT TOUCH AND CHANGE IT.
*! MAKE SURE YOU HAVE THE VARIABLES LISTED INSIDE THE ENV FILE, DO NOT SHARE THE ENV FILE WITH THE VARIABLES INSIDE WITH ANYONE OUTSIDE OF THIS ORGANIZATION
**This SQL function we export is used as a tagged template literal, which allows us to write SQL queries safely
*/
export const sql = neon(`
  postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);