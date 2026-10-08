import AuthField from "./AuthField";
import BirthDateSelect from "./BirthDateSelect";
import PhoneNumberField from "./PhoneNumberField";
import AddressDetailsFields from "../address/AddressDetailsFields";

const RegistrationFields = ({ data, onChange, t }) => {
  const field = (name, type = "text", options = {}) => (
    <AuthField
      id={`register-${name}`}
      name={name}
      type={type}
      label={t(`auth.${name}`)}
      value={data[name]}
      onChange={onChange}
      t={t}
      {...options}
    />
  );

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-6">
        {field("first_name", "text", { autoComplete: "given-name" })}
        {field("last_name", "text", { autoComplete: "family-name" })}
        <div className="grid min-w-0 gap-5 lg:col-span-2 lg:grid-cols-2 lg:gap-8">
          <BirthDateSelect day={data.birth_day} month={data.birth_month} year={data.birth_year} onChange={onChange} t={t} className="" />
          <PhoneNumberField countryCode={data.phone_country_code} number={data.phone} onChange={onChange} t={t} />
        </div>
        {field("email", "email", { autoComplete: "email" })}
        {field("email_confirmation", "email", { autoComplete: "email" })}
        {field("password", "password", { autoComplete: "new-password", minLength: 6 })}
        <label htmlFor="register-preferred_language" className="block min-w-0">
          <span className="mb-2 block text-sm font-medium text-[#263c34]">{t("auth.preferred_language")}</span>
          <select id="register-preferred_language" name="preferred_language" value={data.preferred_language} onChange={onChange} className="min-h-12 w-full border border-[#dce3df] bg-[#f5f6f5] px-4 text-base text-[#17342c] outline-none focus:border-[#2a6556] focus:bg-white">
            <option value="bg">{t("auth.bulgarian")}</option>
            <option value="en">{t("auth.english")}</option>
          </select>
        </label>
      </div>

      <section aria-labelledby="registration-address-title" className="mt-10 border-t border-[#dce3df] pt-9">
        <h3 id="registration-address-title" className="mb-6 font-serif text-2xl font-semibold text-[#142e28]">{t("auth.yourAddress")}</h3>
        <AddressDetailsFields data={data} onChange={onChange} />
      </section>
    </>
  );
};

export default RegistrationFields;
