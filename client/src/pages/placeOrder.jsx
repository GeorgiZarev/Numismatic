import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders";
import { useAuth } from "../Contexts/authContext";
import { useCart } from "../Contexts/cartContext";
import CheckoutForm from "../components/orders/CheckoutForm";
import OrderSummary from "../components/orders/OrderSummary";
import AddressSelector from "../components/orders/AddressSelector";
import { useCartAvailability } from "../hooks/useCartAvailability";
import { useQueryClient } from "@tanstack/react-query";

const PlaceOrder = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const availability = useCartAvailability(items);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(undefined);
  const [formData, setFormData] = useState({
    customer_name: user?.full_name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    city: user?.city || "",
    address: user?.address || "",
    postal_code: "",
    address_line_2: "",
    country: "",
    delivery_notes: "",
    payment_method: "cash_on_delivery",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (address) => {
    setSelectedAddressId(address?.id || "manual");
    if (address) setFormData((prev) => ({
      ...prev, customer_name: address.full_name, phone: address.phone,
      city: address.city, address: address.address, postal_code: address.postal_code || "",
      address_line_2: address.address_line_2 || "", country: address.country || "",
      delivery_notes: address.notes || "",
    }));
    else setFormData((prev) => ({
      ...prev, customer_name: user?.full_name || "", phone: user?.phone || "",
      city: "", address: "", postal_code: "", address_line_2: "", country: "", delivery_notes: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (availability.isLoading || availability.isError || availability.issues.length > 0) {
      setError("Some products are unavailable or exceed the current stock. Please review your cart.");
      return;
    }
    setLoading(true);

    try {
      await createOrder({
        ...formData,
        items: items.map((item) => ({
          coin_id: item.id,
          quantity: item.quantity,
          ...(item.size_mm != null && { size_mm: item.size_mm }),
        })),
      });
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["home-products"] });
      queryClient.invalidateQueries({ queryKey: ["shop-products"] });
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
        disabled={availability.isLoading || availability.isError || availability.issues.length > 0}
        formData={formData}
        loading={loading}
        onChange={handleChange}
        onSubmit={handleSubmit}
        addressSelector={<AddressSelector selectedId={selectedAddressId} onSelect={handleAddressSelect} />}
      />
      <OrderSummary items={items} total={total} />
    </div>
  );
};

export default PlaceOrder;
