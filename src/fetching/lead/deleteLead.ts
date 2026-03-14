"user client";

import { useState } from "react";

const useDeleteLead = () => {
  const [loading, setLoading] = useState<boolean>(false);
  
  const deleteLead = async (leadID: string) => {
    setLoading(true)
    try {
      const res = await fetch(`api/lead/deleteLead?leadID=${leadID}`, {
        method: "DELETE",
        credentials: "include"
      })

      const result = await res.json();

      if (result && result.code === 200){
        return true;
      }{
        return false;
      }
    } catch (err) {
      const errAny = err as Error;
      const errMessage = errAny.message || "Unknown error";
      throw new Error(errMessage);
    }finally{
      setLoading(false);
    }
  }

  return {loading, deleteLead};
}

export default useDeleteLead