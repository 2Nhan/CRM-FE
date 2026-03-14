"use client";

import { useState } from "react";

interface ApiResponse {
  code: number;
  message: string;
}

const useDeleteProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const deleteProduct = async (productID: string) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/product/deleteProduct?productID=${productID}`, {
        method: "DELETE",
        credentials: "include"
      });

      const resData: ApiResponse = await res.json();

      if (!res.ok || resData.code !== 200) {
        throw new Error(resData.message);
      }

      return true;

    } catch (err) {
      const errAny = err as Error;
      const errMessage = errAny.message || "Unknown error";
      setError(errMessage);
      throw new Error(errMessage);

    } finally {
      setLoading(false);
    }
  };

  return { loading, error, deleteProduct };
};

export default useDeleteProduct;
