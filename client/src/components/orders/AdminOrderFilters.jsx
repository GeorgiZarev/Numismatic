import { FiX } from "react-icons/fi";
import { hasOrderFilters } from "../../utils/adminOrderFilters";
import DateRangePicker from "./DateRangePicker";

const orderStatuses = ["new", "confirmed", "packed", "sent", "completed", "cancelled"];

const fieldClass = "mt-1 block h-11 w-full min-w-0 rounded border border-[#cfd8d3] bg-white px-3 text-sm text-[#203730] focus:border-[#235b50] focus:outline-none focus:ring-2 focus:ring-[#d9e9de]";
const labelClass = "block min-w-0 text-xs font-semibold uppercase text-[#53655b]";

const AdminOrderFilters = ({ filters, cities, onChange, onClear, t }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6" aria-label={t("adminOrders.filters")}>
      <label className={`${labelClass} sm:col-span-2`}>
        {t("adminOrders.search")}
        <input type="search" name="search" value={filters.search} onChange={handleChange} placeholder={t("adminOrders.searchPlaceholder")} className={fieldClass} />
      </label>
      <label className={labelClass}>
        {t("adminOrders.status")}
        <select name="status" value={filters.status} onChange={handleChange} className={fieldClass}>
          <option value="">{t("adminOrders.allStatuses")}</option>
          {orderStatuses.map((status) => <option key={status} value={status}>{t(`adminOrders.statuses.${status}`)}</option>)}
        </select>
      </label>
      <label className={labelClass}>
        {t("adminOrders.city")}
        <select name="city" value={filters.city} onChange={handleChange} className={fieldClass}>
          <option value="">{t("adminOrders.allCities")}</option>
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>
      </label>
      <div className="min-w-0 sm:col-span-2">
        <span className={labelClass}>{t("adminOrders.date")}</span>
        <DateRangePicker
          from={filters.fromDate}
          to={filters.toDate}
          onChange={({ from, to }) => onChange({ ...filters, fromDate: from, toDate: to })}
          locale={t("shop.dateLocale")}
          labels={{
            placeholder: t("adminOrders.datePlaceholder"),
            title: t("adminOrders.date"),
            clear: t("adminOrders.clearDate"),
            previousMonth: t("adminOrders.previousMonth"),
            nextMonth: t("adminOrders.nextMonth"),
            hint: t("adminOrders.dateHint"),
            pickEnd: t("adminOrders.pickEnd"),
            today: t("adminOrders.today"),
            last7: t("adminOrders.last7"),
            thisMonth: t("adminOrders.thisMonth"),
            done: t("adminOrders.done"),
          }}
        />
      </div>
      <div className="flex items-start justify-end sm:col-span-2 lg:col-span-6">
        <button type="button" onClick={onClear} disabled={!hasOrderFilters(filters)} className="inline-flex min-h-11 items-center gap-2 rounded border border-[#cfd8d3] px-4 text-sm font-semibold text-[#203730] hover:bg-[#f1f4f1] disabled:cursor-not-allowed disabled:opacity-50">
          <FiX aria-hidden="true" /> {t("adminOrders.clearFilters")}
        </button>
      </div>
    </div>
  );
};

export default AdminOrderFilters;
