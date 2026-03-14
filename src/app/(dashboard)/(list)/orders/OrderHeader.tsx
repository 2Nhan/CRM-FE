import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";
import { useOrderContext } from "@/providers/OrderProvider";
import { useNotification } from "@/providers/NotificationProvider";

const OrderHeader = () => {
  const { showNotification } = useNotification();
  const { orderStatistic } = useOrderContext();

  if (!orderStatistic) {
    return null;
  }

  const total = orderStatistic.Total;
  const pending = orderStatistic.Pending;
  const processing = 0;
  const delivered = orderStatistic.Delivered;
  const cancelled = orderStatistic.Cancelled;

  const totalAmount = orderStatistic.totalAmount;

  const pendingPct = (pending / total) * 100 || 0;
  const processingPct = (processing / total) * 100 || 0;
  const deliveredPct = (delivered / total) * 100 || 0;
  const cancelledPct = (cancelled / total) * 100 || 0;

  const moneyFormat = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  return (
    <div className="w-full bg-white flex items-center gap-6 p-4">
      {/* LEFT — TOTAL VALUES */}
      <div className="flex items-center gap-4 w-[22%]">
        <div className="p-3 bg-blue-100 rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
          </svg>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-medium">TOTAL ORDER VALUE</p>
          <h1 className="text-xl font-bold text-gray-800">{moneyFormat(totalAmount)}đ</h1>
        </div>
      </div>

      {/* RIGHT — STATUS */}
      <div className="flex-1 flex flex-col gap-3 border-l-[2px] px-[25px]">
        {/* ORDER COUNT */}
        <div className="text-gray-700 text-sm font-medium">
          <span className="font-semibold text-[20px]">{total}</span> orders
        </div>

        {/* STACKED PROGRESS BAR */}
        <div className="w-[60%] h-4 bg-gray-200 rounded-full overflow-hidden flex">
          <div className="bg-amber-500" style={{ width: `${pendingPct}%` }} />
          <div className="bg-blue-500" style={{ width: `${processingPct}%` }} />
          <div className="bg-green-500" style={{ width: `${deliveredPct}%` }} />
          <div className="bg-red-500" style={{ width: `${cancelledPct}%` }} />
        </div>

        {/* LEGEND */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-gray-600 text-sm">Pending:</span>
            <span className="font-semibold text-[15px]">{pending}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-gray-600 text-sm">Delivered:</span>
            <span className="font-semibold text-[15px]">{delivered}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-gray-600 text-sm">Cancelled:</span>
            <span className="font-semibold text-[15px]">{cancelled}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;