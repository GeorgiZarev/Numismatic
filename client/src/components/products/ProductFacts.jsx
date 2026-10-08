const coinFields = [
  ["name", "name"],
  ["country", "country"],
  ["year", "year"],
  ["composition_metal", "material"],
  ["monarch", "monarch"],
  ["weight", "weight"],
  ["shape", "shape"],
  ["denomination", "denomination"],
  ["script", "script"],
  ["lettering", "lettering"],
  ["mintage", "mintage"],
  ["mint_place", "mint_place"],
  ["coin_grading", "coin_grading"],
];

const ProductFacts = ({ product, editMode, formData, onChange, onFileChange, t }) => {
  const fields = product.product_type === "investment"
    ? [coinFields[0], coinFields[3], coinFields[5]]
    : product.product_type === "consumable" ? [coinFields[0]] : coinFields;
  const visibleFields = fields.filter(([key]) => editMode || (product[key] !== null && product[key] !== undefined && product[key] !== ""));

  return (
    <section className="min-w-0">
      <h2 className="mb-5 font-serif text-2xl font-semibold text-[#132e28]">{t("coinDetails.information")}</h2>
      <dl className="border-t border-[#dce3df]">
        {visibleFields.map(([key, label]) => (
          <div key={key} className="grid grid-cols-[minmax(110px,35%)_minmax(0,1fr)] border-b border-[#e4e9e6] text-sm sm:text-base">
            <dt className="bg-[#f4f6f4] px-3 py-3 font-medium text-[#41544b] sm:px-4">{t(`coinDetails.${label}`)}</dt>
            <dd className="min-w-0 px-3 py-3 text-[#172c27] sm:px-4">
              {editMode ? (
                <input type="text" name={key} value={formData[key] || ""} onChange={onChange} className="min-h-10 w-full border border-[#bdcbc3] bg-white px-2 text-[#172c27] focus:border-[#235b50] focus:outline-none" />
              ) : product[key]}
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
