"use client";

import { URL } from "@/lib/data";
import { ProductDetailType } from "@/lib/data.product";
import { getToken } from "@/service/localStorageService";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";

// API DATA RESPONSE 
interface ApiDataResponseType {
  productId: string;
  sku: string;
  productName: string;
  description: string;
  productSubtitle: string;
  productBrand: string;
  productCategory: string;
  quantity: number;
  status: string;
  purchaseUnitPrice: number;
  discount: number;
  discountType: string;
  imageUrl: string;
}
// API ERROR TYPE
interface ApiErrorResponseType {
  code: number;
  message: string;
}
// API RESPONSE
interface ApiResponse {
  code: number,
  message: string,
  error?: ApiErrorResponseType,
  data?: ApiDataResponseType,
}
const useUpdateProduct = () => {
  // STATE
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ApiDataResponseType>();
  const [error, setError] = useState<ApiErrorResponseType | null>();

  const [accessToken, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getToken() || null);
  }, []);

  // FETCHING FUNCTIOn
  const updateProduct = async (updateProductDetail: any, productID: string, image?: File) => {
    setError(null);
    setLoading(true);

    try {
      const formData = dataConvert(updateProductDetail, image);

      const response = await fetch(`/api/product/updateProduct?productID=${productID}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Update failed");
      }
      
      return resData;
    } catch (err: any) {
      setError({ code: 500, message: err.message });
      throw err;
    } finally {
      setLoading(false);
    }
  };


  return { loading, data, error, updateProduct };
}

const dataConvert = (updateProductDetail: any, imageFile1?: File): FormData => {
  const form = new FormData();

  if (updateProductDetail.sku) form.append("sku", updateProductDetail.sku || `SP-${Date.now()}`);
  if (updateProductDetail.name) form.append("name", updateProductDetail.name);
  if (updateProductDetail.description)form.append("description", updateProductDetail.description);
  if (updateProductDetail.subtitle) form.append("subtitle", updateProductDetail.subtitle);
  if (updateProductDetail.brand) form.append("brand", updateProductDetail.brand);
  if (updateProductDetail.category) form.append("category", updateProductDetail.category);
  if (updateProductDetail.quantity) form.append("quantity", updateProductDetail.quantity);
  if (updateProductDetail.status) form.append("status", updateProductDetail.status);
  if (updateProductDetail.price) form.append("price", updateProductDetail.price);
  if (updateProductDetail.discount) form.append("discount", updateProductDetail.discount);
  if (updateProductDetail.discountType) form.append("discountType", updateProductDetail.discountType);

  if (imageFile1) form.append("image", imageFile1);

  return form;
};

export default useUpdateProduct;