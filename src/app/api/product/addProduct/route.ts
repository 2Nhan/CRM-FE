import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";
import { ApiResponse, URL } from "@/lib/data";

const path = `${URL}/products`;

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken)
      return NextResponse.json({ code: 401, message: "Unauthorized" }, { status: 401 });

    const formdata = await req.formData();

    // const backendForm = new FormData();
    // formdata.forEach((value, key) => backendForm.append(key, value));

    const resBackend = await fetch(path, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formdata
    });

    const data = await resBackend.json();
    return NextResponse.json(data, { status: resBackend.status });

  } catch (err) {
    const errAxios = err as AxiosError<any>;
    const errMes =
      errAxios.response?.data?.error?.[0]?.message ||
      errAxios.response?.data?.message ||
      errAxios.message ||
      "Unknown error";

    return NextResponse.json(
      { code: 500, message: errMes },
      { status: 500 }
    );
  }
}
