"use client"

import { useState } from "react"

const useGetQuotationRevenue = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const getQuotationRevenue =  async (): Promise<any> => {
    setLoading(true);
    try{
      const resBackend = await fetch(`/api/sale-report/quotationRevenue`, {
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

  return {loading, getQuotationRevenue}
}

export default useGetQuotationRevenue;