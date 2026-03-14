"use client";

import { useState } from "react";

const useSearchCustomer = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const searchCustomer = async (query: string, pageNo: number) => {
    setLoading(true);
    try {
      const resBackend = await fetch(`/api/customer/searchCustomer?query=${query}&pageNo=${pageNo}`, {
        method: "GET"
      })

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error (result.error.message || "Processed failed")
      }

      return result;
    } catch (error) {
      throw new Error(String(error) || "Internal connection failed");
    } finally {
      setLoading(false);
    }
  }

  return {loading, searchCustomer};
}

export default useSearchCustomer;