"use client"

import { useState } from "react"

const useConfirmOrder = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const confirmOrder =  async (orderID: string) => {
    setLoading(true);
    try{
      const resBackend = await fetch(`/api/order/confirmOrder?orderID=${orderID}`, {
        method: "PATCH"
      })

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error( result.error.message || `Failed to confirm order ${orderID}`);
      }

      return result.data;
    }catch(error){
      throw new Error (String(error) || `Failed to conirm order ${orderID}`);
    }finally{
      setLoading(false);
    }
  }

  return {loading, confirmOrder}
}

export default useConfirmOrder;