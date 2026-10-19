import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../Contexts/cartContext";
import { productName } from "../utils/productName";
import { formatMoney } from "../utils/money";
import { useCartAvailability } from "../hooks/useCartAvailability";
import { availableForSize, cartItemKey } from "../utils/productSizes";
import ProductPhoto from "../components/products/ProductPhoto";

function Cart() {
  const { items, removeFromCart, total, updateQuantity } = useCart();
  const navigate = useNavigate();
  const availability = useCartAvailability(items);
  const { i18n } = useTranslation();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold mb-3">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">
          Add a product from the catalog before placing an order.
        </p>
        <Link to="/all-products" className="bg-orange-500 text-white px-5 py-3 rounded">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold mb-8">Cart</h1>
      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={cartItemKey(item)}
            className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 bg-white shadow-sm"
          >
            <ProductPhoto src={item.photo_url} alt={productName(item, i18n.language)} size="lg" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{productName(item, i18n.language)}</h2>
              {item.size_mm != null && <p className="text-sm text-[#52645b]">{item.size_mm} mm · box</p>}
              <p className="text-gray-600">
                {item.country} {item.year ? `- ${item.year}` : ""}
              </p>
              <p className="text-orange-600 font-semibold mt-2">
                {formatMoney(item.price)}
              </p>
              {!availability.isLoading && !availability.isError && availability.issueKeys.has(cartItemKey(item)) && (
                <p className="mt-2 text-sm font-semibold text-red-700">Only {availableForSize(availability.byId.get(item.id), item.size_mm)} available. Adjust or remove this item.</p>
              )}
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-3">
              <input
                type="number"
                min="1"
                max={availableForSize(availability.byId.get(item.id), item.size_mm) || undefined}
                value={item.quantity}
                onChange={(event) => updateQuantity(cartItemKey(item), event.target.value)}
                className="border rounded p-2 w-20"
              />
              <button
                onClick={() => removeFromCart(cartItemKey(item))}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t pt-6 gap-4">
        <div>
          <p className="text-gray-600">Total</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatMoney(total)}
          </p>
        </div>
        <button
          onClick={() => navigate("/place-order")}
          disabled={availability.isLoading || availability.isError || availability.issues.length > 0}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to checkout
        </button>
        {availability.isError && <p role="alert" className="text-sm text-red-700">Could not verify stock. Please try again.</p>}
      </div>
    </div>
  );
}

export default Cart;
