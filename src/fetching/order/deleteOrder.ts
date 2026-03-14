"use client"

import { useState } from "react";

const useDeleteOrder = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const deleteOrder = async (orderID: string): Promise<boolean> => {
    setLoading(true);

    try {
      const resBackend = await fetch(`/api/order/deleteOrder?orderID=${orderID}`, {
        method: "DELETE"
      })

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error(result.error.message || result.message || "Processed failed");
      }

      return result.code === 200;
    } catch (error) {
      throw new Error(String(error) || "Processed failed");
    } finally {
      setLoading(false);
    }
  }

  return {loading, deleteOrder}
}

export default useDeleteOrder;