import { signUpRequestType, signUpResponseType } from "@/lib/data.authentication";
import { useState } from "react";

/**
 * API hook - user signup
 */
const useSignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const signUp = async (
    data: signUpRequestType
  ): Promise<signUpResponseType> => {
    setLoading(true);

    try {
      const res = await fetch("/api/authentication/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let result: any;
      try {
        result = await res.json();
      } catch {
        result = {};
      }

      if (!res.ok) {
        return {
          code: result?.code ?? res.status ?? 9999,
          message: result?.message ?? "Unidentified error",
          error: result?.error?.[0]
            ? {
                code: result.error[0].code ?? 9999,
                errorField:
                  result.error[0].errorField ?? "Unidentified field",
                message:
                  result.error[0].message ?? "Unidentified error",
              }
            : undefined,
        };
      }

      return {
        code: result.code,
        message: result.message,
        data: {
          id: result.data?.id,
          username: result.data?.username,
          firstName: result.data?.firstName,
          lastName: result.data?.lastName,
          email: result.data?.email,
          phoneNumber: result.data?.phoneNumber,
          address: result.data?.address,
          avatarUrl: result.data?.avatarUrl,
          createdAt: result.data?.createdAt,
          updatedAt: result.data?.updatedAt,
        },
      };
    } catch {
      return {
        code: 500,
        message: "Network or server error",
      };
    } finally {
      setLoading(false);
    }
  };

  return { loading, signUp };
};

export default useSignUp;
