"use client";

import { useState } from "react";
import { OrderDataType } from "@/lib/data.orders";

const useSearchOrder = () => {
  const [ loading, setLoading ] = useState<boolean>(false);

  const searchOrder = async (query: string, pageNo: number): Promise<{orderRows: OrderDataType[], pagination: any}> => {
    setLoading(true);

    try {
      const resBackend = await fetch(`/api/order/searchOrder?query=${query}&pageNo=${pageNo}`, {
        method: "GET",
      })

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error(result.error.message || "Processed failed");
      }

      return {orderRows: result.data, pagination: result.pagination};
    } catch (error) {
      throw new Error( String(error) || "Internal connection failed");
    } finally {
      setLoading(false);
    }
  }

  return {loading, searchOrder};
}

export default useSearchOrder;