import React, { useState } from "react";
import { useCoins } from "../hooks/useCoins";
import { useNavigate } from "react-router-dom";
import CoinAdminForm from "../components/products/CoinAdminForm";
import { buildCoinFormData, emptyCoinForm } from "../utils/coinForm";

const CoinCreate = () => {
  const { createCoin } = useCoins();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyCoinForm);

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
      await createCoin(buildCoinFormData(formData));
      navigate("/admin/products");
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

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Create product</h2>
      <CoinAdminForm
        formData={formData}
        loading={loading}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
      />
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default CoinCreate;
