"use client"

import { ApiResponseQuotationSummary } from "@/lib/data.quotation";
import { useState } from "react"

const useQuotationSummary = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const quotationSummary =  async (): Promise<ApiResponseQuotationSummary> => {
    setLoading(true);
    try{
      const resBackend = await fetch(`/api/quotation/quotationSummary`, {
        method: "GET"
      })

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error( result.error.message || `Failed to get quotation summary`);
      }

      return result.data;
    }catch(error){
      throw new Error (String(error) || `Failed to get quotation summary`);
    }finally{
      setLoading(false);
    }
  }

  return {loading, quotationSummary}
}

export default useQuotationSummary;