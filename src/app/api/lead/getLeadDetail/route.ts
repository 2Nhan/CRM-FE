import { NextResponse, NextRequest } from "next/server";
import { URL } from "@/lib/data";
import { cookies } from "next/headers";

const path = `${URL}/leads`;

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { code: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const leadID = req.nextUrl.searchParams.get("leadID");

    if (!leadID) {
      return NextResponse.json(
        { code: 400, message: "Lead ID is required" },
        { status: 400 }
      );
    }

    const resBackend = await fetch(`${path}/${leadID}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await resBackend.json();

    if (!resBackend.ok) {
      return NextResponse.json(
        {
          code: resBackend.status,
          message: data.message || "Failed to fetch lead detail",
        },
        { status: resBackend.status }
      );
    }

    return NextResponse.json(
      data,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
