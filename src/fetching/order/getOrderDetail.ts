"use client";

import { getToken } from "@/service/localStorageService";
import { useState, useEffect } from "react";
import { OrderDetailType } from "@/lib/data.orders";


const useGetOrderDetail = () => {
  const [loading, setLoading] = useState<boolean>(false);


  const [accessToken, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getToken() || null);
  }, []);

  const getOrderDetail = async (orderID: string): Promise<OrderDetailType> => {
    setLoading(true);

    try {
      const response = await fetch(`/api/order/getOrderDetail?orderID=${orderID}`, {
        method: "GET",
        credentials: "include",
      })

      const resData = await response.json();

      return resData.data;
    } catch (err) {
      const errAny = err as Error;
      const errMessage = errAny.message || "Unknown error";
      throw new Error(errMessage);
    }
    finally {
      setLoading(false);
    }
  }

  return { loading, getOrderDetail }
}

export default useGetOrderDetail;