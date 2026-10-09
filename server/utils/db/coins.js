import db from "../../config/kysely.js";
import { sql } from "kysely";

/**
 * * Coin-related DB queries using Kysely
 */
export const Coins = {
  getAll: async () => {
    return await db
      .selectFrom("coins")
      .selectAll()
      .where("status", "=", "active")
      .where((eb) => eb.or([eb("stock_quantity", ">", 0), eb("zero_stock_action", "=", "show")]))
      .orderBy("created_at", "desc")
      .execute();
  },

  getById: async (id, includeUnavailable = false) => {
    let query = db
      .selectFrom("coins")
      .selectAll()
      .where("id", "=", id);
    if (!includeUnavailable) {
      query = query.where("status", "=", "active")
        .where((eb) => eb.or([eb("stock_quantity", ">", 0), eb("zero_stock_action", "=", "show")]));
    }
    return query.execute();
  },

  getByCountry: async (country) => {
    return await db
      .selectFrom("coins")
      .selectAll()
      .where("country", "=", country)
      .where("status", "=", "active")
      .where((eb) => eb.or([eb("stock_quantity", ">", 0), eb("zero_stock_action", "=", "show")]))
      .execute();
  },

  create: async (coinData) => {
    return await db
      .insertInto("coins")
      .values(coinData)
      .returningAll()
      .execute();
  },

  update: async (id, coinData, expectedQuantity) => {
    let query = db
      .updateTable("coins")
      .set(coinData)
      .where("id", "=", id);
    if (coinData.stock_quantity !== undefined) {
      query = query.where("stock_quantity", "=", expectedQuantity);
    }
    return query.returningAll().execute();
  },

  delete: async (id) => {
    return await db
      .deleteFrom("coins")
      .where("id", "=", id)
      .where(({ not, exists, selectFrom }) => not(exists(
        selectFrom("order_items")
          .innerJoin("orders", "orders.id", "order_items.order_id")
          .select("order_items.id")
          .whereRef("order_items.coin_id", "=", "coins.id")
          .where("orders.status", "not in", ["sent", "completed", "cancelled", "canceled"])
      )))
      .returning(["id"])
      .execute();
  },

  getFiltered: async (filters) => {
    let query = db.selectFrom("coins").selectAll();

    if (filters.includeUnavailable !== "true") {
      query = query.where("status", "=", "active")
        .where((eb) => eb.or([eb("stock_quantity", ">", 0), eb("zero_stock_action", "=", "show")]));
    } else if (filters.status) {
      query = query.where("status", "=", filters.status);
    }

    if (filters.product_type) {
      query = query.where("product_type", "=", filters.product_type);
    }

    if (filters.consumable_category) {
      query = query.where("product_type", "=", "consumable")
        .where("consumable_category", "=", filters.consumable_category);
    }

    if (filters.country) {
      query = query.where("country", "=", filters.country);
    }

    if (filters.search?.trim()) {
      const searchTerm = `%${filters.search.trim().toLowerCase()}%`;

      query = query.where((eb) =>
        eb.or([
          sql`LOWER(name) LIKE ${searchTerm}`,
          sql`LOWER(monarch) LIKE ${searchTerm}`,
        ])
      );
    }
    if (filters.composition_metal) {
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
