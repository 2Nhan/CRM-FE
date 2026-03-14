"use client"

import { useState } from "react"

const useOrderSummary = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const orderSummary =  async () => {
    setLoading(true);
    try{
      const resBackend = await fetch(`/api/order/orderSummary`, {
        method: "GET"
      })

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error( result.error.message || `Failed to get order summary`);
      }

      return result.data;
    }catch(error){
      throw new Error (String(error) || `Failed to get order summary`);
    }finally{
      setLoading(false);
    }
  }

  return {loading, orderSummary}
}

export default useOrderSummary;