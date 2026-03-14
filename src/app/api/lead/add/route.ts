import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { URL, ApiResponse, ApiResponseError } from "@/lib/data";

const path = `${URL}/stages`;

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ code: 401, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const stageID = String(formData.get("stageID") || "");

    if (!stageID) {
      return NextResponse.json({ code: 400, message: "Missing stageID" }, { status: 400 });
    }

    const backendRes = await fetch(`${path}/${stageID}/leads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData as any,
    });

    const result = await backendRes.json();

    return NextResponse.json(result, { status: backendRes.status });
  } catch (err: any) {
    const message = err?.message || "Unknown error";
    return NextResponse.json({ code: 500, message }, { status: 500 });
  }
}