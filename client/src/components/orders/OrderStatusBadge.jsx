import { useTranslation } from "react-i18next";
import { normalizeOrderStatus, orderStatusClass } from "../../utils/orderStatus";

const OrderStatusBadge = ({ status, className = "" }) => {
  const { t } = useTranslation();
  const normalized = normalizeOrderStatus(status);
  return (
    <span className={`inline-flex h-fit items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${orderStatusClass(normalized)} ${className}`}>
      {t(`adminOrders.statuses.${normalized}`, { defaultValue: normalized })}
    </span>
  );
};

export default OrderStatusBadge;
