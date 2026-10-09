import { useEffect, useRef, useState } from "react";
import { FiCheck, FiEdit2, FiX } from "react-icons/fi";
import { formatMoney } from "../../utils/money";

const InlineProductField = ({ product, field, onSave }) => {
  const isStock = field === "stock_quantity";
  const label = isStock ? "stock" : "price";
  const value = product[field] ?? 0;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!editing) setDraft(String(value));
  }, [editing, value]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const cancel = () => {
    setDraft(String(value));
    setError("");
    setEditing(false);
  };

  const save = async (event) => {
    event.preventDefault();
    const nextValue = Number(draft);
    if (draft.trim() === "" || !Number.isFinite(nextValue) || nextValue < 0 || (isStock && !Number.isInteger(nextValue))) {
      setError(isStock ? "Enter a whole number of 0 or more." : "Enter a price of 0 or more.");
      return;
    }
    if (nextValue === Number(value)) {
      cancel();
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSave(product, field, nextValue);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || `Could not save ${label}.`);
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={`Edit ${label} for ${product.name}`}
        title={`Edit ${label}`}
        className="group inline-flex min-h-10 items-center gap-2 rounded px-2 text-left text-[#203730] hover:bg-[#eef3f0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#235b50]"
      >
        <span>{isStock ? value : formatMoney(value)}</span>
        <FiEdit2 size={14} aria-hidden="true" className="text-[#6e8277] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
      </button>
    );
  }

  return (
    <form onSubmit={save} className="w-full min-w-0" onKeyDown={(event) => { if (event.key === "Escape" && !saving) { event.stopPropagation(); cancel(); } }}>
      <div className="flex items-center gap-1">
        {!isStock && <span aria-hidden="true" className="text-[#53655b]">€</span>}
        <input
          ref={inputRef}
          type="number"
          min="0"
          step={isStock ? "1" : "0.01"}
          required
          aria-label={`${isStock ? "Stock" : "Price"} for ${product.name}`}
          value={draft}
          onChange={(event) => { setDraft(event.target.value); setError(""); }}
          disabled={saving}
          className="h-10 min-w-0 max-w-20 flex-1 rounded border border-[#84a99a] bg-white px-2 text-sm text-[#203730] outline-none focus:ring-2 focus:ring-[#d9e9de] disabled:opacity-60"
        />
        <button type="submit" disabled={saving} aria-label={`Save ${label}`} title={`Save ${label}`} className="grid h-10 w-8 shrink-0 place-items-center rounded bg-[#235b50] text-white hover:bg-[#19473e] disabled:opacity-50"><FiCheck size={17} /></button>
        <button type="button" onClick={cancel} disabled={saving} aria-label={`Cancel ${label} edit`} title="Cancel" className="grid h-10 w-8 shrink-0 place-items-center rounded border border-[#cbd6ce] text-[#53655b] hover:bg-[#f1f4f1] disabled:opacity-50"><FiX size={17} /></button>
      </div>
      {error && <p role="alert" className="mt-1 max-w-48 text-xs text-red-700">{error}</p>}
    </form>
  );
};

export default InlineProductField;
