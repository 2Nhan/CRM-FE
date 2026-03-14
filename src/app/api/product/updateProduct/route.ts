import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { URL } from "@/lib/data";

const path = `${URL}/products`;

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { code: 400, message: "Unauthorized" },
        { status: 400 }
      );
    }

    const productID = req.nextUrl.searchParams.get("productID") || "";
    const formData = await req.formData();

    if (!productID) {
      return NextResponse.json(
        { code: 400, message: "Fill in product ID" },
        { status: 400 }
      );
    }

    const resBackend = await fetch(`${path}/${productID}`, {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const result = await resBackend.json();
    return NextResponse.json(result, { status: resBackend.status });
  } catch (err: any) {
    return NextResponse.json(
      { code: 500, message: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
