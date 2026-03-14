import Image from "next/image";
import { useQuotationTable } from "@/providers/QuotationTableProvider";
import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";

const QuotationStatistic = () => {
  // QUOTATION TABLE PROVIDER
  const {
    getAllQuotationLoading,
    quotationStatistic,
  } = useQuotationTable();

  if (!quotationStatistic) {
    return
  }

  return (
    <div className="w-full h-[100px] flex gap-5 px-2">
      {/* CREATE */}
      <div className="w-1/4 h-full rounded-3xl px-4 py-3 flex bg-gray-100 shadow-lg">

        {/* LEFT CONTENT */}
        <div className="w-2/3 h-full flex flex-col justify-center gap-1">
          <span className="text-sm text-gray-600">
            Draft Quotation
          </span>
          <span className="text-[26px] font-semibold text-gray-900">
            {quotationStatistic.Draft || 0}
          </span>
        </div>

        {/* RIGHT ICON */}
        <div className="w-1/3 h-full flex items-start justify-end">
          <div className="px-3 py-2 rounded-2xl border border-gray-300 bg-white">
            <Image src="/quotation_draft.png" alt="statistic icon" width={20} height={20} />
          </div>
        </div>
      </div>

      {/* SENT */}
      <div className="w-1/4 h-full rounded-3xl px-4 py-3 flex bg-blue-100 shadow-lg">
        <div className="w-2/3 h-full flex flex-col justify-center gap-1">
          <span className="text-sm text-blue-600">
            Sent Quotation
          </span>
          <span className="text-[26px] font-semibold text-gray-900">
            {quotationStatistic.Sent || 0}
          </span>
        </div>

        <div className="w-1/3 h-full flex items-start justify-end">
          <div className="px-3 py-2 rounded-2xl border border-green-300 bg-white">
            <Image src="/quotation_sent.png" alt="statistic icon" width={20} height={20} />
          </div>
        </div>
      </div>

      {/* EXPIRED */}
      <div className="w-1/4 h-full rounded-3xl px-4 py-3 flex bg-yellow-100 shadow-lg">
        <div className="w-2/3 h-full flex flex-col justify-center gap-1">
          <span className="text-sm text-yellow-700">
            Expired
          </span>
          <span className="text-[26px] font-semibold text-gray-900">
            {quotationStatistic.Expired || 0}
          </span>
        </div>

        <div className="w-1/3 h-full flex items-start justify-end">
          <div className="px-3 py-2 rounded-2xl border border-yellow-300 bg-white">
            <Image src="/quotation_expired.png" alt="statistic icon" width={20} height={20} />
          </div>
        </div>
      </div>

      {/* CANCELED */}
      <div className="w-1/4 h-full rounded-3xl px-4 py-3 flex bg-green-100 shadow-lg">
        <div className="w-2/3 h-full flex flex-col justify-center gap-1">
          <span className="text-sm text-green-600">
            Ordered
          </span>
          <span className="text-[26px] font-semibold text-gray-900">
            {quotationStatistic.Ordered || 0}
          </span>
        </div>

        <div className="w-1/3 h-full flex items-start justify-end">
          <div className="px-3 py-2 rounded-2xl border border-green-300 bg-white">
            <Image src="/quotation_canceled.png" alt="statistic icon" width={20} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationStatistic;
