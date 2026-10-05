const statuses = ["new", "confirmed", "packed", "sent", "completed", "cancelled"];

const getStatusOptions = (currentStatus) => {
  if (["pending", "canceled"].includes(currentStatus)) {
    return [currentStatus, ...statuses];
  }

  return statuses;
};

const AdminOrdersTable = ({ orders, onOpenOrder, onStatusChange }) => {
  if (orders.length === 0) {
    return <p className="text-gray-600">No customer orders yet.</p>;
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
                  <p key={item.id}>
                    {item.quantity} x {item.coin_name}
                  </p>
                ))}
              </td>
              <td className="p-3">
                <p>{order.city}</p>
                <p>{order.address}</p>
                {order.delivery_notes && (
                  <p className="text-gray-500">{order.delivery_notes}</p>
                )}
              </td>
              <td className="p-3 font-semibold">
                {Number(order.total).toFixed(2)} BGN
              </td>
              <td className="p-3">
                <select
                  value={order.status}
                  onChange={(event) =>
                    onStatusChange(order.id, event.target.value)
                  }
                  className="border rounded p-2"
                >
                  {getStatusOptions(order.status).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersTable;
