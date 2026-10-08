export const restockTimestamp = (previousStatus, nextStatus, now = new Date()) =>
  previousStatus === "sold" && nextStatus === "active" ? now : null;
