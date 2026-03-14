"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "@/lib/data";
import { getToken } from "@/service/localStorageService";

const path = `${URL}/products/csv`;
// CONVERT TO REQUEST BODY
const requestBody = (csvFile: File, matching: Object) => {
  // APPEND FILE TO FORM DATA
  const body = new FormData();
  body.append("file", csvFile);

  const wrappedMatching = {
    matching: matching
  };

  const jsonString = JSON.stringify(wrappedMatching, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const fileJSON = new File([blob], "matching.json", { type: "application/json" });

  body.append("matching", fileJSON);
  return body;
}
const useBrowseCSVFile = () => {
  //STATE
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();

  const [accessToken, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getToken() || null);
  }, []);

  const sendCSV = async (csvFile: File, matching: Object) => {
    setLoading(true);
    setError(null);

    const formData = requestBody(csvFile, matching);
    try {
      const response = await fetch("api/product/addProductByCSV", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      const resBackend = await response.json();

      return resBackend;
    } catch (err) {
      const errAny = err as Error;
      const errMessage = errAny.message || "Unknown error";
      setError(errMessage);
      throw new Error(errMessage);
    } finally{
      setLoading(false);
    }
  }

  return { loading, data, error, sendCSV };
}
export default useBrowseCSVFile;