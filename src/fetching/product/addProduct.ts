"use client";

import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { ProductDetailType, ProductDetailRequestType } from "@/lib/data.product";
import { URL } from "@/lib/data";
import { getToken } from "@/service/localStorageService";

const path = `${URL}/products`;
// DATA TYPE 
export interface ResponseDataType {
  productId: string,
  sku: string,
  productName: string,
  description: string,
  productSubtitle: string,
  productBrand: string,
  productCategory: string,
  quantity: number,
  status: string,
  purchaseUnitPrice: number,
  discount: number,
  discountType: string,
  imageUrl: string,
}
// ERROR TYPE 
interface ResponseErrorType {
  code: number,
  errorField: string,
  message: string,
}
// RESPONSE DATA TYPE 
interface ApiResponse {
  code: number,
  message: string,
  data?: ResponseDataType,
  errors?: ResponseErrorType[],
}
// FUNCTION TO CONVERT USER INPUT INTO DATA REQUEST TYPE
interface DataConvertProps {
  newDetailProduct: ProductDetailType;
  imageFile1: File | null;
  imageFile2: File | null;
  imageFile3: File | null;
}

const dataConvert = ({ newDetailProduct, imageFile1 }: DataConvertProps): FormData => {
  const form = new FormData();

  form.append("sku", newDetailProduct.SKU || `SP-${Date.now()}`);
  form.append("name", newDetailProduct.PRODUCT_NAME);
  form.append("description", newDetailProduct.DESCRIPTION);
  form.append("subtitle", newDetailProduct.PRODUCT_SUBTITLE);
  form.append("brand", newDetailProduct.PRODUCT_BRAND);
  form.append("category", newDetailProduct.PRODUCT_CATEGORY);
  form.append("quantity", String(newDetailProduct.PRODUCTS));
  form.append("status", newDetailProduct.STATUS);
  form.append("price", String(newDetailProduct.PURCHASE_UNIT_PRICE));
  form.append("discount", String(newDetailProduct.DISCOUNT));
  form.append("discountType", newDetailProduct.DISCOUNT_TYPE);

  if (imageFile1) form.append("image", imageFile1);

  return form;
};

export const useAddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ResponseDataType | undefined>();
  const [error, setError] = useState<string | null>(null);

  const [accessToken, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getToken() || null);
  }, []);

  const requestAddingProduct = async ({ newDetailProduct, imageFile1, imageFile2, imageFile3 }: DataConvertProps) => {
    const formData = dataConvert({ newDetailProduct, imageFile1, imageFile2, imageFile3 });
    
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/product/addProduct", {
        method: "POST",
        body: formData,
        credentials: "include", 
      });

      const resData = await res.json();


      if (!res.ok) {
        const errMessage =
          resData?.errors?.[0]?.message ||
          resData?.message ||
          "Unknown error";
        throw new Error(errMessage);
      }

      if (resData.code === 200) {
        setData(resData.data);
        return resData;
      }

    } catch (err) {
      const errAny = err as Error;
      const errMessage = errAny.message || "Unknown error";
      setError(errMessage);
      throw new Error(errMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, requestAddingProduct };
};

export default useAddProduct;
