import { NextRequest, NextResponse } from "next/server";
import { URL } from "@/lib/data";
import { cookies } from "next/headers";

const path = `${URL}/leads`;

export async function POST(req: NextRequest) {
  try {
    const cookieStorage = cookies();
    const accessToken = cookieStorage.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { code: 400, message: "Unauthorized" },
        { status: 400 }
      );
    }

    const leadID = req.nextUrl.searchParams.get("leadID");

    if (!leadID){
      return NextResponse.json(
        { code: 400, message: "Fill in lead ID" },
        { status: 400 }
      );
    }
    const formData = await req.formData();

    const content = formData.get("content");
    const type = formData.get("type");
    const validUntil = formData.get("validUntil");

    const payloadObj: Record<string, any> = {
      content,
      type,
    };

    if (validUntil) {
      payloadObj.validUntil = validUntil;
    }

    const backendRes = await fetch(`${path}/${leadID}/activities`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadObj),
    });

    const result = await backendRes.json();
    
    return NextResponse.json(result, {status: backendRes.status});
  } catch (err: any) {
    const message = err?.message || "Unknown error";
    return NextResponse.json({ code: 500, message }, { status: 500 });
  }
}