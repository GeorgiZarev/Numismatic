import React, { useState } from "react";
import { useCoins } from "../hooks/useCoins";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import CoinAdminForm from "../components/products/CoinAdminForm";
import { buildCoinFormData, emptyCoinForm, savedInventoryMatches } from "../utils/coinForm";
import { useQueryClient } from "@tanstack/react-query";

const CoinCreate = () => {
  const { createCoin } = useCoins();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
      const result = await createCoin(buildCoinFormData(formData));
      if (!savedInventoryMatches(result.coin, formData)) {
        throw new Error("The size quantities were not saved. Please try again.");
      }
      queryClient.invalidateQueries({ queryKey: ["home-products"] });
      queryClient.invalidateQueries({ queryKey: ["shop-products"] });
      navigate("/admin/products");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        const backendError = err.response.data.error;

        if (Array.isArray(backendError.details)) {
          const messages = backendError.details.map((d) => d.msg).join(", ");
          setError(messages);
        } else {
          setError(backendError.message || "Failed to create product.");
        }
      } else {
        setError(err.message || "Failed to create product. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl py-8 font-sans">
      <Link to="/admin/products" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#53655b] hover:text-[#235b50]"><FiArrowLeft size={16} /> Back to products</Link>
      <h2 className="mb-6 text-2xl font-semibold text-[#203730]">New product</h2>
      <CoinAdminForm
        formData={formData}
        loading={loading}
        error={error}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onSizesChange={(sizes) => setFormData((prev) => ({ ...prev, size_stock: sizes }))}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CoinCreate;
