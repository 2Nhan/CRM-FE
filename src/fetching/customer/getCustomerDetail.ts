"use client";

import { useState } from "react";

const useGetCustomerDetail = () => {
  const [loading, setLoading] = useState(false);

  const getCustomerDetail = async (customerID: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/customer/getCustomerDetail?customerID=${customerID}`, {
        method: "GET",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Get customer detail failed");
      }

      const data = await res.json();
      return data;
    } finally {
      setLoading(false);
    }
  };

  return { loading, getCustomerDetail };
};

export default useGetCustomerDetail;
