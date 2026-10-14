import { formatMoney } from "../../utils/money";
import ProductPhoto from "../products/ProductPhoto";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderList = ({ orders }) => {
  if (orders.length === 0) {
    return <p className="text-gray-600">No orders yet.</p>;
  }

  return (
    <div className="grid gap-5">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-5 bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
            <div>
              <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-3 min-w-0">
                  <ProductPhoto src={item.photo_url} size="sm" />
                  <span>{item.quantity} x {item.coin_name}{item.size_mm != null ? ` (${item.size_mm} mm)` : ""}</span>
                </span>
                <span className="whitespace-nowrap">{formatMoney(item.price)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatMoney(order.total)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
