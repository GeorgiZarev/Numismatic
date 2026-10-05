import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders";
import { useAuth } from "../Contexts/authContext";
import { useCart } from "../Contexts/cartContext";
import CheckoutForm from "../components/orders/CheckoutForm";
import OrderSummary from "../components/orders/OrderSummary";

const PlaceOrder = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: user?.full_name || user?.username || "",
    phone: user?.phone || "",
    email: user?.email || "",
    city: user?.city || "",
    address: user?.address || "",
    delivery_notes: "",
    payment_method: "cash_on_delivery",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createOrder({
        ...formData,
        items: items.map((item) => ({
          coin_id: item.id,
          quantity: item.quantity,
        })),
      });
      clearCart();
      navigate("/orders", {
        state: { orderCreated: true },
      });
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Could not create order."
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold mb-3">No items to order</h1>
        <Link to="/all-products" className="bg-orange-500 text-white px-5 py-3 rounded">
          Browse coins
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
      <CheckoutForm
        error={error}
        formData={formData}
        loading={loading}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <OrderSummary items={items} total={total} />
    </div>
  );
};

export default PlaceOrder;
