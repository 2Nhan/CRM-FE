"use client";

import { getAllCustomersResponse } from "@/lib/data.customers";
import { useState, useCallback } from "react";

const useGetAllCustomer = () => {
  const [loading, setLoading] = useState(false);

  const getAllCustomer = useCallback(async (pageNo?: number) => {
    setLoading(true);
    try {
      const query = pageNo ? `?pageNo=${pageNo}` : "";
      const res = await fetch(`/api/customer/getAllCustomer${query}`, {
        method: "GET",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Get customers failed");
      }

      const result = await res.json();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, getAllCustomer };
};

export default useGetAllCustomer;
