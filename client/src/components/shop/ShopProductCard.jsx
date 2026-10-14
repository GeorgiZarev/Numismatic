import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "../../Contexts/cartContext";
import { formatMoney } from "../../utils/money";
import { getConsumableCategoryLabel } from "../../utils/consumableCategories";
import { expectedDeliveryDate, isPurchasable } from "../../utils/inventory";
import { hasProductSizes } from "../../utils/productSizes";
import ProductPhoto from "../products/ProductPhoto";

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
  const available = isPurchasable(product);
  const deliveryDate = expectedDeliveryDate(product);

  return (
    <article className={`flex min-w-0 overflow-hidden rounded-md border border-[#e1e5e2] bg-white transition-colors hover:border-[#a8b6ae] ${view === "list" ? "flex-col sm:flex-row" : "flex-col"}`}>
      <Link to={`/product/${product.id}`} className={`group block shrink-0 ${view === "list" ? "sm:w-[220px]" : ""}`} aria-label={product.name}>
        <ProductPhoto
          src={product.photo_url}
          alt={product.name}
          imageClassName="transition-transform duration-300 group-hover:scale-[1.03]"
          fallback={<span className="px-4 text-center text-sm text-[#6a7970]">{t("shop.photoSoon")}</span>}
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-[#e5e9e6] bg-[#f7f8f7] px-4 py-2 text-xs font-semibold uppercase text-[#52645b]">{category}</div>
        <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
          <Link to={`/product/${product.id}`} title={product.name} className="block truncate font-serif text-lg font-semibold leading-snug text-[#112c27] hover:underline">{product.name}</Link>
          {details && <p className="mt-1 text-sm text-[#637168]">{details}</p>}
          {product.description && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#43544b]">{product.description}</p>}
          {!available && <p className="mt-3 text-sm font-semibold text-[#875b35]">{t("shop.outOfStock")}</p>}
          {deliveryDate && <p className="mt-1 text-sm text-[#52645b]">{t("shop.expectedDelivery", { date: new Intl.DateTimeFormat(t("shop.dateLocale")).format(deliveryDate) })}</p>}
          <div className="mt-auto pt-5">
            <p className="mb-3 border-t border-[#e5e9e6] pt-3 text-lg font-bold text-[#122c27]">{formatMoney(product.price)}</p>
            {!available ? (
              <button type="button" disabled className="flex min-h-11 w-full items-center justify-center bg-[#e9edeb] whitespace-nowrap px-2 text-sm font-semibold text-[#60746a]"><span className="truncate">{t("shop.outOfStock")}</span></button>
            ) : hasProductSizes(product) ? (
              <Link to={`/product/${product.id}`} className="flex min-h-11 w-full items-center justify-center bg-[#16342e] whitespace-nowrap px-2 text-sm font-semibold text-white hover:bg-[#24574c]"><span className="truncate">{t("shop.chooseSize")}</span></Link>
            ) : inCart ? (
              <Link to="/cart" className="flex min-h-11 w-full items-center justify-center gap-2 bg-[#eef3f0] whitespace-nowrap px-2 text-sm font-semibold text-[#235b50] hover:bg-[#e1eae5]"><span className="truncate">{t("shop.inCart")}</span></Link>
            ) : (
              <button type="button" onClick={() => addToCart(product)} className="flex min-h-11 w-full items-center justify-center gap-2 bg-[#16342e] whitespace-nowrap px-2 text-sm font-semibold text-white hover:bg-[#24574c]"><FiShoppingBag size={17} aria-hidden="true" className="shrink-0" /><span className="truncate">{t("shop.addToCart")}</span></button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ShopProductCard;
