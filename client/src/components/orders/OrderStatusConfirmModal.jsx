import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { orderStockEffect } from "../../utils/orderStatus";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderStatusConfirmModal = ({ change, saving, error, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  const confirmRef = useRef(null);
  useEffect(() => { confirmRef.current?.focus(); }, []);

  const { order, status } = change;
  const effect = orderStockEffect(order.status, order.stock_committed, status);
  const statusLabel = (value) => t(`adminOrders.statuses.${value === "canceled" ? "cancelled" : value}`, { defaultValue: value });

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#142521]/50 p-4" role="presentation" onKeyDown={(event) => { if (event.key === "Escape" && !saving) onCancel(); }}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="status-confirm-title" aria-describedby="status-confirm-text" className="w-full max-w-md rounded-md bg-white p-5 shadow-xl">
        <h2 id="status-confirm-title" className="text-lg font-semibold text-[#203730]">{t("adminOrders.confirmTitle")}</h2>
        <p id="status-confirm-text" className="mt-3 text-sm text-[#354840]">
          {t("adminOrders.confirmText", { id: order.id.slice(0, 8), from: statusLabel(order.status), to: statusLabel(status) })}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <OrderStatusBadge status={order.status} /> <span aria-hidden="true">→</span> <OrderStatusBadge status={status} />
        </div>
        {effect !== "none" && <p className="mt-3 rounded border border-[#f0dfb8] bg-[#fff9ec] px-3 py-2 text-sm text-[#7a5414]">{t(`adminOrders.stockEffects.${effect}`)}</p>}
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={saving} className="min-h-11 rounded border border-[#cbd6ce] px-4 text-sm font-semibold text-[#203730] disabled:opacity-50">{t("adminOrders.cancelChange")}</button>
          <button ref={confirmRef} type="button" onClick={onConfirm} disabled={saving} className="min-h-11 rounded bg-[#235b50] px-5 text-sm font-semibold text-white hover:bg-[#19473e] disabled:cursor-wait disabled:opacity-60">{saving ? t("adminOrders.saving") : t("adminOrders.confirmChange")}</button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusConfirmModal;
