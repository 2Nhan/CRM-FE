import { NextResponse, NextRequest } from "next/server";
import { URL } from "@/lib/data"
import { cookies } from "next/headers";

const path = `${URL}/customers`;

export async function GET(req: NextRequest){
  try{
    const cookieStorage = cookies();
    const accessToken = cookieStorage.get("accessToken")?.value;

    if (!accessToken){
      return NextResponse.json(
        {code: 401, message: "Unauthorized"},
        {status: 401}
      )
    }

    const query = req.nextUrl.searchParams.get("query");
    const pageNo = req.nextUrl.searchParams.get("pageNo");

    const resBackend = await fetch(`${path}/search?query=${query}&pageNo=${pageNo}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const result = await resBackend.json();

    return NextResponse.json(
      result,
      {status: resBackend.status}
    )
  }catch{
    return NextResponse.json(
      {code: 500, message: "Internal connection failed"},
      {status: 500}
    )
  }
}