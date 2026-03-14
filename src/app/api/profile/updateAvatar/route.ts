import { NextResponse, NextRequest } from "next/server";
import { URL } from "@/lib/data";
import { cookies } from "next/headers";

const path = `${URL}/users/avatar`;

export async function PATCH(req: NextRequest) {
  try {
    const cookieStorage = cookies();
    const accessToken = cookieStorage.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { code: 401, message: "Unauthenticated" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const resBackend = await fetch(path, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const result = await resBackend.json();

    return NextResponse.json(result, {
      status: resBackend.status,
    });
  } catch {
    return NextResponse.json(
      { code: 500, message: "Internal connection failed" },
      { status: 500 }
    );
  }
}
