"use client"
import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";
import OrderHeader from "./OrderHeader";
import OrderTable from "./OrderTable";
import { useOrderContext } from "@/providers/OrderProvider";

const Page = () => {

  // API HOOK
  const { isInitialLoading } = useOrderContext();


  if (isInitialLoading) {
    return (
      <FetchingLoadingStatus loading={true} fullScreen={true} color="#1890ff" />
    )
  }

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      <OrderHeader />

      <div className="h-[5%] w-full border-b border-gray-200 px-4 flex items-end">
        <div className="px-4 py-2 text-blue-600 font-semibold border-b-2 border-blue-600">
          Order table
        </div>
      </div>
      <OrderTable />
    </div>
  );
};

export default Page;
