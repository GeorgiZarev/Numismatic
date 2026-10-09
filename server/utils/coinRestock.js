export const restockTimestamp = (previousQuantity, nextQuantity, now = new Date()) =>
  nextQuantity !== undefined && Number(nextQuantity) > Number(previousQuantity) ? now : null;
