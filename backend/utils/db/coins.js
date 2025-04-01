import db from "../../config/kysely.js";

/**
 * * Coin-related DB queries using Kysely
 */
export const Coins = {
  getAll: async () => {
    return await db
      .selectFrom("coins")
      .selectAll()
      .orderBy("created_at", "desc")
      .execute();
  },

  getById: async (id) => {
    return await db
      .selectFrom("coins")
      .selectAll()
      .where("id", "=", id)
      .execute();
  },

  create: async (coinData) => {
    return await db
      .insertInto("coins")
      .values(coinData)
      .returningAll()
      .execute();
  },

  update: async (id, coinData) => {
    return await db
      .updateTable("coins")
      .set(coinData)
      .where("id", "=", id)
      .returningAll()
      .execute();
  },

  delete: async (id) => {
    return await db
      .deleteFrom("coins")
      .where("id", "=", id)
      .returning(["id"])
      .execute();
  },
};
