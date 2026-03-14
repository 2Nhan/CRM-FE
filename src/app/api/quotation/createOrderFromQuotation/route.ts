import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { URL } from "@/lib/data";

const path = `${URL}/quotations`;

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { code: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const quotationID = req.nextUrl.searchParams.get("quotationID");

    if (!quotationID) {
      return NextResponse.json(
        { code: 400, message: "Fill in quotation ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const backendRes = await fetch(`${path}/${quotationID}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          code: backendRes.status,
          message: result?.message || "Backend error",
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { code: 500, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
