"use client";

import { useState } from "react";

const useUpdateAssigner = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const updateAssigner = async (customerID: string, userID: string): Promise<boolean> => {
    setLoading(true);

    try {
      const resBackend = await fetch( `/api/customer/updateAssigner?customerID=${customerID}&userID=${userID}`, {
        method: "PATCH"
      })

      const result = await resBackend.json();

      if ( !resBackend.ok ){
        throw new Error(result.error.message || result.message || "Proccessed failed");
      }

      return result.code === 200;
    } catch (error) {
      throw new Error(String(error) || "Proccessed failed");
    } finally {
      setLoading(false);
    }
  }

  return {loading, updateAssigner};
}

export default useUpdateAssigner;