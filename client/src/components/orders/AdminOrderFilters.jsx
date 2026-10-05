const orderStatuses = [
  { value: "", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "packed", label: "Packed" },
  { value: "sent", label: "Sent" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const AdminOrderFilters = ({ filters, onChange }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
      <input
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search name, phone, city..."
        className="border p-3 rounded md:col-span-2"
      />
      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        className="border p-3 rounded"
      >
        {orderStatuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
      <input
        name="fromDate"
        type="date"
        value={filters.fromDate}
        onChange={handleChange}
        className="border p-3 rounded"
      />
    </div>
  );
};

export default AdminOrderFilters;
