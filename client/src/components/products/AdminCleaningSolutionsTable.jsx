import { Link } from "react-router-dom";
import { getZeroStockAction } from "../../utils/zeroStockAction";
import InlineProductField from "./InlineProductField";
import ProductStatusBadge from "./ProductStatusBadge";

const dateLabel = (value) => value
  ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value))
  : "Not yet";

const AdminCleaningSolutionsTable = ({ products, onEdit, onDelete, onChangeStatus, onChangeMethod, onUpdateField }) => {
  if (products.length === 0) return <p className="py-8 text-sm text-[#63716a]">No products found.</p>;

  return (
    <div className="overflow-x-auto rounded-md border border-[#dfe6e1] bg-white">
      <table className="w-full min-w-[1450px] text-left text-sm">
        <thead className="bg-[#f5f7f5] text-[#203730]"><tr>
          <th className="p-3">Product</th><th className="p-3">Company</th><th className="p-3">Volume</th><th className="p-3">Suitable metals</th>
          <th className="p-3">Price / box</th><th className="p-3">Stock</th><th className="p-3">Created</th><th className="p-3">Last restocked</th>
          <th className="p-3">Status</th><th className="p-3">Method</th><th className="p-3">Actions</th>
        </tr></thead>
        <tbody>{products.map((product) => <tr key={product.id} className="border-t border-[#e7ece8]">
          <td className="p-3"><Link to={`/product/${product.id}`} className="font-semibold text-[#203730] hover:underline">{product.name}</Link></td>
          <td className="p-3">{product.company || "-"}</td><td className="p-3">{product.volume_ml ? `${product.volume_ml} ml` : "-"}</td><td className="p-3">{product.suitable_metals || "-"}</td>
          <td className="p-3"><InlineProductField product={product} field="price" onSave={onUpdateField} /></td>
          <td className="p-3"><InlineProductField product={product} field="stock_quantity" onSave={onUpdateField} />{Number(product.reserved_quantity) > 0 && <p className="mt-1 text-xs font-semibold text-[#a36b00]">{product.reserved_quantity} reserved in pending orders</p>}</td>
          <td className="p-3 text-[#52645b]">{dateLabel(product.created_at)}</td><td className="p-3 text-[#52645b]">{dateLabel(product.restocked_at)}</td>
          <td className="p-3"><ProductStatusBadge status={product.status} onClick={() => onChangeStatus(product)} /></td>
          <td className="p-3"><button type="button" onClick={() => onChangeMethod(product)} className={`min-h-9 border px-3 text-xs font-semibold ${getZeroStockAction(product.zero_stock_action).className}`}>{getZeroStockAction(product.zero_stock_action).label}</button></td>
          <td className="p-3"><div className="flex gap-2"><button type="button" onClick={() => onEdit(product)} className="min-h-9 border border-[#dce4df] px-3">Edit</button><button type="button" onClick={() => onDelete(product.id)} className="min-h-9 border border-red-200 px-3 text-red-700">Delete</button></div></td>
        </tr>)}</tbody>
      </table>
    </div>
  );
};

export default AdminCleaningSolutionsTable;
