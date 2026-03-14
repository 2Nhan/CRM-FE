import { NextRequest, NextResponse } from "next/server";
import { URL } from "@/lib/data";
import { cookies } from "next/headers";
import { AxiosError } from "axios"; 

const path = `${URL}/leads`;

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { code: 400, message: "Unauthorized" },
        { status: 400 }
      )
    }

    const resBackend = await fetch(path, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const result = await resBackend.json();

    return NextResponse.json(
      result,
      { status: resBackend.status }
    )
  } catch (err) {
    const axiosErr = err as AxiosError<any>;
    const errorReturn = axiosErr.response?.data || {
      code: 500,
      message: "Unknown server error",
    };

    return NextResponse.json(errorReturn, { status: 500 });
  }
}