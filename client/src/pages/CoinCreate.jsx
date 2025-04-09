import React, { useState } from "react";
import { useAuth } from "../Contexts/authContext";
import { useCoins } from "../hooks/useCoins";
import { useNavigate } from "react-router-dom";

const CoinCreate = () => {
  const { createCoin } = useCoins();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    year: "",
    country: "Montenegro",
    currency: "",
    monarch: "",
    price_value: "",
    composition_metal: "",
    weight: "",
    diameter: "",
    shape: "",
    technique: "",
    denomination: "",
    lettering: "",
    script: "",
    mintage: "",
    mint_place: "",
    coin_grading: "",
    number: "",
    photo: null,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "photo" && value) {
          data.append("photo", value);
        } else if (value !== "") {
          data.append(key, value);
        }
      });

      await createCoin(data, true);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        const backendError = err.response.data.error;

        if (Array.isArray(backendError.details)) {
          const messages = backendError.details.map((d) => d.msg).join(", ");
          setError(messages);
        } else {
          setError(backendError.message || "Failed to create coin.");
        }
      } else {
        setError("Failed to create coin. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {/* 🔴 Logout */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center">Create New Coin</h1>

      {/* 📝 Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* Main required fields */}
        <input
          type="text"
          name="name"
          placeholder="Coin Name *"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price *"
          value={formData.price}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="year"
          placeholder="Year *"
          value={formData.year}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="Montenegro">Montenegro</option>
          <option value="Bulgaria">Bulgaria</option>
          <option value="Serbia">Serbia</option>
          <option value="Romania">Romania</option>
          <option value="Greece">Greece</option>
        </select>

        <input
          type="text"
          name="currency"
          placeholder="Currency *"
          value={formData.currency}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        {/* Optional fields */}
        <input
          type="text"
          name="monarch"
          placeholder="Monarch"
          value={formData.monarch}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="price_value"
          placeholder="Price Value"
          value={formData.price_value}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="composition_metal"
          placeholder="Composition Metal"
          value={formData.composition_metal}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="weight"
          placeholder="Weight"
          value={formData.weight}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="diameter"
          placeholder="Diameter"
          value={formData.diameter}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="shape"
          placeholder="Shape"
          value={formData.shape}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="technique"
          placeholder="Technique"
          value={formData.technique}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="denomination"
          placeholder="Denomination"
          value={formData.denomination}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="lettering"
          placeholder="Lettering"
          value={formData.lettering}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="script"
          placeholder="Script"
          value={formData.script}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="mintage"
          placeholder="Mintage"
          value={formData.mintage}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="mint_place"
          placeholder="Mint Place"
          value={formData.mint_place}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="coin_grading"
          placeholder="Coin Grading"
          value={formData.coin_grading}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="number"
          placeholder="Number"
          value={formData.number}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* 🖼️ File upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="col-span-1 sm:col-span-2 border p-2 rounded"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="col-span-1 sm:col-span-2 bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
        >
          {loading ? "Creating..." : "Create Coin"}
        </button>

        {/* Error */}
        {error && (
          <p className="col-span-1 sm:col-span-2 text-center text-red-500">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default CoinCreate;
