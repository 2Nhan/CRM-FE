"use client"

import { useState } from "react"

const useGetLeadConversion = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const getLeadConversion =  async (): Promise<any> => {
    setLoading(true);
    try{
      const resBackend = await fetch(`/api/sale-report/leadConversion`, {
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

  return {loading, getLeadConversion}
}

export default useGetLeadConversion;