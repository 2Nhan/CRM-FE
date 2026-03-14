"use client";

import { ApiResponseGetUserSummary } from "@/lib/data.user";
import { useState } from "react";

const useUserSummary = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const userSummary = async (): Promise<ApiResponseGetUserSummary> => {
    setLoading(true);

    try {
      const resBackend = await fetch("/api/user/userSummary", {
        method: "GET"
      });

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error(result.error.message || result.message || "Processed failed");
      }

      return result.data;
    } catch  {
      throw new Error("Proccessed failed");
    } finally {
      setLoading(false);
    }
  }

  return {loading, userSummary};
}

export default useUserSummary;