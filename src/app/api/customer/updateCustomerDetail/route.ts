import { NextRequest, NextResponse } from "next/server";
import { URL } from "@/lib/data";
import { cookies } from "next/headers";

const path = `${URL}/leads`;

export async function PATCH(req: NextRequest) {
  try {
    const cookieStorage = cookies();
    const accessToken = cookieStorage.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { code: 401, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const payload = await req.formData();
    const customerID = req.nextUrl.searchParams.get("customerID");

    if (!customerID) {
      return NextResponse.json(
        { code: 400, message: "customerID is required" },
        { status: 400 }
      );
    }


    const resBackend = await fetch(`${path}/${customerID}`, {
      method: "PATCH",
      body: payload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })

    const result = await resBackend.json();

    return NextResponse.json(
      result,
      { status: resBackend.status }
    )
  } catch {
    return NextResponse.json(
      { code: 500, message: "Internal connection failed" },
      { status: 500 }
    )
  }
}