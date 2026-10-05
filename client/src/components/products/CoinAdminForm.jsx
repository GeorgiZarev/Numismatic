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
      <input
        type="text"
        name="name"
        placeholder="Coin Name *"
        value={formData.name}
        onChange={onChange}
        required
        className="border p-3 rounded"
      />
      <input
        type="number"
        name="price"
        placeholder="Price *"
        value={formData.price}
        onChange={onChange}
        required
        className="border p-3 rounded"
      />
      <input
        type="number"
        name="year"
        placeholder="Year *"
        value={formData.year}
        onChange={onChange}
        required
        className="border p-3 rounded"
      />
      <select
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
      </select>
      <input
        type="text"
        name="currency"
        placeholder="Currency *"
        value={formData.currency}
        onChange={onChange}
        required
        className="border p-3 rounded"
      />
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
      {[
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
        {loading ? "Saving..." : mode === "edit" ? "Save coin" : "Create coin"}
      </button>
    </form>
  );
};

export default CoinAdminForm;
