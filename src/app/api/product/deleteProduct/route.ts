import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { AxiosError } from "axios";
import { URL } from "@/lib/data";

const path = `${URL}/products`;

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { code: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const productID = req.nextUrl.searchParams.get("productID");

    if (!productID) {
      return NextResponse.json(
        { code: 400, message: "Fill in product ID" },
        { status: 400 }
      );
    }

    const resBackend = await fetch(`${path}/${productID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const result = await resBackend.json();

    return NextResponse.json(result, { status: resBackend.status });

  } catch (err) {
    const errAxios = err as AxiosError<any>;
    const errMes =
      errAxios.response?.data?.message ||
      errAxios.message ||
      "Unknown error";

    return NextResponse.json(
      { code: 500, message: errMes },
      { status: 500 }
    );
  }
}
