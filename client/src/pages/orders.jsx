import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { fetchMyOrders } from "../api/orders";
import OrderList from "../components/orders/OrderList";

const Orders = () => {
  const location = useLocation();
  const { data: orders = [], isError, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchMyOrders,
  });

  if (isLoading) return <p className="py-10">Loading orders...</p>;
  if (isError) return <p className="py-10 text-red-500">Could not load orders.</p>;

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold mb-8">My orders</h1>
      {location.state?.orderCreated && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-green-800">
          Your order was created. We will contact you before sending it.
        </div>
      )}
      <OrderList orders={orders} />
    </div>
  );
};

export default Orders;
