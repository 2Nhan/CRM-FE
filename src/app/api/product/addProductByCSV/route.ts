import { NextResponse, NextRequest } from "next/server";
import { URL } from "@/lib/data";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

const path = `${URL}/products/csv`;

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken){
      return NextResponse.json(
        {code: 400, message: "Unauthorized"},
        {status: 400}
      );
    }

    const formData = await req.formData()

    const resBackend = await fetch(path, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const res = await resBackend.json();
    const result = res;
    
    return NextResponse.json(
      result,
      {status: resBackend.status}
    );
  } catch (err) {
    const errAxios = err as AxiosError<any>;
    const errMes =
      errAxios.response?.data?.message ||
      errAxios.message ||
      "Unknown error";

    return NextResponse.json(
      { code: 500, message: errMes },
      { status: 500 }
    );
  }
}