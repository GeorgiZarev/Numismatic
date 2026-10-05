const AdminProductList = ({ coins, onDelete, onEdit }) => {
  if (coins.length === 0) {
    return <p className="text-gray-600">No products found.</p>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Product</th>
            <th className="p-3">Price</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id} className="border-t">
              <td className="p-3">
                <div className="flex items-center gap-3">
                  {coin.photo_url && (
                    <img
                      src={coin.photo_url}
                      alt={coin.name}
                      className="w-14 h-14 object-cover rounded border"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{coin.name}</p>
                    <p className="text-gray-500">
                      {coin.country} {coin.year}
                    </p>
                  </div>
                </div>
              </td>
              <td className="p-3">{Number(coin.price).toFixed(2)} BGN</td>
              <td className="p-3">
                <span className="rounded bg-gray-100 px-3 py-1">
                  {coin.status || "active"}
                </span>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(coin)}
                    className="border px-3 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(coin.id)}
                    className="border border-red-200 text-red-700 px-3 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductList;
