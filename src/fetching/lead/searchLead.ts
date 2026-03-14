"use client";

import { getToken } from "@/service/localStorageService";
import { URL } from "@/lib/data";
import { AxiosError } from "axios";
import { useState } from "react";
import { ApiResponseDataLeadType, leadStageType } from "@/lib/data.leads";

// API RESPONSE ERROR TYPE
interface ApiResponseError {
  code: number,
  message: string,
}
// API REPONSE DATA TYPE 
interface ApiReponseData {
  id: string,
  name: string,
  color: string,
  leads: ApiResponseDataLeadType[],
}
// API RESPONSE TYPE
interface ApiResponse {
  code: number,
  message: string,
  data?: ApiReponseData[],
  error?: any,
}

const useSearchLead = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const searchListLead = async (query: string) => {
    setLoading(true);

    try {
      const response = await fetch(`api/lead/searchLead?query=${query}`, {
        method: "GET",
      })
      
      const res = await response.json();
      const responseData: ApiResponse = res;
      const data: ApiReponseData[] = responseData.data ?? [];
      const leadStage = extractLeadStages(data);
      console.log(leadStage);
      console.log(data);
      return { leadStage, data };
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      const errData: ApiResponseError = axiosErr.response?.data?.error;
      const errMessage = errData.message;
      throw new Error(errMessage);
    } finally {
      setLoading(false);
    }
  }

  return { loading, searchListLead };
}

const extractLeadStages = (data: ApiReponseData[]): leadStageType[] => {
  return data.map(stage => ({
    id: stage.id,
    status: stage.name,
    color: stage.color || "#000",
  }));
}



export default useSearchLead;