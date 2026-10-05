const countries = ["Montenegro", "Bulgaria", "Serbia", "Romania", "Greece"];
const statuses = ["active", "draft", "sold", "hidden"];

const CoinAdminForm = ({
  formData,
  loading,
  mode = "create",
  onChange,
  onFileChange,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border rounded-lg p-5"
    >
      <label className="block"><span className="block text-sm mb-1">Product type</span><select name="product_type" value={formData.product_type || "coin"} onChange={onChange} className="border p-3 rounded w-full"><option value="coin">Coin</option><option value="consumable">Consumable</option></select></label>
      <input
        type="text"
        name="name"
        placeholder="Product name *"
        value={formData.name}
        onChange={onChange}
        required
        className="border p-3 rounded"
      />
      <textarea name="description" value={formData.description || ""} onChange={onChange} placeholder="Description" className="border p-3 rounded sm:col-span-2 min-h-24" />
      <input
        type="number"
        name="price"
        min="0"
        step="0.01"
        placeholder="Price in € *"
        value={formData.price}
        onChange={onChange}
        required
        className="border p-3 rounded"
      />
      {formData.product_type !== "consumable" && <input
        type="number"
        name="year"
        placeholder="Year *"
        value={formData.year}
        onChange={onChange}
        required
        className="border p-3 rounded"
      />}
      {formData.product_type !== "consumable" && <select
        name="country"
        value={formData.country}
        onChange={onChange}
        required
        className="border p-3 rounded"
      >
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>}
      <select
        name="status"
        value={formData.status}
        onChange={onChange}
        className="border p-3 rounded"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      {formData.product_type !== "consumable" && [
        ["monarch", "Monarch"],
        ["price_value", "Price Value"],
        ["composition_metal", "Composition Metal"],
        ["weight", "Weight"],
        ["diameter", "Diameter"],
        ["shape", "Shape"],
        ["technique", "Technique"],
        ["denomination", "Denomination"],
        ["lettering", "Lettering"],
        ["script", "Script"],
        ["mintage", "Mintage"],
        ["mint_place", "Mint Place"],
        ["coin_grading", "Coin Grading"],
        ["number", "Number"],
      ].map(([name, label]) => (
        <input
          key={name}
          type={name === "mintage" ? "number" : "text"}
          name={name}
          placeholder={label}
          value={formData[name] || ""}
          onChange={onChange}
          className="border p-3 rounded"
        />
      ))}
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="col-span-1 sm:col-span-2 border p-3 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="col-span-1 sm:col-span-2 bg-green-600 text-white p-3 rounded hover:bg-green-700 disabled:opacity-70"
      >
        {loading ? "Saving..." : mode === "edit" ? "Save product" : "Create product"}
      </button>
    </form>
  );
};

export default CoinAdminForm;
