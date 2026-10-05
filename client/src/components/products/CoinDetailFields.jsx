const mainFields = [
  ["denomination", "Denomination"],
  ["composition_metal", "Metal"],
  ["monarch", "Monarch"],
  ["coin_grading", "Grade"],
];

const extraFields = [
  ["weight", "Weight"],
  ["diameter", "Diameter"],
  ["shape", "Shape"],
  ["technique", "Technique"],
  ["lettering", "Lettering"],
  ["script", "Script"],
  ["mintage", "Mintage"],
  ["mint_place", "Mint place"],
  ["price_value", "Face value"],
  ["number", "Catalog number"],
];

const CoinField = ({ name, label, value, onChange, inputClass }) => (
  <label className="block min-w-0">
    <span className="text-sm font-medium text-[#354840]">{label}</span>
    <input
      type={name === "mintage" ? "number" : "text"}
      name={name}
      value={value || ""}
      onChange={onChange}
      className={inputClass}
    />
  </label>
);

const CoinDetailFields = ({ formData, onChange, inputClass }) => {
  const hasExtraValues = extraFields.some(([name]) => formData[name]);

  return (
    <section className="border-t border-[#e7ece8] pt-7">
      <h3 className="mb-5 text-base font-semibold text-[#203730]">Coin details</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {mainFields.map(([name, label]) => (
          <CoinField key={name} name={name} label={label} value={formData[name]} onChange={onChange} inputClass={inputClass} />
        ))}
      </div>
      <details className="group mt-6" defaultOpen={hasExtraValues}>
        <summary className="cursor-pointer select-none text-sm font-semibold text-[#235b50] hover:text-[#173f36]">
          Additional details
        </summary>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {extraFields.map(([name, label]) => (
            <CoinField key={name} name={name} label={label} value={formData[name]} onChange={onChange} inputClass={inputClass} />
          ))}
        </div>
      </details>
    </section>
  );
};

export default CoinDetailFields;
