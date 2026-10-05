import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Contexts/cartContext";

function Cart() {
  const { items, removeFromCart, total, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold mb-3">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">
          Add a coin from the catalog before placing an order.
        </p>
        <Link to="/all-products" className="bg-orange-500 text-white px-5 py-3 rounded">
          Browse coins
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
            key={item.id}
            className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 bg-white shadow-sm"
          >
            <img
              src={item.photo_url || "https://placehold.co/120x120"}
              alt={item.name}
              className="w-28 h-28 object-cover rounded bg-gray-100"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-600">
                {item.country} {item.year ? `- ${item.year}` : ""}
              </p>
              <p className="text-orange-600 font-semibold mt-2">
                {item.price.toFixed(2)} {item.currency}
              </p>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-3">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(event) => updateQuantity(item.id, event.target.value)}
                className="border rounded p-2 w-20"
              />
              <button
                onClick={() => removeFromCart(item.id)}
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
            {total.toFixed(2)} BGN
          </p>
        </div>
        <button
          onClick={() => navigate("/place-order")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded"
        >
          Continue to checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
