"use client";

import { RequestAddNewLeadActivity } from "@/lib/data.leads";
import { useState } from "react";

const useAddLeadActivity = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addLeadActivity = async (leadID: string, newLeadActivity: RequestAddNewLeadActivity): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const payload = makePayload(newLeadActivity.content, newLeadActivity.type, newLeadActivity.validUntil);

      const res = await fetch(`/api/lead/addLeadActivity?leadID=${leadID}`, {
        method: "POST",
        body: payload,
        credentials: "include"
      });

      const resData = await res.json();

      if (!res.ok) {
        const errMessage =
          (resData?.error && Array.isArray(resData.error) && resData.error[0]?.message) ||
          resData?.message ||
          "Unknown error";
        throw new Error(errMessage);
      }

      return resData;
    } catch (err) {
      const errAny = err as Error;
      const errMessage = errAny.message || "Unknown error";
      throw new Error(errMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, addLeadActivity };
};

const makePayload = (content: string, type: string, validUntil: string) => {
  const payload = new FormData();
  
  if (content) payload.append("content", content);
  if (type) payload.append("type", type);
  if (validUntil) payload.append("validUntil", validUntil);

  return payload;
};

export default useAddLeadActivity;
