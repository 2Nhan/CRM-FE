"use client";

import { useState } from "react";

const useUpdateCustomerDetail = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const updateCustomerDetail = async (
    newCustomer: any,
    customerAvatar: File | undefined,
    customerID: string
  ) => {
    setLoading(true);

    try {
      const payload = convertDataToRequestPayload(newCustomer, customerAvatar);

      const resBackend = await fetch(
        `/api/customer/updateCustomerDetail?customerID=${customerID}`,
        {
          method: "PATCH",
          body: payload, 
        }
      );

      const result = await resBackend.json();

      if (!resBackend.ok) {
        throw new Error(result?.error?.message || "Update failed");
      }

      return result;
    } finally {
      setLoading(false);
    }
  };


  return { loading, updateCustomerDetail };
}

const convertDataToRequestPayload = (newCustomer: any, customerAvatar: File | undefined) => {
  const formData = new FormData();

  if (newCustomer.company !== "Unknown") {
    formData.append("company", newCustomer.company);
  }

  if (newCustomer.dateOfBirth) {
    formData.append("dateOfBirth", newCustomer.dateOfBirth);
  }

  if (newCustomer.email) {
    formData.append("email", newCustomer.email);
  }

  if (newCustomer.notes) {
    formData.append("note", newCustomer.notes);
  }

  if (newCustomer.rating) {
    formData.append("rating", String(newCustomer.rating));
  }

  if (newCustomer.phoneNumber) {
    formData.append("phoneNumber", String(newCustomer.phoneNumber))
  }

  if (newCustomer.fullName) {
    formData.append("fullName", newCustomer.fullName)
  }

  if (customerAvatar) {
    formData.append("image", customerAvatar);
  }

  return formData;

}
export default useUpdateCustomerDetail;