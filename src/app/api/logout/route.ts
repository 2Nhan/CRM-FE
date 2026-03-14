import {NextResponse} from "next/server";

export async function POST(){
  const res = NextResponse.json({message: "Log out"});
  res.cookies.delete("accessToken");
  return res;
}