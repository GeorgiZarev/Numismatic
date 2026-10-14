import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiX } from "react-icons/fi";
import AdminProductList from "../components/products/AdminProductList";
import AdminProductFilters from "../components/products/AdminProductFilters";
import AdminAccessoryStockTable from "../components/products/AdminAccessoryStockTable";
import AdminCleaningSolutionsTable from "../components/products/AdminCleaningSolutionsTable";
import CoinAdminForm from "../components/products/CoinAdminForm";
import ProductStatusModal from "../components/products/ProductStatusModal";
import ProductMethodModal from "../components/products/ProductMethodModal";
import ProductSizesModal from "../components/products/ProductSizesModal";
import { useCoins } from "../hooks/useCoins";
import { buildCoinFormData, coinToForm, savedInventoryMatches } from "../utils/coinForm";
import { buildSizeStockUpdate } from "../utils/productSizes";
import { useQueryClient } from "@tanstack/react-query";
import { updateCoinField } from "../api/coins";
import { filterAdminProducts } from "../utils/adminProductFilters";

const AdminProducts = () => {
  const { coins, deleteCoin, error, fetchCoins, loading, updateCoin } = useCoins();
  const queryClient = useQueryClient();
  const [editingCoin, setEditingCoin] = useState(null);
  const [formData, setFormData] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [statusProduct, setStatusProduct] = useState(null);
  const [statusError, setStatusError] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [methodProduct, setMethodProduct] = useState(null);
  const [methodError, setMethodError] = useState("");
  const [methodSaving, setMethodSaving] = useState(false);
  const [sizesProduct, setSizesProduct] = useState(null);
  const [sizesError, setSizesError] = useState("");
  const [sizesSaving, setSizesSaving] = useState(false);
  const [productType, setProductType] = useState("all");
  const [accessoryCategory, setAccessoryCategory] = useState("");
  const visibleProducts = filterAdminProducts(coins, productType, accessoryCategory);

  const refreshCatalog = () => {
    queryClient.invalidateQueries({ queryKey: ["home-products"] });
    queryClient.invalidateQueries({ queryKey: ["shop-products"] });
    queryClient.invalidateQueries({ queryKey: ["cart-availability"] });
  };

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
    setSaveError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    setFormData((prev) => ({ ...prev, photo: event.target.files[0] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaveError("");

    try {
      const result = await updateCoin(editingCoin.id, buildCoinFormData(formData));
      if (!savedInventoryMatches(result.coin, formData)) {
        throw new Error("The size quantities were not saved. Please try again.");
      }
      refreshCatalog();
      setEditingCoin(null);
      setFormData(null);
      await fetchCoins({ includeUnavailable: "true" });
    } catch (err) {
      setSaveError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          err.message ||
          "Could not save product."
      );
    }
  };

  const handleStatusSave = async (status) => {
    setStatusError("");
    setStatusSaving(true);
    try {
      const data = new FormData();
      data.append("status", status);
      const result = await updateCoin(statusProduct.id, data);
      if (result.coin?.status !== status) throw new Error("The status was not saved. Please reload and try again.");
      refreshCatalog();
      await fetchCoins({ includeUnavailable: "true" });
      setStatusProduct(null);
    } catch (err) {
      setStatusError(err.response?.data?.error?.message || err.response?.data?.message || err.message || "Could not update status.");
    } finally {
      setStatusSaving(false);
    }
  };

  const handleInlineSave = async (coin, field, value) => {
    const result = await updateCoinField(coin.id, field, value);
    if (Number(result.coin?.[field]) !== value) {
      throw new Error(`The ${field === "price" ? "price" : "quantity"} was not saved. Please reload and try again.`);
    }
    refreshCatalog();
    await fetchCoins({ includeUnavailable: "true" });
  };

  const handleMethodSave = async (method) => {
    setMethodError("");
    setMethodSaving(true);
    try {
      const result = await updateCoinField(methodProduct.id, "zero_stock_action", method);
      if (result.coin?.zero_stock_action !== method) throw new Error("The method was not saved. Please reload and try again.");
      refreshCatalog();
      await fetchCoins({ includeUnavailable: "true" });
      setMethodProduct(null);
    } catch (err) {
      setMethodError(err.response?.data?.error?.message || err.response?.data?.message || err.message || "Could not update method.");
    } finally {
      setMethodSaving(false);
    }
  };

  const handleSizesSave = async (sizes) => {
    setSizesError("");
    setSizesSaving(true);
    try {
      const result = await updateCoin(sizesProduct.id, buildSizeStockUpdate(sizes));
      if (!savedInventoryMatches(result.coin, { ...sizesProduct, size_stock: sizes })) {
        throw new Error("The size quantities were not saved. Please try again.");
      }
      refreshCatalog();
      await fetchCoins({ includeUnavailable: "true" });
      setSizesProduct(null);
    } catch (err) {
      setSizesError(err.response?.data?.error?.message || err.response?.data?.message || err.message || "Could not save stock.");
    } finally {
      setSizesSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteCoin(id);
    refreshCatalog();
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

      <AdminProductFilters
        productType={productType}
        category={accessoryCategory}
        onProductType={(type) => { setProductType(type); setAccessoryCategory(""); }}
        onCategory={setAccessoryCategory}
      />

      {productType === "consumable" && accessoryCategory === "cleaning_solutions" ? (
        <AdminCleaningSolutionsTable
          products={visibleProducts}
          onDelete={handleDelete}
          onEdit={startEdit}
          onChangeStatus={(coin) => { setStatusError(""); setStatusProduct(coin); }}
          onChangeMethod={(coin) => { setMethodError(""); setMethodProduct(coin); }}
          onUpdateField={handleInlineSave}
        />
      ) : ["capsules", "cardboard_holders"].includes(accessoryCategory) && productType === "consumable" ? (
        <AdminAccessoryStockTable
          products={visibleProducts}
          onDelete={handleDelete}
          onEdit={startEdit}
          onChangeStatus={(coin) => { setStatusError(""); setStatusProduct(coin); }}
          onChangeMethod={(coin) => { setMethodError(""); setMethodProduct(coin); }}
          onUpdateField={handleInlineSave}
        />
      ) : (
        <AdminProductList
          coins={visibleProducts}
          onDelete={handleDelete}
          onEdit={startEdit}
          onEditSizes={(coin) => { setSizesError(""); setSizesProduct(coin); }}
          onChangeStatus={(coin) => { setStatusError(""); setStatusProduct(coin); }}
          onChangeMethod={(coin) => { setMethodError(""); setMethodProduct(coin); }}
          onUpdateField={handleInlineSave}
        />
      )}

      {statusProduct && <ProductStatusModal
        product={statusProduct}
        saving={statusSaving}
        error={statusError}
        onClose={() => setStatusProduct(null)}
        onSave={handleStatusSave}
      />}

      {sizesProduct && <ProductSizesModal
        product={sizesProduct}
        saving={sizesSaving}
        error={sizesError}
        onClose={() => setSizesProduct(null)}
        onSave={handleSizesSave}
      />}

      {methodProduct && <ProductMethodModal
        product={methodProduct}
        saving={methodSaving}
        error={methodError}
        onClose={() => setMethodProduct(null)}
        onSave={handleMethodSave}
      />}

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
              error={saveError}
              mode="edit"
              onChange={handleChange}
              onFileChange={handleFileChange}
              onSizesChange={(sizes) => setFormData((prev) => ({ ...prev, size_stock: sizes }))}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
