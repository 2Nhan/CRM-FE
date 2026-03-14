import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { URL } from "@/lib/data";

const path = `${URL}/stages`;

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ code: 401, message: "Unauthorized" }, { status: 401 });
    }

    const stageID = req.nextUrl.searchParams.get("stageID");

    if (!stageID){
      return NextResponse.json(
        {code: 400, message: "Fill in stage ID"},
        {status: 400}
      );
    }

    const backendRes = await fetch(`${path}/${stageID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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