const OrderSummary = ({ items, total }) => {
  return (
    <aside className="bg-gray-50 border rounded-lg p-6 h-fit">
      <h2 className="text-xl font-semibold mb-4">Order summary</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between gap-3 text-sm">
            <span>
              {item.quantity} x {item.name}
            </span>
            <span>{(item.price * item.quantity).toFixed(2)} BGN</span>
          </div>
        ))}
      </div>
      <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>{total.toFixed(2)} BGN</span>
      </div>
    </aside>
  );
};

export default OrderSummary;
