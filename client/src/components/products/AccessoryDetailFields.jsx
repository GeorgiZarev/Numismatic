const fieldClass = "mt-2 h-11 w-full rounded-md border border-[#dce4df] bg-white px-3.5 text-sm text-[#203730] outline-none focus:border-[#4b8a70] focus:ring-2 focus:ring-[#d9e9de]";

const AccessoryDetailFields = ({ formData, onChange }) => {
  if (formData.consumable_category === "cleaning_solutions") {
    return (
      <section className="grid gap-4 sm:grid-cols-2">
        <h3 className="text-base font-semibold text-[#203730] sm:col-span-2">Cleaning solution details</h3>
        <label className="block text-sm font-medium text-[#354840]">Company
          <input name="company" required value={formData.company || ""} onChange={onChange} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-[#354840]">Volume (ml)
          <input type="number" min="1" step="1" name="volume_ml" required value={formData.volume_ml || ""} onChange={onChange} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-[#354840] sm:col-span-2">Suitable metals
          <input name="suitable_metals" required value={formData.suitable_metals || ""} onChange={onChange} className={fieldClass} placeholder="e.g. gold, silver" />
        </label>
      </section>
    );
  }

  if (["capsules", "cardboard_holders"].includes(formData.consumable_category)) {
    return (
      <section className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[#354840]">Pieces per box *
          <input type="number" min="1" step="1" name="pieces_per_box" required value={formData.pieces_per_box ?? ""} onChange={onChange} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-[#354840]">Company (optional)
          <input name="company" value={formData.company || ""} onChange={onChange} className={fieldClass} />
        </label>
      </section>
    );
  }

  return null;
};

export default AccessoryDetailFields;
