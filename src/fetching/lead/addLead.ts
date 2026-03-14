"use client";

import { useState } from "react";
import { leadType } from "@/lib/data.leads";

const useAddLead = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addLead = async (newLead: leadType, stageID: string): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const payload = makePayload(newLead, stageID);

      const res = await fetch("/api/lead/add", {
        method: "POST",
        body: payload,
      });

      const resData = await res.json();

      if (!res.ok) {
        const errMessage =
          (resData?.error && Array.isArray(resData.error) && resData.error[0]?.message) ||
          resData?.error.message ||
          "Unknown error";
        throw new Error(errMessage);
      }

      setData(resData);
      return resData.data;
      
    } catch (err) {
      const errAny = err as Error;
      const errMessage = errAny.message || "Unknown error";
      setError(errMessage);
      throw new Error(errMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, addLead };
};

const makePayload = (newLead: leadType, stageID: string) => {
  const payload = new FormData();
  payload.append("fullName", newLead.name);
  payload.append("email", newLead.email);
  payload.append("phoneNumber", newLead.phone);
  payload.append("rating", String(newLead.rating));
  payload.append("expectedRevenue", String(newLead.expectedRevenue))
  payload.append("stageID", stageID); 
  return payload;
};

export default useAddLead;
