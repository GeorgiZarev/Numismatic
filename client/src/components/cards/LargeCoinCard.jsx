import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { useCoins } from "../../hooks/useCoins";
import useProductTitle from "../../hooks/useProductTitle";
import { useAuth } from "../../Contexts/authContext";
import { useCart } from "../../Contexts/cartContext";
import { formatMoney } from "../../utils/money";
import { getConsumableCategoryLabel } from "../../utils/consumableCategories";
import ProductFacts from "../products/ProductFacts";
import { expectedDeliveryDate, isPurchasable } from "../../utils/inventory";
import { availableForSize, cartItemKey, requiresProductSize } from "../../utils/productSizes";
import SizeSelect from "../shop/SizeSelect";
import { buildProductDetailUpdate } from "../../utils/productDetailForm";

const LargeCoinCard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const adminEmails = (process.env.REACT_APP_ADMIN_EMAILS || "admin@gmail.com").split(",").map((email) => email.trim().toLowerCase());
  const isAdmin = adminEmails.includes(user?.email?.toLowerCase());
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCoin, deleteCoin, updateCoin } = useCoins();
  const { addToCart, items } = useCart();

  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [coin, setCoin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useProductTitle(coin?.name);

  useEffect(() => { setSelectedSize(""); setQuantity(1); }, [id]);
  useEffect(() => { setQuantity(1); }, [selectedSize]);

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

  const handleSave = async () => {
    setErrorMessage("");
    setSaving(true);

    const data = buildProductDetailUpdate(coin, formData, file);

    try {
      const updated = await updateCoin(id, data);
      setCoin(updated.coin);
      setEditMode(false);
    } catch (err) {
      setErrorMessage(err.response?.data?.error?.message || err.response?.data?.message || t("coinDetails.update_failed"));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  if (!coin) return null;

  const category = coin.product_type === "coin"
    ? t("nav.coins")
    : coin.product_type === "investment"
      ? t("nav.investment")
      : t(`shop.accessoryCategories.${coin.consumable_category}`, { defaultValue: getConsumableCategoryLabel(coin.consumable_category) });
  const available = isPurchasable(coin);
  const sized = requiresProductSize(coin);
  const sizeMm = sized && selectedSize !== "" ? Number(selectedSize) : null;
  const inCart = items.find((item) => cartItemKey(item) === cartItemKey({ id: coin.id, size_mm: sizeMm }))?.quantity || 0;
  const maxQuantity = sized && sizeMm === null ? 0 : Math.max(0, availableForSize(coin, sizeMm) - inCart);
  const canPurchase = available && maxQuantity > 0 && (!sized || sizeMm !== null);
  const clampQuantity = (value) => Math.min(Math.max(1, Math.floor(Number(value)) || 1), Math.max(1, maxQuantity));
  const setClampedQuantity = (value) => setQuantity(clampQuantity(value));
  const stepQuantity = (step) => setQuantity((previous) => clampQuantity(previous + step));
  const deliveryDate = expectedDeliveryDate(coin);

  return (
    <main className="mx-auto max-w-[1500px] px-5 pb-20 pt-8 sm:px-8 lg:pt-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-12 xl:gap-16">
        <div className="flex min-h-[340px] items-center justify-center bg-white sm:min-h-[480px] lg:min-h-[610px]">
          {coin.photo_url ? (
            <img src={coin.photo_url} alt={coin.name} className="max-h-[650px] max-w-full object-contain" />
          ) : (
            <span className="text-sm text-[#66776e]">{t("shop.photoSoon")}</span>
          )}
        </div>

        <div className="min-w-0 pt-2 lg:pt-7">
          <p className="mb-4 text-xs font-semibold uppercase text-[#536b60]">{category}</p>
          <h1 className="max-w-[22ch] font-serif text-[32px] font-semibold leading-tight text-[#112b26] sm:text-[40px]">{coin.name}</h1>
          <p className="mt-8 border-b border-[#dce3df] pb-7 text-[30px] font-semibold text-[#142f28]">{formatMoney(coin.price)}</p>
          {!available && <p className="mt-4 text-sm font-semibold text-[#875b35]">{t("shop.outOfStock")}</p>}
          {deliveryDate && <p className="mt-1 text-sm text-[#52645b]">{t("shop.expectedDelivery", { date: new Intl.DateTimeFormat(t("shop.dateLocale")).format(deliveryDate) })}</p>}
          {sized && (
            <SizeSelect
              sizes={coin.size_stock}
              value={selectedSize}
              onChange={setSelectedSize}
              label={t("shop.sizeMm")}
              placeholder={t("shop.chooseSize")}
              availableLabel={t("shop.boxesAvailable")}
              outOfStockLabel={t("shop.outOfStock")}
            />
          )}

          <div className="mt-8 flex gap-3">
            <div className="flex min-h-14 shrink-0 items-center border border-[#cdd5d1] bg-white" role="group" aria-label={t("shop.quantity")}>
              <button type="button" onClick={() => stepQuantity(-1)} disabled={!canPurchase || quantity <= 1} aria-label={t("shop.decreaseQuantity")} className="grid h-14 w-11 place-items-center text-[#20312e] hover:bg-[#f1f4f1] disabled:cursor-not-allowed disabled:opacity-40"><FiMinus aria-hidden="true" /></button>
              <input type="number" min="1" max={Math.max(1, maxQuantity)} step="1" value={quantity} disabled={!canPurchase} onChange={(event) => setClampedQuantity(event.target.value)} aria-label={t("shop.quantity")} className="h-14 w-12 border-x border-[#e3e9e5] text-center text-[#20312e] [appearance:textfield] focus:outline-none disabled:bg-white disabled:opacity-40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
              <button type="button" onClick={() => stepQuantity(1)} disabled={!canPurchase || quantity >= maxQuantity} aria-label={t("shop.increaseQuantity")} className="grid h-14 w-11 place-items-center text-[#20312e] hover:bg-[#f1f4f1] disabled:cursor-not-allowed disabled:opacity-40"><FiPlus aria-hidden="true" /></button>
            </div>
            <button
              type="button"
              disabled={!canPurchase}
              onClick={() => { addToCart(coin, Math.min(quantity, maxQuantity), sizeMm); navigate("/cart"); }}
              className="flex min-h-14 min-w-0 flex-1 items-center justify-center gap-3 bg-[#c69a5d] px-4 text-sm font-semibold uppercase text-white transition-colors hover:bg-[#ad8147] disabled:cursor-not-allowed disabled:bg-[#9ea8a1]"
            >
              <FiShoppingBag size={18} aria-hidden="true" className="shrink-0" />
              <span className="text-center leading-tight">{available ? t("shop.addToCart") : t("coinDetails.unavailable")}</span>
            </button>
          </div>
          {available && inCart > 0 && <p className="mt-2 text-xs text-[#52645b]">{t("shop.alreadyInCart", { count: inCart })}</p>}

          <div className="mt-10">
            <ProductFacts product={coin} editMode={editMode} formData={formData} onChange={handleChange} onFileChange={(event) => setFile(event.target.files[0])} t={t} />
          </div>

          {isAdmin && (
            <div className="mt-8 border-t border-[#e4e9e6] pt-5">
              <div className="flex flex-wrap gap-3">
                {editMode ? (
                  <button type="button" onClick={handleSave} disabled={saving} className="min-h-11 border border-[#235b50] bg-[#235b50] px-5 text-sm font-semibold text-white hover:bg-[#17453b] disabled:opacity-60">
                    {saving ? t("coinDetails.saving") : t("coinDetails.save")}
                  </button>
                ) : (
                  <button type="button" onClick={() => setEditMode(true)} className="min-h-11 border border-[#b8c9c0] px-5 text-sm font-semibold text-[#235b50] hover:bg-[#edf3f0]">{t("coinDetails.edit")}</button>
                )}
                <button type="button" onClick={handleDelete} className="min-h-11 border border-[#dfb6b2] px-5 text-sm font-semibold text-[#a2332d] hover:bg-[#fff1f0]">{t("coinDetails.delete")}</button>
              </div>
              {errorMessage && <p role="alert" className="mt-4 text-sm text-red-700">{errorMessage}</p>}
            </div>
          )}
        </div>
      </div>

      {coin.description && (
        <section className="mt-12 border-t border-[#dce3df] pt-10 lg:mt-16">
          <h2 className="mb-5 font-serif text-2xl font-semibold text-[#132e28]">{t("coinDetails.description")}</h2>
          <p className="max-w-[70ch] whitespace-pre-line text-base leading-7 text-[#344b40]">{coin.description}</p>
        </section>
      )}
    </main>
  );
};

export default LargeCoinCard;
