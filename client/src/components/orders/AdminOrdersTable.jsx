import { formatMoney } from "../../utils/money";
import { useTranslation } from "react-i18next";
import ProductPhoto from "../products/ProductPhoto";
import { normalizeOrderStatus, ORDER_STATUSES, orderStatusClass } from "../../utils/orderStatus";

const AdminOrdersTable = ({ orders, onOpenOrder, onStatusChange, emptyMessage = "No customer orders yet." }) => {
  const { t } = useTranslation();
  if (orders.length === 0) {
    return <p className="text-gray-600">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Order</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Items</th>
            <th className="p-3">Delivery</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t align-top">
              <td className="p-3">
                <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                <p className="text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <button
                  onClick={() => onOpenOrder(order)}
                  className="mt-2 text-orange-600 underline"
                >
                  View details
                </button>
              </td>
              <td className="p-3">
                <p className="font-medium">{order.customer_name}</p>
                <p>{order.phone}</p>
                <p className="text-gray-500">{order.email || "No email"}</p>
              </td>
              <td className="p-3">
                {order.items.map((item) => (
                  <p key={item.id} className="flex items-center gap-2 mb-2">
                    <ProductPhoto src={item.photo_url} size="xs" />
                    {item.quantity} x {item.coin_name}{item.size_mm != null ? ` (${item.size_mm} mm)` : ""}
                  </p>
                ))}
              </td>
              <td className="p-3">
                <p>{order.address}</p>
                {order.address_line_2 && <p>{order.address_line_2}</p>}
                <p>{[order.postal_code, order.city, order.country].filter(Boolean).join(" ")}</p>
                {order.delivery_notes && (
                  <p className="text-gray-500">{order.delivery_notes}</p>
                )}
              </td>
              <td className="p-3 font-semibold">
                {formatMoney(order.total)}
              </td>
              <td className="p-3">
                <label className="block">
                  <span className="sr-only">{t("adminOrders.changeStatus")}</span>
                  <select
                    value={normalizeOrderStatus(order.status)}
                    onChange={(event) => onStatusChange(order, event.target.value)}
                    className={`block min-h-10 rounded border px-2 text-sm font-semibold ${orderStatusClass(order.status)}`}
                  >
                    {[...new Set([normalizeOrderStatus(order.status), ...ORDER_STATUSES])].map((status) => (
                      <option key={status} value={status} className="bg-white text-[#203730]">
                        {t(`adminOrders.statuses.${status}`, { defaultValue: status })}
                      </option>
                    ))}
                  </select>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersTable;
