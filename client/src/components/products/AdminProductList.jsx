import { Link } from "react-router-dom";
import { getConsumableCategoryLabel } from "../../utils/consumableCategories";
import { getZeroStockAction } from "../../utils/zeroStockAction";
import ProductStatusBadge from "./ProductStatusBadge";
import InlineProductField from "./InlineProductField";

const formatDate = (value) => value
  ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value))
  : "Not yet";

const AdminProductList = ({ coins, onDelete, onEdit, onChangeStatus, onChangeMethod, onUpdateField }) => {
  if (coins.length === 0) {
    return <p className="text-gray-600">No products found.</p>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg bg-white">
      <table className="w-full min-w-[1500px] table-fixed text-sm">
        <colgroup>
          <col className="w-[19%]" />
          <col className="w-[13%]" />
          <col className="w-[13%]" />
          <col className="w-[8%]" />
          <col className="w-[11%]" />
          <col className="w-[11%]" />
          <col className="w-[15%]" />
          <col className="w-[10%]" />
        </colgroup>
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Product</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created</th>
            <th className="p-3">Last restocked</th>
            <th className="p-3">Method</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id} className="border-t">
              <td className="p-3">
                <div className="flex min-w-0 items-center gap-3">
                  {coin.photo_url && (
                    <Link to={`/product/${coin.id}`} aria-label={`Open ${coin.name}`} className="shrink-0">
                      <img
                        src={coin.photo_url}
                        alt=""
                        className="w-14 h-14 object-contain rounded border"
                      />
                    </Link>
                  )}
                  <div className="min-w-0">
                    <Link to={`/product/${coin.id}`} className="block truncate font-semibold hover:underline" title={coin.name}>{coin.name}</Link>
                    <p className="truncate text-gray-500">
                      {coin.product_type === "consumable"
                        ? getConsumableCategoryLabel(coin.consumable_category)
                        : coin.product_type === "investment"
                          ? "Investment product"
                          : `${coin.country || ""} ${coin.year || ""}`}
                    </p>
                  </div>
                </div>
              </td>
              <td className="p-3"><InlineProductField product={coin} field="price" onSave={onUpdateField} /></td>
              <td className="p-3">
                <InlineProductField product={coin} field="stock_quantity" onSave={onUpdateField} />
                {Number(coin.stock_quantity) === 0 && coin.zero_stock_action === "review_delete" && (
                  <p className="mt-1 text-xs font-semibold text-red-700">Review for deletion</p>
                )}
              </td>
              <td className="p-3">
                <ProductStatusBadge status={coin.status} onClick={() => onChangeStatus(coin)} />
              </td>
              <td className="p-3 text-gray-600">{formatDate(coin.created_at)}</td>
              <td className="p-3 text-gray-600">{formatDate(coin.restocked_at)}</td>
              <td className="p-3">
                <button
                  type="button"
                  onClick={() => onChangeMethod(coin)}
                  aria-label={`Change method from ${getZeroStockAction(coin.zero_stock_action).label}`}
                  title="Change zero-stock method"
                  className={`inline-flex min-h-9 items-center rounded border px-3 py-1 text-xs font-semibold transition-colors hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#235b50] ${getZeroStockAction(coin.zero_stock_action).className}`}
                >
                  {getZeroStockAction(coin.zero_stock_action).label}
                </button>
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
