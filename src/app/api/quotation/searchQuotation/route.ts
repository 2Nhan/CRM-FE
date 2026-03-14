import { NextRequest, NextResponse } from "next/server";
import { URL } from "@/lib/data";
import { cookies } from "next/headers";

const path = `${URL}/quotations`;

export async function GET(req: NextRequest){
  try{
    const cookieStorage = cookies();
    const accessToken = cookieStorage.get("accessToken")?.value;

    if (!accessToken){
      return NextResponse.json(
        {code: 401, message: "Unauthenticated"},
        {status: 401}
      );
    }

    const query = req.nextUrl.searchParams.get("query");
    const pageNo = req.nextUrl.searchParams.get("pageNo") ?? 1;

    const resData = await fetch(`${path}/search?query=${query}&pageNo=${pageNo}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const result = await resData.json();

    return NextResponse.json(
      result,
      {status: resData.status}
    )
  }catch{
    return NextResponse.json(
      {code: 500, message: "Internal connection failed"},
      {status: 500}
    )
  }
}