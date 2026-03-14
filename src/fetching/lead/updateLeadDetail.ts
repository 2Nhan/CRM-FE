"use client";

import { LeadDetailType } from "@/lib/data.leads";
import { useState } from "react";

const useUpdateLeadDetail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLeadDetail = async (lead: LeadDetailType, avatarFile: File | undefined) => {
    setLoading(true);
    setError(null);

    try {
      const formData = dataConvert(lead, avatarFile);

      const response = await fetch(
        `/api/lead/updateLeadDetail?leadID=${lead.leadID}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Update lead failed");
      }

      const updatedLead = responseConvert(resData.data);

      return {resData, updatedLead};
    } catch (err: any) {
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, updateLeadDetail };
};

const dataConvert = (lead: LeadDetailType, avatarFile: File | undefined) => {
  const formData = new FormData();

  if (lead.email !== undefined && lead.email !== "")
    formData.append("email", lead.email);

  if (lead.phone !== undefined && lead.phone !== "")
    formData.append("phoneNumber", lead.phone);

  if (lead.company !== undefined && lead.company !== "")
    formData.append("company", lead.company);

  if (lead.source !== undefined && lead.source !== "")
    formData.append("source", lead.source);

  if (leafIsValidNumber(lead.rating))
    formData.append("rating", String(lead.rating));

  if (lead.expectedValue !== undefined && lead.expectedValue !== null)
    formData.append("expectedRevenue", String(lead.expectedValue));

  if (lead.note !== undefined && lead.note !== "")
    formData.append("note", lead.note);

  if (avatarFile){
    formData.append("image", avatarFile)
  }

  return formData;
};

const leafIsValidNumber = (value?: number) =>
  value !== undefined && value !== null && value > 0;

const responseConvert = (updated: any): LeadDetailType => {
  return {
    leadID: updated.id,
    avatarURL: updated.avatarUrl || "",
    name: updated.fullName || "",
    expectedValue: updated.expectedRevenue ?? 0,
    company: updated.company || "",
    nation: "",
    createdDate: updated.createdAt || "",
    phone: updated.phoneNumber || "",
    email: updated.email || "",
    rating: updated.rating ?? 1,
    note: updated.note || "",
    source: updated.source || "",
    status: updated.stage?.name || "",
    assignTo: updated.assignTo
      ? `${updated.assignTo.lastName} ${updated.assignTo.firstName}`
      : "not assign",
  };
};


export default useUpdateLeadDetail;
