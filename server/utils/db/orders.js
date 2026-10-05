import db from "../../config/kysely.js";
import { sql } from "kysely";

const unavailableStatuses = ["draft", "sold", "hidden"];

export const Orders = {
  create: async ({ userId, orderData, items }) => {
    const coinIds = items.map((item) => item.coin_id);
    const coins = await db
      .selectFrom("coins")
      .select(["id", "name", "photo_url", "price", "status"])
      .where("id", "in", coinIds)
      .execute();

    const coinMap = new Map(coins.map((coin) => [coin.id, coin]));
    const orderItems = items.map((item) => {
      const coin = coinMap.get(item.coin_id);
      if (!coin) {
        throw new Error(`Coin not found: ${item.coin_id}`);
      }
      if (unavailableStatuses.includes(coin.status)) {
        throw new Error(`Coin is not available: ${coin.name}`);
      }

      return {
        coin_id: coin.id,
        coin_name: coin.name,
        photo_url: coin.photo_url,
        price: Number(coin.price),
        quantity: Number(item.quantity || 1),
      };
    });

    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const [order] = await db
      .insertInto("orders")
      .values({
        ...orderData,
        user_id: userId,
        total,
      })
      .returningAll()
      .execute();

    const savedItems = await db
      .insertInto("order_items")
      .values(orderItems.map((item) => ({ ...item, order_id: order.id })))
      .returningAll()
      .execute();

    return { ...order, items: savedItems };
  },

  getByUserId: async (userId) => {
    const orders = await db
      .selectFrom("orders")
      .selectAll()
      .where("user_id", "=", userId)
      .orderBy("created_at", "desc")
      .execute();

    return attachItems(orders);
  },

  getById: async (id) => {
    const orders = await db
      .selectFrom("orders")
      .selectAll()
      .where("id", "=", id)
      .execute();

    const [order] = await attachItems(orders);
    return order;
  },

  getAll: async (filters = {}) => {
    let query = db
      .selectFrom("orders")
      .selectAll();

    if (filters.status) {
      query = query.where("status", "=", filters.status);
    }

    if (filters.search?.trim()) {
      const searchTerm = `%${filters.search.trim().toLowerCase()}%`;
      query = query.where((eb) =>
        eb.or([
          sql`LOWER(customer_name) LIKE ${searchTerm}`,
          sql`LOWER(phone) LIKE ${searchTerm}`,
          sql`LOWER(email) LIKE ${searchTerm}`,
          sql`LOWER(city) LIKE ${searchTerm}`,
          sql`LOWER(address) LIKE ${searchTerm}`,
        ])
      );
    }

    if (filters.fromDate) {
      query = query.where("created_at", ">=", new Date(filters.fromDate));
    }

    if (filters.toDate) {
      query = query.where("created_at", "<=", new Date(filters.toDate));
    }

    const orders = await query
      .orderBy("created_at", "desc")
      .execute();

    return attachItems(orders);
  },

  updateStatus: async (id, status) => {
    const [order] = await db
      .updateTable("orders")
      .set({ status, updated_at: new Date() })
      .where("id", "=", id)
      .returningAll()
      .execute();

    return order;
  },
};

async function attachItems(orders) {
  if (orders.length === 0) return [];

  const orderIds = orders.map((order) => order.id);
  const items = await db
    .selectFrom("order_items")
    .selectAll()
    .where("order_id", "in", orderIds)
    .execute();

  return orders.map((order) => ({
    ...order,
    items: items.filter((item) => item.order_id === order.id),
  }));
}
