"use client";
import { useState } from "react";

function useSearchProduct(){
  const [loading, setLoading] = useState<boolean>(false);
  
  const searchProduct = async (query: string, pageNo?: number) => {
    setLoading(true);
    let more: string = "";
    
    if (pageNo){
      more = more + `&pageNo=${pageNo}`;
    }

    try{
      const response = await fetch(`api/product/searchProduct?query=${query}${more}`, {
        method: "GET",
        credentials: "include",
      })

      const resData = await response.json();

      return resData;
    }catch( err ){
      const errAny = err as Error;
      const errMessage = errAny.message || "Unknown error";
      throw new Error(errMessage);
    }finally {
      setLoading(false);
    }
  }

  return {loading, searchProduct}
}

export default useSearchProduct;