"use client";

import { useState } from "react";

const useDeleteCustomer = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const deleteCustomer = async (customerID: string): Promise<boolean> => {
    setLoading(true);
    try{
      const resBackend = await fetch(`/api/customer/deleteCustomer?customerID=${customerID}`, {
        method: "DELETE"
      })

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error(result.error.message || "Failed to delete customer");
      }

      return result.code === 200;
    }catch( error ){
      throw new Error(String(error) || "Processed failed");
    } finally {
      setLoading(false);
    }
  }

  return {loading, deleteCustomer};
}

export default useDeleteCustomer;