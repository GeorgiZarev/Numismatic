export const ZERO_STOCK_ACTIONS = [
  { value: "hide", label: "Hide from customers", className: "border-gray-300 bg-gray-100 text-gray-700" },
  { value: "show", label: "Show as out of stock", className: "border-sky-200 bg-sky-50 text-sky-800" },
  { value: "review_delete", label: "Hide and review for deletion", className: "border-red-200 bg-red-50 text-red-800" },
];

export const getZeroStockAction = (value) =>
  ZERO_STOCK_ACTIONS.find((action) => action.value === value) || ZERO_STOCK_ACTIONS[0];
