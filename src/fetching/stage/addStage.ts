"use client";

import { useState } from "react";
import { leadType } from "@/lib/data.leads";

const useAddStage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addStage = async (stageName: string, stageColor: string): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const payload = makePayload(stageName, stageColor);

      const res = await fetch("/api/stage/addStage", {
        method: "POST",
        body: payload,
      });

      const resData = await res.json();

      if (!res.ok) {
        const errMessage =
          (resData?.error && Array.isArray(resData.error) && resData.error[0]?.message) ||
          resData?.error?.message ||
          "Unknown error";
        throw new Error(errMessage);
      }

      
      return resData;
    } catch (err) {
      const errAny = err as Error;
      const errMessage = errAny.message || "Unknown error";
      setError(errMessage);
      throw new Error(errMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, addStage };
};

const makePayload = (name: string, color: string) => {
  const payload = new FormData();
  
  payload.append("name", name);
  payload.append("color", color);

  return payload;
};

export default useAddStage;
