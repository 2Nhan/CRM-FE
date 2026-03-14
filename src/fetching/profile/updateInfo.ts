"use client"

import { useState } from "react";

const useUpdateInfo = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const updateInfo = async (payload: any): Promise<boolean> => {
    setLoading(true);

    try {
      const resBackend = await fetch("/api/profile/updateInfo", {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        }
      })

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error(result.error.message || result.message || "Processed failed");
      }

      return result.code === 200;
    } catch {
      throw new Error("Internal internal failed");
    } finally {
      setLoading(false);
    }
  }

  return { loading, updateInfo};
}

export default useUpdateInfo;