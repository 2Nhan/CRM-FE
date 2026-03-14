import {NextResponse} from "next/server";

export async function POST(req: Request){
  const {token} = await req.json();

  const res = NextResponse.json({message: "Saved token"});

  res.cookies.set("accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  return res;
}