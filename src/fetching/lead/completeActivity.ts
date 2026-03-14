"use client";

import { useState } from "react";
import { leadType } from "@/lib/data.leads";

const useCompleteActivity = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const completeActivity = async (leadID: string | null, activityID: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (leadID) formData.append("leadID", leadID);
      formData.append("activityID", activityID);

      const res = await fetch("api/lead/completeActivity", {
        method: "PATCH",
        body: formData
      })
      

      const resData = await res.json();

      if (!res.ok) {
        const errMessage =
          (resData?.error && Array.isArray(resData.error) && resData.error[0]?.message) ||
          resData?.message ||
          "Unknown error";
        throw new Error(errMessage);
      }

      return (resData?.code ?? 200) === 200;
    } catch (err) {
      const errAny = err as Error;
      const errMessage = errAny.message || "Unknown error";
      throw new Error(errMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, completeActivity };
};

export default useCompleteActivity;
