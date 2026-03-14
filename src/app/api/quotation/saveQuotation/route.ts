import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { URL } from "@/lib/data";

const path = `${URL}/quotations`;

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { code: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await req.json();

    const backendRes = await fetch(path, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
