"use client"

import { useState } from "react"

const useCancelOrder = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const cancelOrder =  async (orderID: string) => {
    setLoading(true);
    try{
      const resBackend = await fetch(`/api/order/cancelOrder?orderID=${orderID}`, {
        method: "PATCH"
      })

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error( result.error.message || `Failed to cancel order ${orderID}`);
      }

      return result.data;
    }catch(error){
      throw new Error (String(error) || `Failed to cancel order ${orderID}`);
    }finally{
      setLoading(false);
    }
  }

  return {loading, cancelOrder}
}

export default useCancelOrder;