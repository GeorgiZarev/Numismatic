import React, { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchAllOrders, fetchOrderCities, updateOrderStatus } from "../api/orders";
import AdminOrderDetail from "../components/orders/AdminOrderDetail";
import AdminOrderFilters from "../components/orders/AdminOrderFilters";
import AdminOrdersTable from "../components/orders/AdminOrdersTable";
import OrderStatusConfirmModal from "../components/orders/OrderStatusConfirmModal";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { emptyOrderFilters, hasOrderFilters, orderQueryParams } from "../utils/adminOrderFilters";

const AdminOrders = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(emptyOrderFilters);
  const debouncedSearch = useDebouncedValue(filters.search);
  const queryParams = orderQueryParams(filters, { search: debouncedSearch });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusChange, setStatusChange] = useState(null);
  const {
    data: orders = [],
    error,
    isError,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["admin-orders", queryParams],
    queryFn: () => fetchAllOrders(queryParams),
    placeholderData: keepPreviousData,
  });
  const { data: cities = [] } = useQuery({
    queryKey: ["admin-order-cities"],
    queryFn: fetchOrderCities,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => {
      setStatusChange(null);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["shop-products"] });
      queryClient.invalidateQueries({ queryKey: ["home-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order-cities"] });
    },
  });

  const errorMessage =
    error?.response?.data?.error?.details?.map((detail) => detail.msg).join(", ") ||
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    t("adminOrders.loadError");

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold mb-8">{t("adminOrders.title")}</h1>
      <AdminOrderFilters filters={filters} cities={cities} onChange={setFilters} onClear={() => setFilters(emptyOrderFilters)} t={t} />
      <div aria-busy={isFetching} className={isFetching && !isLoading ? "opacity-60 transition-opacity" : "transition-opacity"}>
        {isLoading ? (
          <p className="py-6 text-[#53655b]">{t("adminOrders.loading")}</p>
        ) : isError ? (
          <p role="alert" className="py-6 text-red-600">{errorMessage}</p>
        ) : (
          <AdminOrdersTable
            orders={orders}
            emptyMessage={hasOrderFilters(filters) ? t("adminOrders.noMatches") : t("adminOrders.noOrders")}
            onOpenOrder={setSelectedOrder}
            onStatusChange={(order, status) => {
              if (status === order.status) return;
              statusMutation.reset();
              setStatusChange({ order, status });
            }}
          />
        )}
      </div>
      {statusChange && (
        <OrderStatusConfirmModal
          change={statusChange}
          saving={statusMutation.isPending}
          error={statusMutation.isError ? statusMutation.error?.response?.data?.error?.message || t("adminOrders.statusError") : ""}
          onCancel={() => setStatusChange(null)}
          onConfirm={() => statusMutation.mutate({ id: statusChange.order.id, status: statusChange.status })}
        />
      )}
      <AdminOrderDetail
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default AdminOrders;
