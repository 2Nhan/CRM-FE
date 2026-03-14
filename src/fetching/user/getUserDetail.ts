"use client";

import { ApiResponseGetUserDetailType } from "@/lib/data.user";
import { useState } from "react";

const useGetUserDetail = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const getUserDetail = async (userID: string): Promise<ApiResponseGetUserDetailType> => {
    setLoading(true);

    try {
      const resBackend = await fetch(`/api/admin/getUserDetail?userID=${userID}`, {
        method: "GET"
      })

      const result = await resBackend.json();

      if(!resBackend.ok){
        throw new Error(result.error.message || result.message || "Processed failed");
      }

      return result.data;
    } catch {
      throw new Error("Processed failed")
    } finally {
      setLoading(false);
    }
  }

  return {loading, getUserDetail};
}

export default useGetUserDetail;