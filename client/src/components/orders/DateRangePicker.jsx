import { useEffect, useRef, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { isInRange, monthGrid, parseDay, pickDay, shiftMonth, todayString, toDayString } from "../../utils/dateRange";

const usableLocale = (locale) => {
  try {
    return Intl.DateTimeFormat.supportedLocalesOf(locale).length ? locale : undefined;
  } catch {
    return undefined;
  }
};

const formatDay = (value, locale) => {
  const { year, monthIndex, day } = parseDay(value);
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(year, monthIndex, day));
};

const DateRangePicker = ({ from, to, onChange, locale: requestedLocale, labels }) => {
  const locale = usableLocale(requestedLocale);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState("");
  const [view, setView] = useState(() => {
    const { year, monthIndex } = parseDay(from || todayString());
    return { year, monthIndex };
  });
  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const today = todayString();

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const toggle = () => {
    if (!open) {
      const { year, monthIndex } = parseDay(from || today);
      setView({ year, monthIndex });
    }
    setOpen(!open);
  };

  const choose = (day) => {
    const next = pickDay({ from, to }, day);
    onChange(next);
    if (next.to) setOpen(false);
  };

  const preset = (fromDay, toDay = "") => {
    onChange({ from: fromDay, to: toDay });
    setOpen(false);
  };

  const daysAgo = (count) => {
    const date = new Date();
    date.setDate(date.getDate() - count);
    return todayString(date);
  };

  const moveFocus = (event) => {
    const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(event.key in steps)) return;
    event.preventDefault();
    const buttons = [...gridRef.current.querySelectorAll("button[data-day]")];
    const index = buttons.indexOf(document.activeElement);
    buttons[Math.min(buttons.length - 1, Math.max(0, index + steps[event.key]))]?.focus();
  };

  const monthTitle = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(new Date(view.year, view.monthIndex, 1));
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2026, 9, 5 + index))
  );
  const previewEnd = from && !to && hovered > from ? hovered : to;
  const summary = from ? (to ? `${formatDay(from, locale)} – ${formatDay(to, locale)}` : formatDay(from, locale)) : labels.placeholder;

  return (
    <div ref={rootRef} className="relative" onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
      <div className="mt-1 flex h-11 w-full items-center rounded border border-[#cfd8d3] bg-white focus-within:border-[#235b50] focus-within:ring-2 focus-within:ring-[#d9e9de]">
        <button type="button" onClick={toggle} aria-haspopup="dialog" aria-expanded={open} className="flex h-full min-w-0 flex-1 items-center gap-2 px-3 text-left text-sm focus:outline-none">
          <FiCalendar aria-hidden="true" className="shrink-0 text-[#235b50]" />
          <span className={`truncate ${from ? "text-[#203730]" : "text-[#8a968f]"}`}>{summary}</span>
        </button>
        {from && (
          <button type="button" onClick={() => onChange({ from: "", to: "" })} aria-label={labels.clear} title={labels.clear} className="mr-1 grid h-8 w-8 shrink-0 place-items-center rounded text-[#53655b] hover:bg-[#f1f4f1]">
            <FiX aria-hidden="true" />
          </button>
        )}
      </div>

      {open && (
        <div role="dialog" aria-label={labels.title} className="absolute left-0 z-40 mt-2 w-[min(320px,calc(100vw-32px))] rounded-lg border border-[#dce4df] bg-white p-4 normal-case shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <button type="button" onClick={() => setView(shiftMonth(view, -1))} aria-label={labels.previousMonth} className="grid h-9 w-9 place-items-center rounded-full text-[#203730] hover:bg-[#eef3f0]"><FiChevronLeft aria-hidden="true" /></button>
            <p className="text-sm font-semibold capitalize text-[#203730]" aria-live="polite">{monthTitle}</p>
            <button type="button" onClick={() => setView(shiftMonth(view, 1))} aria-label={labels.nextMonth} className="grid h-9 w-9 place-items-center rounded-full text-[#203730] hover:bg-[#eef3f0]"><FiChevronRight aria-hidden="true" /></button>
          </div>

          <div className="grid grid-cols-7 text-center text-[11px] font-semibold uppercase text-[#7a8a82]">
            {weekdays.map((weekday) => <span key={weekday} className="py-1">{weekday}</span>)}
          </div>
          <div ref={gridRef} onKeyDown={moveFocus} onMouseLeave={() => setHovered("")} className="grid grid-cols-7 gap-y-1">
            {monthGrid(view.year, view.monthIndex).map((day, index) => {
              if (!day) return <span key={`blank-${index}`} />;
              const isEdge = day === from || day === previewEnd;
              const inside = isInRange(day, from, previewEnd) && !isEdge;
              const rangeStart = day === from && previewEnd && previewEnd !== from;
              const rangeEnd = day === previewEnd && from && previewEnd !== from;
              return (
                <div key={day} className={`${inside ? "bg-[#e6f0eb]" : ""} ${rangeStart ? "rounded-l-full bg-[#e6f0eb]" : ""} ${rangeEnd ? "rounded-r-full bg-[#e6f0eb]" : ""}`}>
                  <button
                    type="button"
                    data-day={day}
                    onClick={() => choose(day)}
                    onMouseEnter={() => setHovered(day)}
                    aria-pressed={isEdge || inside}
                    aria-label={formatDay(day, locale)}
                    className={`mx-auto grid h-9 w-9 place-items-center rounded-full text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#235b50] ${isEdge ? "bg-[#235b50] font-semibold text-white" : "text-[#203730] hover:bg-[#d7e6de]"} ${day === today && !isEdge ? "font-semibold underline decoration-[#c69a5d] decoration-2 underline-offset-4" : ""}`}
                  >
                    {parseDay(day).day}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-[#63716a]">{from && !to ? labels.pickEnd : labels.hint}</p>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-[#e7ece8] pt-3">
            <button type="button" onClick={() => preset(today)} className="rounded-full border border-[#cfd8d3] px-3 py-1.5 text-xs font-semibold text-[#203730] hover:bg-[#eef3f0]">{labels.today}</button>
            <button type="button" onClick={() => preset(daysAgo(6), today)} className="rounded-full border border-[#cfd8d3] px-3 py-1.5 text-xs font-semibold text-[#203730] hover:bg-[#eef3f0]">{labels.last7}</button>
            <button type="button" onClick={() => { const now = new Date(); preset(toDayString(now.getFullYear(), now.getMonth(), 1), today); }} className="rounded-full border border-[#cfd8d3] px-3 py-1.5 text-xs font-semibold text-[#203730] hover:bg-[#eef3f0]">{labels.thisMonth}</button>
            <button type="button" onClick={() => setOpen(false)} className="ml-auto rounded-full bg-[#235b50] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#19473e]">{labels.done}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
