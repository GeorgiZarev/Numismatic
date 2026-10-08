import { useTranslation } from "react-i18next";
import { availableBirthDays } from "../../utils/birthDate";

const BirthDateSelect = ({ day, month, year, onChange, t, required = true, labelKey = "auth.birth_date", className = "sm:col-span-2" }) => {
  const { i18n } = useTranslation();
  const today = new Date();
  const currentYear = today.getFullYear();
  const dayCount = availableBirthDays(month, year, today);
  const selectClass = "min-h-12 w-full border border-[#dce3df] bg-[#f5f6f5] px-3 text-base text-[#17342c] outline-none focus:border-[#2a6556] focus:bg-white";

  return (
    <fieldset className={`min-w-0 ${className}`}>
      <legend className="mb-2 text-sm font-medium text-[#263c34]">{t(labelKey)}{required && <> <span aria-hidden="true">*</span></>}</legend>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <label className="min-w-0">
          <span className="sr-only">{t("auth.day")}</span>
          <select name="birth_day" value={day} onChange={onChange} required={required} aria-label={t("auth.day")} className={selectClass}>
            <option value="" disabled={required}>{t("auth.day")}</option>
            {Array.from({ length: dayCount }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
          </select>
        </label>
        <label className="min-w-0">
          <span className="sr-only">{t("auth.month")}</span>
          <select name="birth_month" value={month} onChange={onChange} required={required} aria-label={t("auth.month")} className={selectClass}>
            <option value="" disabled={required}>{t("auth.month")}</option>
            {Array.from({ length: 12 }, (_, index) => {
              const value = index + 1;
              const disabled = year === String(currentYear) && value > today.getMonth() + 1;
              const label = new Intl.DateTimeFormat(i18n.language, { month: "short" }).format(new Date(2024, index, 1));
              return <option key={value} value={value} disabled={disabled}>{label}</option>;
            })}
          </select>
        </label>
        <label className="min-w-0">
          <span className="sr-only">{t("auth.year")}</span>
          <select name="birth_year" value={year} onChange={onChange} required={required} aria-label={t("auth.year")} className={selectClass}>
            <option value="" disabled={required}>{t("auth.year")}</option>
            {Array.from({ length: currentYear - 1899 }, (_, index) => currentYear - index).map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
      </div>
    </fieldset>
  );
};

export default BirthDateSelect;
