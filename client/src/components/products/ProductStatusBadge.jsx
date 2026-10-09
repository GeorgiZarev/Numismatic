import { getProductStatus } from "../../utils/productStatus";

const ProductStatusBadge = ({ status, onClick }) => {
  const current = getProductStatus(status);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Change status from ${current.label}`}
      title="Change product status"
      className={`inline-flex min-h-9 items-center rounded border px-3 py-1 text-xs font-semibold transition-colors hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#235b50] ${current.className}`}
    >
      {current.label}
    </button>
  );
};

export default ProductStatusBadge;
