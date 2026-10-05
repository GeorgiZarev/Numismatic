import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllOrders, updateOrderStatus } from "../api/orders";
import AdminOrderDetail from "../components/orders/AdminOrderDetail";
import AdminOrderFilters from "../components/orders/AdminOrderFilters";
import AdminOrdersTable from "../components/orders/AdminOrdersTable";

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    fromDate: "",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const {
    data: orders = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["admin-orders", filters],
    queryFn: () => fetchAllOrders(filters),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  if (isLoading) return <p className="py-10">Loading orders...</p>;
  if (isError) {
    const message =
      error?.response?.data?.error?.message ||
      error?.response?.data?.message ||
      "Could not load orders. Please check the selected filters and try again.";

    return <p className="py-10 text-red-500">{message}</p>;
  }

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold mb-8">Admin orders</h1>
      <AdminOrderFilters filters={filters} onChange={setFilters} />
      <AdminOrdersTable
        orders={orders}
        onOpenOrder={setSelectedOrder}
        onStatusChange={(id, status) => statusMutation.mutate({ id, status })}
      />
      <AdminOrderDetail
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default AdminOrders;
