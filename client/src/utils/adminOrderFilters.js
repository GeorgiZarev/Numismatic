export const emptyOrderFilters = {
  search: "",
  status: "",
  fromDate: "",
  toDate: "",
  city: "",
};

export const hasOrderFilters = (filters) => Object.values(filters).some((value) => String(value).trim() !== "");

// Text boxes update on every key press, but only the debounced text is sent to the server.
export const orderQueryParams = (filters, debouncedText) => ({
  ...filters,
  search: debouncedText.search.trim(),
  toDate: filters.fromDate && filters.toDate && filters.toDate < filters.fromDate ? "" : filters.toDate,
});
