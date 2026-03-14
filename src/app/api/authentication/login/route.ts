import { NextResponse, NextRequest } from "next/server";
import { URL } from "@/lib/data";

const path = `${URL}/authentication/login`;

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username) {
      return NextResponse.json(
        { code: 400, message: "Username is required" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { code: 400, message: "Password is required" },
        { status: 400 }
      );
    }

    const backendRes = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await backendRes.json();

    return NextResponse.json(result, {
      status: backendRes.status,
    });

  } catch (error) {
    return NextResponse.json(
      { code: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
