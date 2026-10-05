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
            <span className="h-fit bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm">
              {order.status}
            </span>
          </div>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity} x {item.coin_name}
                </span>
                <span>{Number(item.price).toFixed(2)} BGN</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>{Number(order.total).toFixed(2)} BGN</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
