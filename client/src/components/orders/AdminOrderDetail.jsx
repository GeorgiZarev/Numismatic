import { formatMoney } from "../../utils/money";

const AdminOrderDetail = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <aside className="fixed inset-0 z-[120] bg-black/40 flex justify-end">
      <div className="w-full max-w-xl bg-white h-full overflow-y-auto p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h2>
            <p className="text-gray-500">
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Close
          </button>
        </div>

        <section className="border rounded-lg p-4 mb-5">
          <h3 className="font-semibold mb-3">Customer</h3>
          <p>{order.customer_name}</p>
          <p>{order.phone}</p>
          <p className="text-gray-600">{order.email || "No email"}</p>
          <p className="mt-3">
            {order.address}
          </p>
          {order.address_line_2 && <p>{order.address_line_2}</p>}
          <p>{[order.postal_code, order.city, order.country].filter(Boolean).join(" ")}</p>
          {order.delivery_notes && (
            <p className="mt-3 text-gray-600">{order.delivery_notes}</p>
          )}
        </section>

        <section className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Products</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                {item.photo_url && (
                  <img
                    src={item.photo_url}
                    alt={item.coin_name}
                    className="w-16 h-16 object-cover rounded border"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.coin_name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} x {formatMoney(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatMoney(order.total)}</span>
          </div>
        </section>
      </div>
    </aside>
  );
};

export default AdminOrderDetail;
