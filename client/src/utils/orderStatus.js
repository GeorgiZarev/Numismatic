export const ORDER_STATUSES = ["new", "confirmed", "packed", "sent", "completed", "cancelled"];

export const normalizeOrderStatus = (status) => (status === "canceled" ? "cancelled" : status);

// One colour per status, used by every order list so they always match.
const STATUS_STYLES = {
  new: "border-[#bcd0f7] bg-[#eaf1fe] text-[#1d4ed8]",
  pending: "border-[#bcd0f7] bg-[#eaf1fe] text-[#1d4ed8]",
  confirmed: "border-[#a9dcc4] bg-[#e6f6ee] text-[#17603f]",
  packed: "border-[#d5c4f3] bg-[#f3edfd] text-[#6b3fb3]",
  sent: "border-[#f5cf96] bg-[#fff4e2] text-[#8a4f00]",
  completed: "border-[#235b50] bg-[#235b50] text-white",
  cancelled: "border-[#f3b8b3] bg-[#fdecea] text-[#b42318]",
};

export const orderStatusClass = (status) => STATUS_STYLES[normalizeOrderStatus(status)] || "border-[#d6ddd9] bg-[#f3f5f4] text-[#3f4f48]";

// Stock bookkeeping groups: pending orders hold a reservation, approved orders have taken
// the boxes out of real stock, cancelled orders hold nothing.
const PENDING = ["new", "pending"];
const COMMITTED = ["confirmed", "packed", "sent", "completed"];

const stockState = (status, stockCommitted) => {
  const normalized = normalizeOrderStatus(status);
  if (normalized === "cancelled") return "none";
  if (COMMITTED.includes(normalized) || stockCommitted) return "taken";
  return PENDING.includes(normalized) ? "reserved" : "none";
};

const targetState = (status) => {
  const normalized = normalizeOrderStatus(status);
  if (COMMITTED.includes(normalized)) return "taken";
  if (PENDING.includes(normalized)) return "reserved";
  return "none";
};

// What a status change does to stock: "take", "return", "release", "reserve", "returnAndReserve" or "none".
export const orderStockEffect = (fromStatus, stockCommitted, toStatus) => {
  const from = stockState(fromStatus, stockCommitted);
  const to = targetState(toStatus);
  if (from === to) return "none";
  if (to === "taken") return "take";
  if (from === "taken") return to === "reserved" ? "returnAndReserve" : "return";
  if (to === "reserved") return "reserve";
  return "release";
};
