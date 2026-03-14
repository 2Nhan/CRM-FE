"use client";

import { ApiResponseGetAssignersType } from "@/lib/data.user";
import { useState } from "react";

const useGetAssigners = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const getAssigners = async (): Promise<ApiResponseGetAssignersType[]> => {
    setLoading(true);
    try{
      const resBackend = await fetch("/api/user/getAssigners", {
        method: "GET"
      });

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error(result.error?.message || result.message || "Processed failed");
      }

      return result.data;
    } catch(error){
      throw new Error(String(error) || "Proccessed failed");
    } finally {
      setLoading(false);
    }
  }

  return {loading, getAssigners}
}

export default useGetAssigners;