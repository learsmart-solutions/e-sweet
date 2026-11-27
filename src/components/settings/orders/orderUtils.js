import { menuItems } from "../../../data/menu";
import { formatNaira } from "../../../lib/money";
import { TAKEAWAY_PACK_FEE } from "../../../lib/pricing";

const menuItemById = Object.fromEntries(
  menuItems.map((item) => [item.id, item]),
);

// Short names used in the order-history list and the active-order summary.
const shortNames = {
  "smoky-jollof": "Jollof",
  "asun-peppered-goat": "Asun",
  "chilled-zobo": "Zobo",
  "pounded-yam": "Pounded yam",
  "efo-riro": "Efo riro",
  shawarma: "Chicken shawarma",
  "lss-chicken": "Fried chicken",
  "lss-fried-turkey": "Fried turkey",
  "spicy-moi-moi": "Moi-moi",
  "dodo-pepper-dip": "Dodo",
  "fresh-juices": "Juice",
};

const parseOrderDate = (iso) => {
  if (!iso) return null;
  const date = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatOrderDate = (iso) => {
  const date = parseOrderDate(iso);
  if (!date) return iso || "";
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const isToday = (iso) => {
  const date = parseOrderDate(iso);
  if (!date) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

export const formatActiveDate = (order) => {
  const date = isToday(order.date) ? "Today" : formatOrderDate(order.date);
  return `${date} ${order.time || ""}`.trim();
};

export const getOrderMeta = (order) =>
  [
    [formatOrderDate(order.date), order.time].filter(Boolean).join(", "),
    order.type || "Delivery",
  ]
    .filter(Boolean)
    .join(" · ");

export const getItemImage = (item) =>
  item?.image || menuItemById[item?.menuItemId]?.image || null;

export const isDrinkItem = (item) =>
  menuItemById[item?.menuItemId]?.category === "Drinks";

export const getOrderSubtotal = (order) =>
  (order.items ?? []).reduce(
    (total, item) => total + Number(item.unitPrice || 0) * Number(item.qty || 0),
    0,
  );

export const getOrderPackCount = (order) =>
  order.packCount ??
  (order.items ?? [])
    .filter((item) => !isDrinkItem(item))
    .reduce((total, item) => total + Number(item.qty || 0), 0);

export const getOrderPackFee = (order) =>
  Number(order.packFee ?? getOrderPackCount(order) * TAKEAWAY_PACK_FEE);

export const getOrderDeliveryFee = (order) => Number(order.deliveryFee || 0);

export const getOrderTotal = (order) =>
  Number(
    order.total ??
      getOrderSubtotal(order) +
        getOrderPackFee(order) +
        getOrderDeliveryFee(order),
  );

export const getOrderShortTitle = (order) => {
  const items = order.items ?? [];
  if (items.length === 0) return "Order";

  const names = items.map(
    (item) => item.shortName || shortNames[item.menuItemId] || item.name,
  );

  if (names.length === 2) return names.join(" & ");
  if (items.length === 1 && Number(items[0].qty) > 1) {
    return `${names[0]} ×${items[0].qty}`;
  }
  return names.join(", ");
};

export const getActiveSummary = (order) =>
  (order.items ?? [])
    .map((item) => {
      const name = item.shortName || shortNames[item.menuItemId] || item.name;
      return Number(item.qty) > 1 ? `${name} ×${item.qty}` : name;
    })
    .join(", ");

export const getOrderStatusTone = (order) => {
  if (order.status === "active") return "active";
  if (order.status === "cancelled") return "cancelled";
  return "delivered";
};

export const getOrderStatusLabel = (order) => {
  if (order.status === "active") {
    if (order.activeStatus === "on-the-way") return "On the way";
    if (order.activeStatus === "ready") return "Ready";
    return "Preparing";
  }
  return order.status === "cancelled" ? "Cancelled" : "Delivered";
};

export const getActiveHeadline = (order) => {
  if (order.activeStatus === "on-the-way") return "On the way · arriving soon";
  if (order.activeStatus === "ready") return "Ready for pickup";
  return "Preparing your order";
};

export const getActiveOrderCard = (order) => {
  if (!order) return null;
  const step =
    order.activeStatus === "on-the-way"
      ? 2
      : order.activeStatus === "ready"
        ? 3
        : 1;
  return {
    code: order.id,
    headline: getActiveHeadline(order),
    step,
    totalSteps: 3,
  };
};

// Availability comes from today's menu, not from a flag stored on the old
// order. Items that have been removed are skipped; once the kitchen feed
// marks menu items sold out, that same check catches them.
export const getItemAvailability = (item) => {
  const menuItem = menuItemById[item?.menuItemId];
  if (!menuItem) return "removed";
  if (menuItem.soldOut) return "sold-out";
  return "available";
};

export const getAvailableItems = (order) =>
  (order.items ?? []).filter(
    (item) => getItemAvailability(item) === "available",
  );

export const getUnavailableItems = (order) =>
  (order.items ?? [])
    .map((item) => ({ item, reason: getItemAvailability(item) }))
    .filter(({ reason }) => reason !== "available");

export const buildReceiptText = (order) => {
  const itemLines = (order.items ?? []).map(
    (item) =>
      `${item.qty} × ${item.name} — ${formatNaira(
        Number(item.unitPrice || 0) * Number(item.qty || 0),
      )}`,
  );

  return [
    `e'sweet — Order #${order.id}`,
    getOrderMeta(order),
    "",
    ...itemLines,
    "",
    `Subtotal: ${formatNaira(getOrderSubtotal(order))}`,
    `Packs: ${formatNaira(getOrderPackFee(order))}`,
    `Delivery fee: ${formatNaira(getOrderDeliveryFee(order))}`,
    `Total: ${formatNaira(getOrderTotal(order))}`,
    "",
    `Address: ${order.address || "—"}`,
    `Payment: ${order.payment || "—"}`,
    ...(order.kitchenNote ? [`Kitchen note: ${order.kitchenNote}`] : []),
  ].join("\n");
};
