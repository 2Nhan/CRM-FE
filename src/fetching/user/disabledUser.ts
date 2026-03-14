"use client";

import { useState } from "react";

const useDisableUser = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const disableUser = async (userID: string): Promise<boolean> => {
    setLoading(true);
    try{
      const resBackend = await fetch(`/api/user/disableUser?userID=${userID}`, {
        method: "PATCH"
      });

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error(result.error?.message || result.message || "Processed failed");
      }

      return result.code === 200;
    } catch(error){
      throw new Error(String(error) || "Proccessed failed");
    } finally {
      setLoading(false);
    }
  }

  return {loading, disableUser}
}

export default useDisableUser;