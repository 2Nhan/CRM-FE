import { NextRequest, NextResponse } from "next/server";
import { URL } from "@/lib/data";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

const path = `${URL}/leads`;

export async function PATCH(req: NextRequest) {
  try {
    const cookieStorage = cookies();
    const accessToken = cookieStorage.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { code: 400, message: "Unauthorized" },
        { status: 400 }
      )
    }

    const formData = await req.formData();
    const leadID = req.nextUrl.searchParams.get("leadID");

    const resBackend = await fetch(`${path}/${leadID}`, {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const res = await resBackend.json();

    if (!resBackend.ok) {
      return NextResponse.json(
        { code: res.code, message: res.message },
        { status: resBackend.status }
      )
    }

    return NextResponse.json(
      res,
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