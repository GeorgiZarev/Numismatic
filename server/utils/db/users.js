import db from "../../config/kysely.js";
export const Users = {
  getByEmail: async (email) =>
    await db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .execute(),

  create: async ({ email, password, full_name, phone, city, address, birth_date, preferred_language }) =>
    await db
      .insertInto("users")
      .values({
        id: db.fn("uuid_generate_v4"),
        email,
        password,
        full_name,
        phone,
        city,
        address,
        birth_date,
        preferred_language,
      })
      .returning(["id", "email", "created_at"])
      .execute(),

  remove: async (id) =>
    await db.deleteFrom("users").where("id", "=", id).execute(),

  getPublicProfile: async (id) =>
    await db
      .selectFrom("users")
      .select([
        "id",
        "email",
        "full_name",
        "phone",
        "city",
        "address",
        "birth_date",
        "preferred_language",
        "created_at",
        "updated_at",
      ])
      .where("id", "=", id)
      .execute(),

  updateProfile: async (id, profileData) =>
    await db
      .updateTable("users")
      .set({
        ...profileData,
        updated_at: new Date(),
      })
      .where("id", "=", id)
      .returning([
        "id",
        "email",
        "full_name",
        "phone",
        "city",
        "address",
        "birth_date",
        "preferred_language",
        "created_at",
        "updated_at",
      ])
      .execute(),
};
