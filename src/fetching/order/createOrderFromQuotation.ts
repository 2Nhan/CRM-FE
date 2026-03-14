"use client";

import { useState } from "react";
import { OrderDataType } from "@/lib/data.orders";

const useCreateOrderFromQuotation = () => {
  const [loading, setLoading] = useState(false);

  const createOrderFromQuotation = async (
    quotationID: string,
    payload: { orderCode: string; shippingAddress: string }
  ): Promise<OrderDataType> => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/quotation/createOrderFromQuotation?quotationID=${quotationID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData?.message || "Create order failed");
      }

      const data: OrderDataType = resData.data || resData;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, createOrderFromQuotation };
};

export default useCreateOrderFromQuotation;
