export const consumableCategories = [
  { value: "capsules", label: "Capsules" },
  { value: "cleaning_solutions", label: "Cleaning solutions" },
  { value: "cardboard_holders", label: "Cardboard holders (kartoncheta)" },
];

export const getConsumableCategoryLabel = (value) =>
  consumableCategories.find((category) => category.value === value)?.label || "Consumable";
