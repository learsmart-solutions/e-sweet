import { useCallback, useEffect, useMemo, useState } from "react";
import { navigate } from "../../../lib/router";
import { whatsappLink } from "../../../lib/whatsapp";
import { buildReceiptText, getAvailableItems } from "./orderUtils";

const useOrderHistory = ({ orders = [], addItem, showToast }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [reportOrder, setReportOrder] = useState(null);
  const [reorderOrder, setReorderOrder] = useState(null);

  const activeOrder = useMemo(
    () => orders.find((order) => order.status === "active") ?? null,
    [orders],
  );
  const pastOrders = useMemo(
    () => orders.filter((order) => order.status !== "active"),
    [orders],
  );
  const selectedOrder = useMemo(
    () =>
      pastOrders.find((order) => order.id === selectedId) ??
      pastOrders[0] ??
      null,
    [pastOrders, selectedId],
  );

  const closeReport = useCallback(() => setReportOrder(null), []);
  const closeReorder = useCallback(() => setReorderOrder(null), []);
  const closeMobileDetail = useCallback(() => setMobileDetailOpen(false), []);

  const handleSelect = useCallback((order) => {
    setSelectedId(order.id);
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches
    ) {
      setMobileDetailOpen(true);
    }
  }, []);

  // Keep the body-scroll lock from leaking if the viewport is widened while
  // the mobile detail is open.
  useEffect(() => {
    if (!mobileDetailOpen || typeof window === "undefined") return undefined;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = (event) => {
      if (event.matches) setMobileDetailOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [mobileDetailOpen]);

  const handleTrack = useCallback(() => {
    if (!activeOrder) return;
    const link = whatsappLink(`Hi, where's order ${activeOrder.id}?`);
    if (!link) {
      showToast("WhatsApp is unavailable right now.", "error");
      return;
    }
    window.open(link, "_blank", "noopener,noreferrer");
  }, [activeOrder, showToast]);

  const handleDownload = useCallback(
    (order) => {
      const blob = new Blob([buildReceiptText(order)], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `esweet-order-${order.id}.txt`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      // Safari and Firefox can cancel the download if the object URL is
      // revoked before they have read it.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast("Receipt downloaded", "success");
    },
    [showToast],
  );

  const handleShare = useCallback(
    async (order) => {
      const text = buildReceiptText(order);
      try {
        if (navigator.share) {
          await navigator.share({
            title: `e'sweet order #${order.id}`,
            text,
          });
          showToast("Receipt shared", "success");
          return;
        }
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          showToast("Receipt copied", "success");
          return;
        }
        showToast("Sharing is not available in this browser", "error");
      } catch (error) {
        if (error?.name !== "AbortError") {
          showToast("Could not share the receipt", "error");
        }
      }
    },
    [showToast],
  );

  const handleReorder = useCallback(
    (order) => {
      getAvailableItems(order).forEach((item) => {
        if (!item.menuItemId) return;
        for (let count = 0; count < Number(item.qty || 1); count += 1) {
          addItem(item.menuItemId);
        }
      });
      setReorderOrder(order);
    },
    [addItem],
  );

  const handleGoToBag = useCallback(() => {
    setReorderOrder(null);
    navigate("/bag");
  }, []);

  const handleReport = useCallback((order) => setReportOrder(order), []);

  const handleReportSent = useCallback(
    (report) => {
      if (!reportOrder) return;
      const lines = [
        `Hi e'sweet, I'd like to report an issue with order ${reportOrder.id}.`,
        `Issue: ${report.issue}`,
        `Details: ${report.details}`,
      ];
      if (report.photoName) {
        lines.push(
          `I've attached a photo (${report.photoName}) in this chat as well.`,
        );
      }
      const link = whatsappLink(lines.join("\n"));
      setReportOrder(null);
      if (!link) {
        showToast("WhatsApp is unavailable right now.", "error");
        return;
      }
      window.open(link, "_blank", "noopener,noreferrer");
      showToast("Opening WhatsApp…");
    },
    [reportOrder, showToast],
  );

  const detailProps = useMemo(
    () =>
      selectedOrder
        ? {
            order: selectedOrder,
            onDownload: handleDownload,
            onShare: handleShare,
            onReport: handleReport,
            onReorder: handleReorder,
          }
        : null,
    [selectedOrder, handleDownload, handleShare, handleReport, handleReorder],
  );

  return {
    activeOrder,
    pastOrders,
    selectedOrder,
    mobileDetailOpen,
    closeMobileDetail,
    reportOrder,
    closeReport,
    reorderOrder,
    closeReorder,
    detailProps,
    handleSelect,
    handleTrack,
    handleDownload,
    handleShare,
    handleReorder,
    handleGoToBag,
    handleReport,
    handleReportSent,
  };
};

export default useOrderHistory;
