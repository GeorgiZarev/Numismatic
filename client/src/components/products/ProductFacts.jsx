import { coinDetailFields, formatCoinFact } from "../../utils/coinFields";

const nameField = { name: "name", translationKey: "name" };
const investmentFields = [nameField, { name: "composition_metal", translationKey: "material" }, { name: "weight", translationKey: "weight" }];
const cleaningFields = [nameField, { name: "company", translationKey: "company" }, { name: "volume_ml", translationKey: "volume_ml", type: "number", min: "1" }, { name: "suitable_metals", translationKey: "suitable_metals" }];
const boxFields = [nameField, { name: "company", translationKey: "company" }, { name: "pieces_per_box", translationKey: "pieces_per_box", type: "number", min: "1", step: "1" }];

const ProductFacts = ({ product, editMode, formData, onChange, onFileChange, t }) => {
  const fields = product.product_type === "investment"
    ? investmentFields
    : product.product_type === "consumable" ? product.consumable_category === "cleaning_solutions" ? cleaningFields : boxFields : editMode ? [nameField, ...coinDetailFields] : coinDetailFields;
  const visibleFields = fields.filter(({ name }) => editMode || (product[name] !== null && product[name] !== undefined && product[name] !== ""));

  return (
    <section className="min-w-0">
      <h2 className="mb-5 font-serif text-2xl font-semibold text-[#132e28]">{t("coinDetails.information")}</h2>
      <dl className="border-t border-[#dce3df]">
        {visibleFields.map((field) => (
          <div key={field.name} className="grid grid-cols-[minmax(110px,35%)_minmax(0,1fr)] border-b border-[#e4e9e6] text-sm sm:text-base">
            <dt className="bg-[#f4f6f4] px-3 py-3 font-medium text-[#41544b] sm:px-4">{t(`coinDetails.${field.translationKey}`)}</dt>
            <dd className="min-w-0 px-3 py-3 text-[#172c27] sm:px-4">
              {editMode ? (
                <input type={field.type || "text"} name={field.name} value={formData[field.name] ?? ""} min={field.min} max={field.max} step={field.step} maxLength={field.maxLength} onChange={onChange} className="min-h-10 w-full border border-[#bdcbc3] bg-white px-2 text-[#172c27] focus:border-[#235b50] focus:outline-none" />
              ) : formatCoinFact(field.name, product[field.name], t)}
            </dd>
          </div>
        ))}
        {editMode && (
          <div className="grid grid-cols-[minmax(110px,35%)_minmax(0,1fr)] border-b border-[#e4e9e6] text-sm sm:text-base">
            <dt className="bg-[#f4f6f4] px-3 py-3 font-medium text-[#41544b] sm:px-4">{t("coinDetails.photo")}</dt>
            <dd className="min-w-0 px-3 py-3 sm:px-4"><input type="file" name="photo" accept="image/*" onChange={onFileChange} className="w-full text-sm" /></dd>
          </div>
        )}
      </dl>
    </section>
  );
};

export default ProductFacts;
