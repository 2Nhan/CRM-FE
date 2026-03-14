"use client";

import { useState } from "react";

const useDeleteQuotation = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const deleteQuotation = async (quotationID: string): Promise<boolean> => {
    setLoading(true);
    try{
      const resBackend = await fetch(`/api/quotation/deleteQuotation?quotationID=${quotationID}`, {
        method: "DELETE",
      });

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error(result.error.message || "Processed failed");
      }

      return result.code === 200;
    }catch{
      throw new Error("Processed failed");
    } finally {
      setLoading(false);
    }
  }

  return {loading, deleteQuotation}
}

export default useDeleteQuotation;