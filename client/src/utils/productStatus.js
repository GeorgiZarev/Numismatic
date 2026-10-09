export const productStatuses = [
  { value: "active", label: "Active", className: "border-[#b8ddca] bg-[#e7f5eb] text-[#17613f]" },
  { value: "draft", label: "Draft", className: "border-[#b9d3e8] bg-[#eaf3fa] text-[#275b83]" },
  { value: "sold", label: "Sold", className: "border-[#e8ce9d] bg-[#fff2d8] text-[#865617]" },
  { value: "hidden", label: "Hidden", className: "border-[#d7c1c8] bg-[#f8ebef] text-[#813f56]" },
];

export const getProductStatus = (status) =>
  productStatuses.find((item) => item.value === status) || productStatuses[0];
