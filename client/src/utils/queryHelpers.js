export const buildQueryString = (params = {}) =>
  new URLSearchParams(
    Object.entries(params).filter(([_, value]) => value != null && value !== "")
  ).toString();
