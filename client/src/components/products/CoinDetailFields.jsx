import { coinDetailFields } from "../../utils/coinFields";

const CoinDetailFields = ({ formData, onChange, inputClass }) => (
  <section className="border-t border-[#e7ece8] pt-7">
    <h3 className="mb-5 text-base font-semibold text-[#203730]">Coin details</h3>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {coinDetailFields.map((field) => (
        <label key={field.name} className="block min-w-0">
          <span className="text-sm font-medium text-[#354840]">{field.label}{field.required ? " *" : ""}</span>
          <input
            type={field.type || "text"}
            name={field.name}
            value={formData[field.name] ?? ""}
            min={field.min}
            max={field.max}
            step={field.step}
            maxLength={field.maxLength}
            inputMode={field.inputMode}
            required={field.required}
            onChange={onChange}
            className={inputClass}
          />
        </label>
      ))}
    </div>
  </section>
);

export default CoinDetailFields;
