import { ApiResponseUploadLeadByCSV } from "@/lib/data.leads";
import { useState } from "react"

const useUploadCSV = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const uploadCSV = async (matching: Record<string, string>, file: File): Promise<ApiResponseUploadLeadByCSV> => {
    setLoading(true);
    const payload = dataConvert(matching, file);
    
    try{
      const resBackend = await fetch("/api/lead/uploadCSV", {
        method: "POST",
        credentials: "include",
        body: payload
      })

      const result = await resBackend.json();

      if (!resBackend.ok){
        return {
          code: result.code || 500,
          message: result.message || "Unidentified error",
          error: result.error || {
            code: 500,
            message: "Unidentified error"
          }
        }
      }
      return{
        code: result?.code || 500,
        message: result?.message || "Unidentified error",
        error: result.error || null,
        data: result.data || null,
      }
    }catch{
      return {
        code: 500,
        message: "Internal connection failed"
      }
    }
  }

  return {loading, uploadCSV};
}

const dataConvert = (matching: Record<string, string>, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  console.log(file);
  const wrappedMatching = {
    matching: matching
  }

  const jsonString = JSON.stringify(wrappedMatching, null, 2);
  const blob = new Blob([jsonString], {type: "application/json"});
  const fileJSON = new File([blob], "lead_matching.json", {type: "application/json"});

  formData.append("matching", fileJSON);

  console.log(wrappedMatching);
  
  return formData;
}

export default useUploadCSV;