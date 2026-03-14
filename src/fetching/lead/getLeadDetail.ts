"use client";

import { getToken } from "@/service/localStorageService";
import { URL } from "@/lib/data";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { ApiResponse } from "@/lib/data";
import { leadStageType, AssignedUser, LeadDetailType, ApiResponseDataLeadActivity } from "@/lib/data.leads";
const path = `${URL}/leads`;

export interface ApiResponseDataType {
  id: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  company: string;
  closingDate: string;
  rating: number;
  expectedRevenue: number;
  note: string;
  avatarUrl: string;
  stage: {
    id: string,
    name: string,
    color: string,
  };
  createdAt: string;
  updatedAt: string;
  activities: ApiResponseDataLeadActivity[];
  assignTo: AssignedUser;
}


const mappingResponseData = (responseLeadDetail: ApiResponseDataType): 
{
  leadDetail: LeadDetailType,
  leadActivity: ApiResponseDataLeadActivity[],
} => {
  const leadDetail: LeadDetailType = {
    leadID: responseLeadDetail.id,
    avatarURL: responseLeadDetail.avatarUrl,
    name: responseLeadDetail.fullName,
    expectedValue: responseLeadDetail.expectedRevenue,
    company: responseLeadDetail.company,
    nation: "",
    createdDate: responseLeadDetail.createdAt,
    phone: responseLeadDetail.phoneNumber,
    email: responseLeadDetail.email,
    rating: responseLeadDetail.rating,
    note: responseLeadDetail.note,
    source: "",
    status: responseLeadDetail.stage.name,
    assignTo: responseLeadDetail.assignTo.lastName + " " + responseLeadDetail.assignTo.firstName,
  }

  const leadActivity: ApiResponseDataLeadActivity[] = responseLeadDetail.activities;

  return {
    leadDetail: leadDetail,
    leadActivity: leadActivity,
  };
}

const useGetLeadDetail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();

  const [accessToken, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getToken() || null);
  }, []);

  const getLeadDetailInformation = async (leadID: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/lead/getLeadDetail?leadID=${leadID}`, {
        method: "GET",
        credentials: "include",
      })

      const resData = await response.json();
      const {leadDetail, leadActivity} = mappingResponseData(resData.data);

      return {leadDetail, leadActivity};
    } catch (err) {
      const errAny = err as Error;
      const errMessage = errAny.message || "Unknown error";
      setError(errMessage);
      throw new Error(errMessage);
    }
    finally {
      setLoading(false);
    }
  }

  return { loading, data, error, getLeadDetailInformation }
}

export default useGetLeadDetail;