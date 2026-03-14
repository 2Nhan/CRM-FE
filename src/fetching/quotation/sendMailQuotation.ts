"use client";

import { useState } from "react";
import { ApiResponseListAllQuotation, QuotationType } from "@/lib/data.quotation";

const useSendMailQuotation = () => {
  const [loading, setLoading] = useState(false);

  const sendMailQuotation = async (quotationID: string) => {
    setLoading(true);

    try {

      const response = await fetch(`/api/quotation/sendMailQuotation?quotationID=${quotationID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData?.message || "Send mail quotation failed");
      }

      return resData;
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMailQuotation };
};

export default useSendMailQuotation;
