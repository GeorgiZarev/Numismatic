// utils/db/users.js
import db from "../../config/kysely.js";
export const Users = {
  getByEmail: async (email) =>
    await db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .execute(),

  getByUsername: async (username) =>
    await db
      .selectFrom("users")
      .selectAll()
      .where("username", "=", username)
      .execute(),

  create: async ({ username, email, password }) =>
    await db
      .insertInto("users")
      .values({
        id: db.fn("uuid_generate_v4"),
        username,
        email,
        password,
      })
      .returning(["id", "username", "email", "created_at"])
      .execute(),
};
