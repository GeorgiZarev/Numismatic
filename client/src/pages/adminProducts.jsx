import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminProductList from "../components/products/AdminProductList";
import CoinAdminForm from "../components/products/CoinAdminForm";
import { useCoins } from "../hooks/useCoins";
import { buildCoinFormData, coinToForm } from "../utils/coinForm";

const AdminProducts = () => {
  const { coins, deleteCoin, error, fetchCoins, loading, updateCoin } = useCoins();
  const [editingCoin, setEditingCoin] = useState(null);
  const [formData, setFormData] = useState(null);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    fetchCoins({ includeUnavailable: "true" });
  }, [fetchCoins]);

  const startEdit = (coin) => {
    setSaveError("");
    setEditingCoin(coin);
    setFormData(coinToForm(coin));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    setFormData((prev) => ({ ...prev, photo: event.target.files[0] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaveError("");

    try {
      await updateCoin(editingCoin.id, buildCoinFormData(formData));
      setEditingCoin(null);
      setFormData(null);
      await fetchCoins({ includeUnavailable: "true" });
    } catch (err) {
      setSaveError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Could not save product."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteCoin(id);
    await fetchCoins({ includeUnavailable: "true" });
  };

  return (
    <div className="py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin products</h1>
          <p className="text-gray-600 mt-2">Create, edit, hide, or mark coins as sold.</p>
        </div>
        <Link to="/admin/products/new" className="bg-green-600 text-white px-5 py-3 rounded">
          Add product
        </Link>
      </div>

      {loading && <p className="mb-4">Loading products...</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <AdminProductList
        coins={coins}
        onDelete={handleDelete}
        onEdit={startEdit}
      />

      {editingCoin && formData && (
        <div className="fixed inset-0 z-[120] bg-black/40 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg p-5">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-2xl font-bold">Edit {editingCoin.name}</h2>
              <button
                onClick={() => setEditingCoin(null)}
                className="border px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
            <CoinAdminForm
              formData={formData}
              loading={loading}
              mode="edit"
              onChange={handleChange}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
            />
            {saveError && <p className="text-red-600 mt-4">{saveError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
