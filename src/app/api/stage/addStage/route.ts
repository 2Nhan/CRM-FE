import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { URL } from "@/lib/data";

const path = `${URL}/stages`;

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ code: 401, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const color = formData.get("color");

    const payload: Record<string, any> = {
      name,
      color,
    }

    const backendRes = await fetch(path, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    })

    const result = await backendRes.json();

    return NextResponse.json(
      result,
      { status: backendRes.status }
    )


  } catch (err: any) {
    const message = err?.message || "Unknown error";
    return NextResponse.json({ code: 500, message }, { status: 500 });
  }
}