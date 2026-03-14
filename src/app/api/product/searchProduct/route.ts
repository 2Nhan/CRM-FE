import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { URL } from "@/lib/data";
import { AxiosError } from "axios";

const path = `${URL}/products`

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

    const query = req.nextUrl.searchParams.get("query");

    const pageNo = req.nextUrl.searchParams.get("pageNo");

    let more: string = "";
    if (pageNo){
      more = more + `&pageNo=${pageNo}`;
    }

    const resBackend = await fetch(`${path}/search?query=${query}${more}`, {
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