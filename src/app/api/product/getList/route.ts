import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { URL } from "@/lib/data";

const path = `${URL}/products`;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const pageNo = Number(searchParams.get("pageNo")) || 1;
  const status = searchParams.get("status") || undefined;
  const minPrice = Number(searchParams.get("minPrice")) || undefined;
  const maxPrice = Number(searchParams.get("maxPrice")) || undefined;

  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { code: 401, message: "Unauthenticated" },
      { status: 401 }
    );
  }

  try {
    const response = await axios.get(path, {
      params: {
        pageNo,
        status,
        minPrice,
        maxPrice,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (err) {
    const axiosErr = err as AxiosError<any>;

    const errorReturn =
      axiosErr.response?.data ?? {
        code: 500,
        message: "Unknown server error",
      };

    return NextResponse.json(errorReturn, {
      status: axiosErr.response?.status || 500,
    });
  }
}
