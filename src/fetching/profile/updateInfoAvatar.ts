"use client";
import { useState } from "react";

const useUpdateInfoAvatar = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const updateInfoAvatar = async (avatarFile: File): Promise<boolean> => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", avatarFile);

      const resBackend = await fetch("/api/profile/updateAvatar", {
        method: "PATCH",
        body: formData,
      })

      const result = await resBackend.json();

      if (!resBackend.ok){
        throw new Error(result.error.message || result.message || "Process failed");
      }

      return result.code === 200
    } catch {
      throw new Error("Internal connection failed");
    } finally {
      setLoading(false);
    }
  }

  return {loading, updateInfoAvatar};
}

export default useUpdateInfoAvatar;