import db from "../../config/kysely.js";

export const Addresses = {
  list: (userId) => db.selectFrom("user_addresses").selectAll()
    .where("user_id", "=", userId).orderBy("is_default", "desc")
    .orderBy("created_at", "asc").execute(),

  async create(userId, values) {
    const existing = await this.list(userId);
    const makeDefault = values.is_default || existing.length === 0;
    if (makeDefault) {
      await db.updateTable("user_addresses").set({ is_default: false })
        .where("user_id", "=", userId).execute();
    }
    const [address] = await db.insertInto("user_addresses")
      .values({ ...values, user_id: userId, is_default: makeDefault })
      .returningAll().execute();
    return address;
  },

  async update(userId, id, values) {
    if (values.is_default) {
      await db.updateTable("user_addresses").set({ is_default: false })
        .where("user_id", "=", userId).execute();
    }
    const [address] = await db.updateTable("user_addresses").set(values)
      .where("user_id", "=", userId).where("id", "=", id)
      .returningAll().execute();
    return address;
  },

  async remove(userId, id) {
    const [deleted] = await db.deleteFrom("user_addresses")
      .where("user_id", "=", userId).where("id", "=", id)
      .returningAll().execute();
    if (deleted?.is_default) {
      const [next] = await this.list(userId);
      if (next) await this.update(userId, next.id, { is_default: true });
    }
    return deleted;
  },
};
