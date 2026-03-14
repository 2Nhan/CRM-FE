import { NextResponse, NextRequest } from "next/server";
import { URL } from "@/lib/data";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

const path = `${URL}/leads`;

export async function DELETE(req: NextRequest) {
  try {
    const cookieStorage = cookies();
    const accessToken = cookieStorage.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { code: 400, message: "Unauthorized" },
        { status: 400 }
      )
    }

    const leadID = req.nextUrl.searchParams.get("leadID");

    if (!leadID) {
      return NextResponse.json(
        { code: 400, message: "Fill in lead ID" },
        { status: 400 }
      )
    }
    const resBackend = await fetch(`${path}/${leadID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

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