import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "../../Contexts/cartContext";
import { formatMoney } from "../../utils/money";
import { getConsumableCategoryLabel } from "../../utils/consumableCategories";

const ShopProductCard = ({ product, view }) => {
  const { t } = useTranslation();
  const { items, addToCart } = useCart();
  const inCart = items.some((item) => item.id === product.id);
  const category = product.product_type === "coin"
    ? t("nav.coins")
    : product.product_type === "investment"
      ? t("nav.investment")
      : t(`shop.accessoryCategories.${product.consumable_category}`, { defaultValue: getConsumableCategoryLabel(product.consumable_category) });
  const details = [product.country, product.year].filter(Boolean).join(" · ");

  return (
    <article className={`flex min-w-0 border border-[#e1e5e2] bg-white transition-colors hover:border-[#a8b6ae] ${view === "list" ? "flex-col sm:flex-row" : "flex-col"}`}>
      <Link to={`/product/${product.id}`} className={`flex aspect-square shrink-0 items-center justify-center overflow-hidden bg-[#f5f6f5] ${view === "list" ? "sm:w-[220px]" : ""}`} aria-label={product.name}>
        {product.photo_url ? (
          <img src={product.photo_url} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-[1.03]" />
        ) : (
          <span className="px-4 text-center text-sm text-[#6a7970]">{t("shop.photoSoon")}</span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-[#e5e9e6] bg-[#f7f8f7] px-4 py-2 text-xs font-semibold uppercase text-[#52645b]">{category}</div>
        <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
          <Link to={`/product/${product.id}`} className="font-serif text-lg font-semibold leading-snug text-[#112c27] hover:underline">{product.name}</Link>
          {details && <p className="mt-1 text-sm text-[#637168]">{details}</p>}
          {product.description && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#43544b]">{product.description}</p>}
          <div className="mt-auto pt-5">
            <p className="mb-3 border-t border-[#e5e9e6] pt-3 text-lg font-bold text-[#122c27]">{formatMoney(product.price)}</p>
            {inCart ? (
              <Link to="/cart" className="flex min-h-11 w-full items-center justify-center gap-2 bg-[#eef3f0] px-3 text-sm font-semibold text-[#235b50] hover:bg-[#e1eae5]">{t("shop.inCart")}</Link>
            ) : (
              <button type="button" onClick={() => addToCart(product)} className="flex min-h-11 w-full items-center justify-center gap-2 bg-[#16342e] px-3 text-sm font-semibold text-white hover:bg-[#24574c]"><FiShoppingBag size={17} aria-hidden="true" />{t("shop.addToCart")}</button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ShopProductCard;
