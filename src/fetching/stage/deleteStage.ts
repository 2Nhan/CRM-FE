"use client";

import { useState } from "react";

const useDeleteStage = () => {
  const [loading, setLoading] = useState(false);

  const deleteStage = async (stageID: string): Promise<boolean> => {
    setLoading(true);

    try {
      const res = await fetch(`/api/stage/deleteStage?stageID=${stageID}`, {
        method: "DELETE",
        credentials: "include",
      });

      const resData = await res.json();

      if (!res.ok) {
        const errMessage =
          (resData?.error && Array.isArray(resData.error) && resData.error[0]?.message) ||
          resData?.error.message ||
          "Unknown error";
        throw new Error(errMessage);
      }

      return resData.code === 200;
    } catch (err) {
      const errAny = err as Error;
      const errMessage = errAny.message || "Unknown error";
      throw new Error(errMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, deleteStage };
};


export default useDeleteStage;
