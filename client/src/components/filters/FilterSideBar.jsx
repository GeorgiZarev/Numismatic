import React, { useState } from "react";
import { Select, InputNumber, Button, Divider, Drawer, Grid } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { useBreakpoint } = Grid;

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
  const screens = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useTranslation();

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

  const FilterForm = () => (
    <div className="w-full sm:min-w-[15rem] bg-white p-4">
      <h3 className="text-lg font-semibold mb-4">{t("filters.title")}</h3>

      <Divider plain>{t("filters.country")}</Divider>
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

      <Divider plain>{t("filters.price_range")}</Divider>
      <div className="flex gap-2 mb-4">
        <InputNumber
          min={0}
          placeholder={t("filters.min")}
          className="w-full"
          value={filters.minPrice}
          onChange={(val) => onChange("minPrice", val)}
        />
        <InputNumber
          min={0}
          placeholder={t("filters.max")}
          className="w-full"
          value={filters.maxPrice}
          onChange={(val) => onChange("maxPrice", val)}
        />
      </div>

      <Divider plain>{t("filters.material")}</Divider>
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

      <Divider plain>{t("filters.grading")}</Divider>
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

      <Divider plain>{t("filters.sort")}</Divider>
      <Select
        className="w-full mb-4"
        placeholder={t("filters.sort_placeholder")}
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
            {s.value || s.label}
          </Option>
        ))}
      </Select>

      <Button onClick={onReset} block danger type="primary">
        {t("filters.reset")}
      </Button>
    </div>
  );

  return (
    <>
      {!screens.sm ? (
        <>
          <Button
            type="primary"
            onClick={() => setDrawerOpen(true)}
            className="mb-4"
            block
          >
            {t("filters.title")}
          </Button>
          <Drawer
            title={t("filters.title")}
            placement="left"
            onClose={() => setDrawerOpen(false)}
            open={drawerOpen}
          >
            {FilterForm()}
          </Drawer>
        </>
      ) : (
        <div className="sticky top-[7rem] self-start h-fit border rounded-md shadow-sm">
          {FilterForm()}
        </div>
      )}
    </>
  );
};

export default FilterSideBar;
