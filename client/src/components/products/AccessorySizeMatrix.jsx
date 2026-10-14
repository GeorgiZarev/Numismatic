import { reservedForSize } from "../../utils/productSizes";

const AccessorySizeMatrix = ({ product, onEdit }) => {
  const sizes = Array.isArray(product.size_stock) ? product.size_stock : [];

  if (sizes.length === 0) {
    return (
      <div className="border-t border-[#e7ece8] bg-[#fff9ed] px-4 py-3 text-sm text-[#76552c]">
        No sizes saved. {Number(product.stock_quantity) > 0 && `${product.stock_quantity} boxes are recorded without a size breakdown. `}
        <button type="button" onClick={() => onEdit(product)} className="font-semibold underline underline-offset-2">Add sizes</button>
      </div>
    );
  }

  return (
    <div className="border-t border-[#e7ece8]">
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full table-fixed text-sm" style={{ minWidth: Math.max(0, 120 + sizes.length * 80) }}>
          <tbody>
            <tr className="border-b border-[#e7ece8] bg-[#f5f7f5]">
              <th scope="row" className="w-[120px] px-4 py-2 text-left font-semibold text-[#354840]">Sizes</th>
              {sizes.map((row) => <th key={row.size_mm} scope="col" className="px-2 py-2 text-center font-semibold text-[#203730]">{row.size_mm} mm</th>)}
            </tr>
            <tr>
              <th scope="row" className="px-4 py-2 text-left font-semibold text-[#354840]">Quantity</th>
              {sizes.map((row) => <td key={row.size_mm} className="px-2 py-2 text-center text-[#203730]">{row.stock_quantity} boxes{reservedForSize(product, row.size_mm) > 0 && <span className="block text-xs font-semibold text-[#a36b00]">{reservedForSize(product, row.size_mm)} reserved</span>}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 px-4 sm:hidden">
        {sizes.map((row) => (
          <div key={row.size_mm} className="flex items-center justify-between gap-2 border-b border-[#e7ece8] py-2 text-sm">
            <span className="font-semibold text-[#203730]">{row.size_mm} mm</span>
            <span className="whitespace-nowrap text-[#52645b]">{row.stock_quantity} boxes{reservedForSize(product, row.size_mm) > 0 && <span className="ml-1 text-xs font-semibold text-[#a36b00]">({reservedForSize(product, row.size_mm)} reserved)</span>}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessorySizeMatrix;
