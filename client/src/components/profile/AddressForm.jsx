import { useTranslation } from "react-i18next";
import AddressDetailsFields from "../address/AddressDetailsFields";
import { inputClass, primaryButtonClass, secondaryButtonClass } from "./profileStyles";

const fields = ["label", "full_name", "phone"];

const AddressForm = ({ form, onChange, onSubmit, onCancel, editing, saving }) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="mt-7 border border-[#dce3df] bg-[#fbfcfb] p-5 sm:p-7">
      <h3 className="mb-6 font-serif text-2xl font-semibold text-[#142e28]">{t(editing ? "profile.editAddress" : "profile.newAddress")}</h3>
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        {fields.map((name) => (
          <label key={name} className="block min-w-0">
            <span className="mb-2 block text-sm font-medium text-[#263c34]">{t(`profile.${name}`)}</span>
            <input
              name={name}
              type={name === "phone" ? "tel" : "text"}
              autoComplete={name === "full_name" ? "name" : name === "phone" ? "tel" : undefined}
              className={inputClass}
              value={form[name]}
              required
              onChange={onChange}
            />
          </label>
        ))}
      </div>
      <div className="mt-6"><AddressDetailsFields data={form} onChange={onChange} /></div>
      <label className="mt-6 block min-w-0">
        <span className="mb-2 block text-sm font-medium text-[#263c34]">{t("profile.notes")}</span>
        <input name="notes" type="text" className={inputClass} value={form.notes || ""} onChange={onChange} />
      </label>
      <label className="mt-6 flex items-center gap-3 text-sm font-medium text-[#263c34]">
        <input type="checkbox" name="is_default" checked={form.is_default} onChange={onChange} className="h-4 w-4 accent-[#235b50]" />
        {t("profile.useAsDefault")}
      </label>
      <div className="mt-7 flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className={primaryButtonClass}>{t(saving ? "profile.saving" : "profile.saveAddress")}</button>
        <button type="button" className={secondaryButtonClass} onClick={onCancel}>{t("profile.cancel")}</button>
      </div>
    </form>
  );
};

export default AddressForm;
