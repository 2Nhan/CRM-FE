import { GetInfoResponse } from "@/lib/data.authentication";
import { useState } from "react";

const useGetInfo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  
  const getInfo = async (): Promise<GetInfoResponse>=> {
    setLoading(true);
    try {
      const resBackend = await fetch("api/profile/getInfo", {
        method: "GET"
      })

      if (!resBackend.ok){
        throw new Error(String(`Request failed: ${resBackend.status}`))
      }

      const result = await resBackend.json();

      return result.data;
    } catch (error: any) {
      throw new Error(String(error.message) || "Internal connection failed")
    } finally{
      setLoading(false);
    }
  }

  return {loading, getInfo};
};

export default useGetInfo;