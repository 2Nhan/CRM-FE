import { NextRequest, NextResponse } from "next/server";
import {URL} from "@/lib/data";
import { cookies } from "next/headers";

const path = `${URL}/leads`;
export async function POST(req: NextRequest){
  try {
    const cookieStorage = cookies();
    const accessToken = cookieStorage.get("accessToken")?.value;

    if (!accessToken){
      return NextResponse.json(
        {code: 401, message: "Unauthorized"},
        {status: 401}
      )
    }

    const formData = await req.formData();

    const backendRes = await fetch(`${path}/csv`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })

    const result = await backendRes.json();
    return NextResponse.json(
      result,
      {status: backendRes.status}
    )
  } catch (error) {
    return NextResponse.json(
      {code: 500, message: "Internal connection failed"},
      {status: 500}
    )
  }
}