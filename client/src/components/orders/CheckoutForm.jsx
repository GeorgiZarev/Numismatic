import AddressDetailsFields from "../address/AddressDetailsFields";

const CheckoutForm = ({
  error,
  formData,
  loading,
  onChange,
  onSubmit,
  addressSelector,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-6 shadow-sm">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {addressSelector}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="customer_name"
          value={formData.customer_name}
          onChange={onChange}
          placeholder="Full name"
          required
          className="border p-3 rounded"
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="Phone number"
          required
          className="border p-3 rounded"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Email"
          className="border p-3 rounded"
        />
        <div className="sm:col-span-2"><AddressDetailsFields data={formData} onChange={onChange} /></div>
        <textarea
          name="delivery_notes"
          value={formData.delivery_notes}
          onChange={onChange}
          placeholder="Delivery notes"
          className="border p-3 rounded sm:col-span-2 min-h-24"
        />
        <select
          name="payment_method"
          value={formData.payment_method}
          onChange={onChange}
          className="border p-3 rounded sm:col-span-2"
        >
          <option value="cash_on_delivery">Cash on delivery</option>
        </select>
        <p className="sm:col-span-2 text-sm text-gray-600">
          You pay when the order is delivered. We will contact you to confirm
          the order before sending it.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded text-sm mt-4">
          {error}
        </div>
      )}

      <button
        disabled={loading}
        className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded disabled:opacity-70"
      >
        {loading ? "Placing order..." : "Place order"}
      </button>
    </form>
  );
};

export default CheckoutForm;
