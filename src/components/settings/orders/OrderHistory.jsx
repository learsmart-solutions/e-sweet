import React from "react";
import OrderActiveCard from "./OrderActiveCard";
import OrderDetailCard from "./OrderDetailCard";
import OrderEmptyState from "./OrderEmptyState";
import OrderList from "./OrderList";

const OrderHistory = ({
  orders = [],
  activeOrder,
  pastOrders = [],
  selectedOrder,
  detailProps,
  onSelect,
  onTrack,
}) => {
  if (orders.length === 0) return <OrderEmptyState />;

  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
      <div className="flex min-w-0 flex-col gap-5">
        {activeOrder && (
          <OrderActiveCard order={activeOrder} onTrack={onTrack} />
        )}
        {pastOrders.length > 0 ? (
          <OrderList
            orders={pastOrders}
            selectedId={selectedOrder?.id}
            onSelect={onSelect}
          />
        ) : (
          <p className="rounded-[20px] border border-[#F0E4D6] bg-cream-light p-5 text-[14px] text-muted">
            Past orders will appear here after your first delivery.
          </p>
        )}
      </div>

      {detailProps && (
        <div className="hidden min-w-0 lg:block">
          <OrderDetailCard {...detailProps} />
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
