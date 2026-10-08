import { countryCallingCodes } from "../../utils/phoneNumber";

const fieldClass = "min-h-12 min-w-0 w-full border border-[#dce3df] bg-[#f5f6f5] px-3 text-base text-[#17342c] outline-none focus:border-[#2a6556] focus:bg-white";

const PhoneNumberField = ({ countryCode, number, onChange, t }) => (
  <fieldset className="min-w-0">
    <legend className="mb-2 text-sm font-medium text-[#263c34]">{t("auth.phone")} <span aria-hidden="true">*</span></legend>
    <div className="grid min-w-0 grid-cols-[8.5rem_minmax(0,1fr)] gap-2 sm:gap-3">
      <label className="min-w-0">
        <span className="sr-only">{t("auth.phoneCountryCode")}</span>
        <select name="phone_country_code" value={countryCode} onChange={onChange} aria-label={t("auth.phoneCountryCode")} className={fieldClass}>
          {countryCallingCodes.map(({ country, code }) => <option key={country} value={code}>{country} ({code})</option>)}
        </select>
      </label>
      <label className="min-w-0">
        <span className="sr-only">{t("auth.phone")}</span>
        <input name="phone" type="tel" autoComplete="tel-national" inputMode="tel" value={number} onChange={onChange} required aria-label={t("auth.phone")} placeholder={t("auth.phonePlaceholder")} className={fieldClass} />
      </label>
    </div>
  </fieldset>
);

export default PhoneNumberField;
