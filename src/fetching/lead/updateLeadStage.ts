"use client";

import { useState, useEffect } from "react";
import { ApiResponse, ApiResponseError, URL } from "@/lib/data";
import axios, { AxiosError } from "axios";
import { getToken } from "@/service/localStorageService";

const path = `${URL}/leads`;

const useUpdateLeadStage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();

  const [accessToken, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getToken() || null);
  }, []);
  
  const updateLeadStage = async (leadID: string, forwardStageID: string) => {
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("leadID", leadID);
      formData.append("forwardStageID", forwardStageID);

      const res = await fetch("api/lead/updateLeadStage", {
        method: "PATCH",
        body: formData,
        credentials: "include"
      })

      const result = await res.json()

      return result;
    } catch (err) {
      const errAxios = err as AxiosError<any>;
      const errData = errAxios.response?.data;
      const errMes: ApiResponseError = errData.error;
      throw new Error(errMes.message);
    }
  }

  return { loading, data, error, updateLeadStage };
}

export default useUpdateLeadStage;