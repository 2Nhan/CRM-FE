import { loginRequestType, loginResponseType } from "@/lib/data.authentication";
import { useState } from "react";

/**
 * API Hook - handle  fetching progress to user login
 * @returns loading status - login function
 */
const useLogin = () => {
  const [loading, setLoading] = useState(false);

  /** 
   * login - send data to api route to make communication with backend to login authentication 
   * @param data username - password 
   */
  const login = async (data: loginRequestType) => {
    setLoading(true);

    try {
      const res = await fetch("/api/authentication/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      let result: any = null;
      try {
        result = await res.json();
      } catch {
        result = {};
      }

      if (!res.ok) {
        throw new Error(result.error.message || result.message || "Processed failed");
      }
      
      

      return result;
    } catch {
      return {
        code: 500,
        message: "Network or server error",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
  };
};

export default useLogin;
