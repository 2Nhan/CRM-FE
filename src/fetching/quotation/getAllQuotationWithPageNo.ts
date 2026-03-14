"use client";

import { useState } from "react";
import {
  ApiResponseListAllQuotation,
  QuotationRow,
  QuotationStatisticType,
} from "@/lib/data.quotation";

interface pagination {
  hasPre: boolean,
  hasNext: boolean,
  pageNumber: number,
  totalPages: number,
}

const useGetListQuotationWithPageNo = () => {
  const [loading, setLoading] = useState<boolean>(false);


  const getAllQuotationWithPageNo = async (pageNo: number): Promise<{quotationRows: QuotationRow[]; quotationStatistic: QuotationStatisticType; dataPaganavigate: pagination}> => {
    setLoading(true);

    try {
      const response = await fetch(`/api/quotation/getAllQuotationWithPageNo?pageNo=${pageNo}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resData = await response.json();

      const rawData: ApiResponseListAllQuotation[] = resData.data; 

            const dataPaganavigate: pagination = resData.pagination;

      const { quotationRows, quotationStatistic } = dataConvertToQuotationRow(rawData);


      return {quotationRows, quotationStatistic, dataPaganavigate};
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getAllQuotationWithPageNo,
  };
};



const dataConvertToQuotationRow = (
    response: ApiResponseListAllQuotation[]
  ): { quotationRows: QuotationRow[]; quotationStatistic: QuotationStatisticType } => {
    const quotationStatistic: QuotationStatisticType = {};

    const quotationRows: QuotationRow[] = response.map((item) => {
      quotationStatistic[item.status] = (quotationStatistic[item.status] || 0) + 1;

      return {
        QuotationID: item.id,
        QuotationContent: item.content,
        QuotationTitle: item.title,
        CreatedAt: item.createdAt,
        CustomerName: item.lead.fullName,
        FinalAmount: item.finalAmount ?? undefined, 
        Status: item.status,
        Items: item.items.length,
        ValidUntil: item.validUntil,
      };
    });

    return { quotationRows, quotationStatistic };
  };

export default useGetListQuotationWithPageNo;