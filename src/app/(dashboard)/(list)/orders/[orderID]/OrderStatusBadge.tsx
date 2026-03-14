const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 border border-amber-200",
  Processing: "bg-blue-100 text-blue-700 border border-blue-200",
  Delivered: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Cancelled: "bg-red-100 text-red-700 border border-red-200",
};

const OrderStatusBadge = ({ status }: { status: string }) => {
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-700 border border-gray-300";
  return (
    <div className={`px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center justify-center ${style}`}>
      {status}
    </div>
  );
};

export default OrderStatusBadge;