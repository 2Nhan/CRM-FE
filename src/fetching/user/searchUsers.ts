"use client"

import { useState } from "react";
import { GetListUserResponseType } from "@/lib/data.user";
import { ApiResponsePagination } from "@/lib/data";
const useSearchUsers = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const searchUsers = async (query: string, pageNo: number): Promise<{users: GetListUserResponseType[], pagination: ApiResponsePagination}> => {
    setLoading(true);
    try {
      const resBackend = await fetch(`/api/admin/searchUser?query=${query}&pageNo=${pageNo}`, {
        method: "GET"
      })

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error(result.error.message || result.message || "Processed failed")
      }

      return {
        users: result.data,
        pagination: result.pagination
      };
    } catch (error) {
      throw new Error(String(error) || "Processed failed");
    } finally {
      setLoading(false);
    }
  }

  return {loading, searchUsers};
}

export default useSearchUsers;