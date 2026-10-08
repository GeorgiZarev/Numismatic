import { useTranslation } from "react-i18next";
import { addressCountries } from "../../utils/addressCountries";

const inputClass = "min-h-12 w-full min-w-0 border border-[#dce3df] bg-[#f5f6f5] px-4 text-base text-[#17342c] outline-none transition-colors placeholder:text-[#7e8a83] focus:border-[#2a6556] focus:bg-white";

const AddressDetailsFields = ({ data, onChange }) => {
  const { t, i18n } = useTranslation();
  const countryNames = new Intl.DisplayNames([i18n.language, "en"], { type: "region" });

  const field = (name, label, autoComplete, options = {}) => (
    <label className="block min-w-0">
      <span className="mb-2 block text-sm font-medium text-[#263c34]">{t(label)}{options.required && <> <span aria-hidden="true">*</span></>}</span>
      <input
        name={name}
        type="text"
        autoComplete={autoComplete}
        value={data[name] || ""}
        onChange={onChange}
        required={options.required}
        maxLength={options.maxLength}
        className={inputClass}
      />
    </label>
  );

  return (
    <div className="grid gap-5 sm:gap-6">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,0.65fr)_minmax(0,1.3fr)] lg:gap-6">
        <div className="md:col-span-2 lg:col-span-1">{field("address", "addressFields.street", "address-line1", { required: true })}</div>
        {field("postal_code", "addressFields.postalCode", "postal-code", { required: true, maxLength: 30 })}
        {field("city", "addressFields.city", "address-level2", { required: true })}
      </div>
      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        {field("address_line_2", "addressFields.additional", "address-line2")}
        <label className="block min-w-0">
          <span className="mb-2 block text-sm font-medium text-[#263c34]">{t("addressFields.country")} <span aria-hidden="true">*</span></span>
          <select name="country" autoComplete="country" value={data.country || ""} onChange={onChange} required className={inputClass}>
            <option value="" disabled>{t("addressFields.selectCountry")}</option>
            {addressCountries.map((code) => <option key={code} value={code}>{countryNames.of(code)}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
};

export default AddressDetailsFields;
