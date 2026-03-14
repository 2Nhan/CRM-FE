// ============ ORDER STATUS COMPONENT ============
const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 border border-amber-200",
  Processing: "bg-blue-100 text-blue-700 border border-blue-200",
  Delivered: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Cancelled: "bg-red-100 text-red-700 border border-red-200",
};

const OrderStatusComponent = ({ status }: { status: string }) => {
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-700 border border-gray-300";
  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center whitespace-nowrap ${style}`}>
      {status}
    </div>
  );
};

export default OrderStatusComponent;