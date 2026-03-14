"use client";

import { useState } from "react";
import { ApiResponseListAllQuotation, QuotationType } from "@/lib/data.quotation";


interface ItemRequest {
  id: string;
  quantity: number;
}

interface RequestType {
  leadId: string;
  title: string;
  content: string;
  items: ItemRequest[];
}


const useSaveQuotation = () => {
  const [loading, setLoading] = useState(false);

  const saveQuotation = async (
    newQuotation: QuotationType,
    leadID: string
  ): Promise<ApiResponseListAllQuotation> => {
    setLoading(true);

    try {
      const payload = convertData(newQuotation, leadID);

      const response = await fetch("/api/quotation/saveQuotation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData?.message || "Save quotation failed");
      }

      return resData.data;
    } finally {
      setLoading(false);
    }
  };

  return { loading, saveQuotation };
};


const convertData = (
  quotation: QuotationType,
  leadID: string
): RequestType => ({
  leadId: leadID,
  title: quotation.title,
  content: quotation.content,
  items: quotation.items.map((item) => ({
    id: item.productID,
    quantity: item.quantity,
  })),
});

export default useSaveQuotation;
