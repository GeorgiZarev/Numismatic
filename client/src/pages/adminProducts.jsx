import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiX } from "react-icons/fi";
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
    <div className="py-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-[#203730]">Products</h2>
          <p className="mt-1 text-sm text-[#63716a]">Create, edit, hide, or mark products as sold.</p>
        </div>
        <Link to="/admin/products/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#235b50] px-5 text-sm font-semibold text-white hover:bg-[#19473e]">
          <FiPlus size={18} /> Add product
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
        <div className="fixed inset-0 z-[120] overflow-y-auto bg-[#142521]/45 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`Edit ${editingCoin.name}`}>
          <div className="mx-auto max-w-5xl overflow-hidden rounded-md bg-white shadow-xl">
            <div className="flex items-center justify-between gap-4 border-b border-[#e7ece8] px-5 py-4 sm:px-8">
              <h2 className="truncate text-xl font-semibold text-[#203730]">Edit {editingCoin.name}</h2>
              <button type="button" aria-label="Close editor" title="Close editor"
                onClick={() => setEditingCoin(null)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-[#53655b] hover:bg-[#f1f4f1]"
              >
                <FiX size={21} />
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
            {saveError && <p role="alert" className="m-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-8">{saveError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
