import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCoins } from "../../hooks/useCoins";
import { useAuth } from "../../Contexts/authContext";
import { useTranslation } from "react-i18next";
import { useCart } from "../../Contexts/cartContext";
import { formatMoney } from "../../utils/money";
import { getConsumableCategoryLabel } from "../../utils/consumableCategories";

const LargeCoinCard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const adminEmails = (process.env.REACT_APP_ADMIN_EMAILS || "admin@gmail.com").split(",").map((email) => email.trim().toLowerCase());
  const isAdmin = adminEmails.includes(user?.email?.toLowerCase());
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCoin, deleteCoin, updateCoin } = useCoins();
  const { addToCart } = useCart();

  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [coin, setCoin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const data = await getCoin(id);
        setCoin(data);
        setFormData(data);
      } catch (err) {
        console.error("Failed to fetch coin:", err);
      }
    };

    fetchCoin();
  }, [id, getCoin]);

  const handleDelete = async () => {
    try {
      await deleteCoin(id);
      navigate("/");
    } catch (err) {
      console.error("Failed to delete coin:", err);
    }
  };

  const handleEditToggle = () => setEditMode((prev) => !prev);

  const handleSave = async () => {
    setErrorMessage("");
    setSaving(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key !== "photo_url") {
          if (["year", "price", "mintage"].includes(key)) {
            data.append(key, Number(value));
          } else {
            data.append(key, value);
          }
        }
      }
    });

    if (file) data.append("photo", file);

    try {
      const updated = await updateCoin(id, data);
      setCoin(updated.coin);
      setEditMode(false);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          t("coinDetails.update_failed")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  if (!coin) return null;

  return (
    <div className="max-w-[1200px] mx-auto p-6 bg-gray-100 rounded-xl shadow-lg">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 text-center">{coin.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <div className="grid grid-cols-1 gap-5 mb-8">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img
                src={coin.photo_url || "https://placehold.co/200x200"}
                alt={coin.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="text-left pb-6 border-b-2 border-orange-500 mb-8">
            {coin.product_type === "consumable" && <p className="mb-2 text-sm font-semibold text-gray-600">{getConsumableCategoryLabel(coin.consumable_category)}</p>}
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">
              {coin.product_type === "consumable" ? "Product details" : t("coinDetails.info")}
            </h1>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-2xl font-bold text-orange-600">
                {formatMoney(coin.price)}
              </span>
            </div>
          </div>

          {coin.description && <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{coin.description}</p>}

          <div className="p-6 border rounded-lg shadow-sm mb-8">
            <div className="grid grid-cols-2 gap-1">
              {[
                { label: t("coinDetails.name"), key: "name" },
                ...(coin.product_type === "consumable" ? [] : [{ label: t("coinDetails.country"), key: "country" },
                { label: t("coinDetails.year"), key: "year" },
                { label: t("coinDetails.material"), key: "composition_metal" },
                { label: t("coinDetails.monarch"), key: "monarch" },
                { label: t("coinDetails.weight"), key: "weight" },
                { label: t("coinDetails.shape"), key: "shape" },
                { label: t("coinDetails.denomination"), key: "denomination" },
                { label: t("coinDetails.script"), key: "script" },
                { label: t("coinDetails.lettering"), key: "lettering" },
                { label: t("coinDetails.mintage"), key: "mintage" },
                { label: t("coinDetails.mint_place"), key: "mint_place" },
                { label: t("coinDetails.coin_grading"), key: "coin_grading" }]),
              ].filter(({ key }) => editMode || (coin[key] !== null && coin[key] !== undefined && coin[key] !== "")).map(({ label, key }) => (
                <React.Fragment key={key}>
                  <div className="text-orange-500 font-semibold">{label}</div>
                  <div className="font-medium">
                    {editMode ? (
                      <input
                        type="text"
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      coin[key]
                    )}
                  </div>
                </React.Fragment>
              ))}

              {editMode && (
                <>
                  <div className="text-orange-500 font-semibold">Photo</div>
                  <div className="font-medium">
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="border rounded p-1 w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            disabled={coin.status && coin.status !== "active"}
            onClick={() => {
              addToCart(coin);
              navigate("/cart");
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded w-full mb-4 disabled:bg-gray-500"
          >
            {coin.status && coin.status !== "active" ? "Unavailable" : "Add to cart"}
          </button>

          {isAdmin && (
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex gap-4">
                {editMode ? (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
                  >
                    {saving ? t("coinDetails.saving") : t("coinDetails.save")}
                  </button>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
                  >
                    {t("coinDetails.edit")}
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
                >
                  {t("coinDetails.delete")}
                </button>
              </div>

              {errorMessage && (
                <div className="bg-red-100 text-red-700 p-2 mt-2 rounded text-center border border-red-400">
                  {errorMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LargeCoinCard;
