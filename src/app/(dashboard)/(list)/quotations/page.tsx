"use client";

import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";
import { useState, useEffect } from "react"
import QuotationPageHeader from "./QuotationPageHeader"
import QuotationStatistic from "./QuotationStatistic"
import QuotationTable from "./QuotationTable"
import { useQuotationTable } from "@/providers/QuotationTableProvider"
import { Search } from "lucide-react";

const Page = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { totalPages, getQuotationWithPageNo, searchQuotationFunction, getAllQuotationLoading } = useQuotationTable();
  const [searchTerm, setSearchTerm] = useState<string>("");
  // when page changes, call provider to fetch that page
  useEffect(() => {
    getQuotationWithPageNo(currentPage);
  }, [currentPage]);

  if (getAllQuotationLoading) {
    return <FetchingLoadingStatus loading={true} fullScreen={true} color="#1890ff" />
  }

  return (
    <div className='w-full h-full flex flex-col gap-5 px-3'>
      {/* PAGE HEADER  */}
      <QuotationPageHeader />
      <QuotationStatistic />
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchQuotationFunction(searchTerm);
              }
            }}
          />
        </div>
      </div>
      <QuotationTable totalPages={totalPages ?? 1} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default Page
