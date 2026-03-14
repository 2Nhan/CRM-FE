"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";

export const useGetListProducts = () => {
  const [data, setData] = useState<any | null>();
  const [error, setError] = useState<any | null>();
  const [loading, setLoading] = useState<boolean>(false);

  const getListProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/product/getList`);

      const resData = response.data;
      setData(resData.data);
      return resData;
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      const errMess =
        axiosErr.response?.data?.error?.message ||
        axiosErr.response?.data?.message ||
        axiosErr.message;

      throw new Error(errMess);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, getListProducts };
};

export const useGetListProductWithPageNo = () => {
  const [data, setData] = useState<any | null>();
  const [error, setError] = useState<any | null>();
  const [loading, setLoading] = useState<boolean>(false);

  const getListProductsWithPageNo = async (
    pageOrParams: number | { pageNo: number; status?: string; minPrice?: number | null; maxPrice?: number | null }
  ) => {
    setLoading(true);
    setError(null);

    try {
      let params: any = {};

      if (typeof pageOrParams === "number") {
        params.pageNo = pageOrParams;
      } else {
        params.pageNo = pageOrParams.pageNo;
        if (pageOrParams.status !== undefined && pageOrParams.status !== "") params.status = pageOrParams.status;
        if (pageOrParams.minPrice !== undefined && pageOrParams.minPrice !== null) params.minPrice = pageOrParams.minPrice;
        if (pageOrParams.maxPrice !== undefined && pageOrParams.maxPrice !== null) params.maxPrice = pageOrParams.maxPrice;
      }

      const response = await axios.get(`/api/product/getList`, { params });

      const resData = response.data;
      setData(resData.data);

      return resData;
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      const errMess =
        axiosErr.response?.data?.error?.message ||
        axiosErr.response?.data?.message ||
        axiosErr.message;

      throw new Error(errMess);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, getListProductsWithPageNo };
};
