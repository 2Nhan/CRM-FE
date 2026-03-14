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
        { code: 400, message: "Unauthorized" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const leadID = formData.get("leadID");

    if (!leadID){
      return NextResponse.json(
        { code: 400, message: "Fill in lead ID" },
        { status: 400 }
      );
    }
    
    const activityID = formData.get("activityID");

    if (!activityID){
      return NextResponse.json(
        { code: 400, message: "Fill in activity ID" },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${path}/${leadID}/activities/${activityID}/complete`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })
    
    const result = await backendRes.json();

    return NextResponse.json(result, {status: backendRes.status});
  } catch (err: any) {
    const message = err?.message || "Unknown error";
    return NextResponse.json({ code: 500, message }, { status: 500 });
  }
}
