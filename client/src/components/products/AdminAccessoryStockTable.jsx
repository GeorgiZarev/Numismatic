import { Link } from "react-router-dom";
import { getZeroStockAction } from "../../utils/zeroStockAction";
import InlineProductField from "./InlineProductField";
import ProductStatusBadge from "./ProductStatusBadge";
import AccessorySizeMatrix from "./AccessorySizeMatrix";
import ProductPhoto from "./ProductPhoto";

const dateLabel = (value) => value
  ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value))
  : "Not yet";

const AdminAccessoryStockTable = ({ products, onEdit, onDelete, onChangeStatus, onChangeMethod, onUpdateField }) => {
  if (products.length === 0) return <p className="py-8 text-sm text-[#63716a]">No products found.</p>;

  return (
    <div className="border border-[#dfe6e1] bg-white">
      {products.map((product) => (
        <section key={product.id} className="border-b border-[#dfe6e1] last:border-b-0">
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-[minmax(180px,1.5fr)_minmax(135px,1fr)_minmax(135px,1fr)_minmax(115px,0.8fr)]">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold uppercase text-[#63716a]">Name</p>
              <Link to={`/product/${product.id}`} className="flex items-center gap-3 font-semibold text-[#203730] hover:underline">
                {product.photo_url && <ProductPhoto src={product.photo_url} size="sm" />}
                <span className="min-w-0 break-words">{product.name}</span>
              </Link>
              {(product.company || product.pieces_per_box) && <p className="mt-1 text-xs text-[#63716a]">{[product.company, product.pieces_per_box && `${product.pieces_per_box} pcs / box`].filter(Boolean).join(" · ")}</p>}
            </div>
            <div><p className="mb-2 text-xs font-semibold uppercase text-[#63716a]">Created at</p><p className="text-sm text-[#354840]">{dateLabel(product.created_at)}</p></div>
            <div><p className="mb-2 text-xs font-semibold uppercase text-[#63716a]">Last restocked</p><p className="text-sm text-[#354840]">{dateLabel(product.restocked_at)}</p></div>
            <div><p className="mb-2 text-xs font-semibold uppercase text-[#63716a]">Price / box</p><InlineProductField product={product} field="price" onSave={onUpdateField} /></div>
          </div>

          <AccessorySizeMatrix product={product} onEdit={onEdit} />

          <div className="flex flex-wrap items-center gap-2 border-t border-[#e7ece8] px-4 py-3">
            <ProductStatusBadge status={product.status} onClick={() => onChangeStatus(product)} />
            <button type="button" onClick={() => onChangeMethod(product)} className={`min-h-9 border px-3 text-xs font-semibold ${getZeroStockAction(product.zero_stock_action).className}`}>{getZeroStockAction(product.zero_stock_action).label}</button>
            <div className="ml-auto flex gap-2">
              <button type="button" onClick={() => onEdit(product)} className="min-h-9 border border-[#dce4df] px-3 text-sm">Edit</button>
              <button type="button" onClick={() => onDelete(product.id)} className="min-h-9 border border-red-200 px-3 text-sm text-red-700">Delete</button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default AdminAccessoryStockTable;
