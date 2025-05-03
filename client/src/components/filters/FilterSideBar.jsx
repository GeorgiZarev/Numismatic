import React from "react";
import { Select, InputNumber, Button, Divider } from "antd";

const { Option } = Select;

const countryOptions = [
  "All",
  "Bulgaria",
  "Serbia",
  "Romania",
  "Greece",
  "Montenegro",
  "Ottoman Empire",
];
const materialOptions = ["Silver", "Gold", "Copper", "Bronze"];
const gradeOptions = ["MS-70", "MS-65", "XF", "VF", "Fine"];
const sortFields = [
  { label: "Price Asc", value: "price-asc" },
  { label: "Price Desc", value: "price-desc" },
  { label: "Year Asc", value: "year-asc" },
  { label: "Year Desc", value: "year-desc" },
];

const FilterSideBar = ({ filters, onChange, onReset }) => {
  const handleSortChange = (value) => {
    if (!value) {
      onChange("sort", "");
      onChange("order", "");
      return;
    }

    const [sort, order] = value.split("-");
    onChange("sort", sort);
    onChange("order", order);
  };

  return (
    <div className="w-full sm:min-w-[15rem] bg-white p-4 border rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Filter Coins</h3>

      <Divider plain>Country</Divider>
      <Select
        className="w-full mb-4"
        value={filters.country}
        onChange={(val) => onChange("country", val)}
      >
        {countryOptions.map((c) => (
          <Option key={c} value={c}>
            {c}
          </Option>
        ))}
      </Select>

      <Divider plain>Price Range</Divider>
      <div className="flex gap-2 mb-4">
        <InputNumber
          min={0}
          placeholder="Min"
          className="w-full"
          value={filters.minPrice}
          onChange={(val) => onChange("minPrice", val)}
        />
        <InputNumber
          min={0}
          placeholder="Max"
          className="w-full"
          value={filters.maxPrice}
          onChange={(val) => onChange("maxPrice", val)}
        />
      </div>

      <Divider plain>Material</Divider>
      <Select
        className="w-full mb-4"
        value={filters.composition_metal}
        onChange={(val) => onChange("composition_metal", val)}
        allowClear
      >
        {materialOptions.map((m) => (
          <Option key={m} value={m}>
            {m}
          </Option>
        ))}
      </Select>

      <Divider plain>Grading</Divider>
      <Select
        className="w-full mb-4"
        value={filters.coin_grading}
        onChange={(val) => onChange("coin_grading", val)}
        allowClear
      >
        {gradeOptions.map((g) => (
          <Option key={g} value={g}>
            {g}
          </Option>
        ))}
      </Select>

      <Divider plain>Sort By</Divider>
      <Select
        className="w-full mb-4"
        placeholder="Sort by"
        value={
          filters.sort && filters.order
            ? `${filters.sort}-${filters.order}`
            : undefined
        }
        onChange={handleSortChange}
        allowClear
      >
        {sortFields.map((s) => (
          <Option key={s.value} value={s.value}>
            {s.label}
          </Option>
        ))}
      </Select>

      <Button onClick={onReset} block danger type="primary">
        Reset Filters
      </Button>
    </div>
  );
};

export default FilterSideBar;
