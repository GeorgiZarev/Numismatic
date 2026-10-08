import { useTranslation } from "react-i18next";
import { dangerButtonClass, secondaryButtonClass } from "./profileStyles";

const AddressCard = ({ address, onEdit, onSetDefault, onDelete, busy }) => {
  const { t, i18n } = useTranslation();
  const countryName = address.country
    ? new Intl.DisplayNames([i18n.language, "en"], { type: "region" }).of(address.country)
    : "";

  return (
    <article className="flex h-full flex-col border border-[#dce3df] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-serif text-xl font-semibold text-[#142e28]">{address.label}</h3>
        {address.is_default && <span className="border border-[#b9c9c0] bg-[#edf3f0] px-2.5 py-1 text-xs font-semibold uppercase text-[#235b50]">{t("profile.default")}</span>}
      </div>
      <div className="mt-4 space-y-1 text-sm leading-relaxed text-[#40564c]">
        <p className="font-semibold text-[#17342c]">{address.full_name}</p>
        <p>{address.address}</p>
        {address.address_line_2 && <p>{address.address_line_2}</p>}
        <p>{[address.postal_code, address.city, countryName].filter(Boolean).join(", ")}</p>
        <p>{address.phone}</p>
        {address.notes && <p className="pt-2 text-[#62736a]">{address.notes}</p>}
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        <button type="button" className={secondaryButtonClass} onClick={() => onEdit(address)}>{t("profile.edit")}</button>
        {!address.is_default && <button type="button" disabled={busy} className={secondaryButtonClass} onClick={() => onSetDefault(address)}>{t("profile.setDefault")}</button>}
        <button type="button" disabled={busy} className={dangerButtonClass} onClick={() => onDelete(address.id)}>{t("profile.delete")}</button>
      </div>
    </article>
  );
};

export default AddressCard;
