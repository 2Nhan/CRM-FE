"use client";

import { useState } from "react";
import {
  ApiResponseListAllQuotation,
} from "@/lib/data.quotation";


const useGetQuotationDetail = () => {
  const [loading, setLoading] = useState<boolean>(false);


  const getQuotationDetail = async (quotationID: string): Promise<ApiResponseListAllQuotation> => {
    setLoading(true);

    try {
      const response = await fetch(`/api/quotation/getQuotationDetail?QuotationID=${quotationID}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resData = await response.json();

      const rawData: ApiResponseListAllQuotation = resData.data;

      return rawData;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getQuotationDetail,
  };
};

export default useGetQuotationDetail;