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

  getByCountry: async (country) => {
    return await db
      .selectFrom("coins")
      .selectAll()
      .where("country", "=", country)
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

  getFiltered: async (filters) => {
    let query = db.selectFrom("coins").selectAll();

    if (filters.country) {
      console.log("1");

      query = query.where("country", "=", filters.country);
    }

    if (filters.composition_metal) {
      console.log("dasdasdasd");
      query = query.where("composition_metal", "=", filters.composition_metal);
    }

    if (filters.coin_grading) {
      query = query.where("coin_grading", "=", filters.coin_grading);
    }

    if (filters.minPrice) {
      query = query.where("price", ">=", Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      query = query.where("price", "<=", Number(filters.maxPrice));
    }

    if (filters.sort && filters.order) {
      const sortField = filters.sort;
      const sortOrder = filters.order === "desc" ? "desc" : "asc";
      query = query.orderBy(sortField, sortOrder);
    }

    return await query.execute();
  },
};
