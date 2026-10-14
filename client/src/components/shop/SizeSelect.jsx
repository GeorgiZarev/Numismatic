import { useEffect, useRef, useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { sizeStockLevel } from "../../utils/productSizes";

const levelClass = {
  high: "text-[#1f7a4d]",
  low: "text-[#a36b00]",
  out: "text-[#b42318]",
};

const levelDot = {
  high: "bg-[#2e9e63]",
  low: "bg-[#e0a800]",
  out: "bg-[#d64035]",
};

const SizeSelect = ({ sizes, value, onChange, label, placeholder, availableLabel, outOfStockLabel }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const selected = sizes.find((row) => String(row.size_mm) === String(value));

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const selectable = (index) => sizes[index] && Number(sizes[index].stock_quantity) > 0;

  const move = (step) => {
    let index = activeIndex;
    for (let i = 0; i < sizes.length; i += 1) {
      index = (index + step + sizes.length) % sizes.length;
      if (selectable(index)) break;
    }
    setActiveIndex(index);
  };

  const choose = (index) => {
    if (!selectable(index)) return;
    onChange(String(sizes[index].size_mm));
    setOpen(false);
  };

  const openList = () => {
    const current = sizes.findIndex((row) => String(row.size_mm) === String(value));
    setActiveIndex(current >= 0 ? current : sizes.findIndex((row) => Number(row.stock_quantity) > 0));
    setOpen(true);
  };

  const onListKeyDown = (event) => {
    if (event.key === "ArrowDown") { event.preventDefault(); move(1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); move(-1); }
    else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(activeIndex); }
    else if (event.key === "Escape" || event.key === "Tab") setOpen(false);
  };

  const quantityText = (row) => Number(row.stock_quantity) > 0 ? `${row.stock_quantity} ${availableLabel}` : outOfStockLabel;

  return (
    <div ref={rootRef} className="relative mt-6">
      <span id="size-select-label" className="block text-sm font-medium text-[#354840]">{label}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="size-select-label size-select-value"
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(event) => { if (["ArrowDown", "ArrowUp"].includes(event.key)) { event.preventDefault(); openList(); } }}
        className="mt-2 flex min-h-12 w-full items-center justify-between gap-3 border border-[#cdd5d1] bg-white px-3 text-left text-[#20312e] focus:border-[#295d52] focus:outline-none"
      >
        <span id="size-select-value" className="flex min-w-0 flex-wrap items-center gap-x-2">
          {selected ? (
            <>
              <span className="font-medium">{selected.size_mm} mm</span>
              <span className={`flex items-center gap-1.5 text-sm ${levelClass[sizeStockLevel(selected.stock_quantity)]}`}>
                <span aria-hidden="true" className={`h-2 w-2 rounded-full ${levelDot[sizeStockLevel(selected.stock_quantity)]}`} />
                {quantityText(selected)}
              </span>
            </>
          ) : <span className="text-[#5d6d66]">{placeholder}</span>}
        </span>
        <FiChevronDown aria-hidden="true" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-labelledby="size-select-label"
          aria-activedescendant={activeIndex >= 0 ? `size-option-${activeIndex}` : undefined}
          onKeyDown={onListKeyDown}
          className="absolute left-0 right-0 z-30 mt-1 max-h-72 overflow-y-auto border border-[#cdd5d1] bg-white py-1 shadow-lg focus:outline-none"
        >
          {sizes.map((row, index) => {
            const level = sizeStockLevel(row.stock_quantity);
            const isSelected = String(row.size_mm) === String(value);
            return (
              <li
                key={row.size_mm}
                id={`size-option-${index}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={level === "out"}
                onMouseEnter={() => selectable(index) && setActiveIndex(index)}
                onClick={() => choose(index)}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 text-sm ${level === "out" ? "cursor-not-allowed opacity-70" : "cursor-pointer"} ${index === activeIndex ? "bg-[#eef3f0]" : ""}`}
              >
                <span className="flex items-center gap-2 font-medium text-[#20312e]">
                  <FiCheck aria-hidden="true" className={isSelected ? "text-[#235b50]" : "invisible"} />
                  {row.size_mm} mm
                </span>
                <span className={`flex items-center gap-1.5 whitespace-nowrap ${levelClass[level]}`}>
                  <span aria-hidden="true" className={`h-2 w-2 rounded-full ${levelDot[level]}`} />
                  {quantityText(row)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SizeSelect;
