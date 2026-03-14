import { NextResponse, NextRequest } from "next/server";
import { URL } from "@/lib/data";

const path = `${URL}/authentication/registration`;

export async function POST(req: NextRequest){
  try{
    const {
      username, password, firstName, lastName, email, phoneNumber
    } = await req.json();

    if (!username){
      return NextResponse.json(
        {code: 400, message: "Username is required"},
        {status: 400}
      )
    }


    if (!password){
      return NextResponse.json(
        {code: 400, message: "Password is required"},
        {status: 400}
      )
    }


    if (!firstName){
      return NextResponse.json(
        {code: 400, message: "First name is required"},
        {status: 400}
      )
    }


    if (!lastName){
      return NextResponse.json(
        {code: 400, message: "Last name is required"},
        {status: 400}
      )
    }


    if (!email){
      return NextResponse.json(
        {code: 400, message: "email is required"},
        {status: 400}
      )
    }


    if (!phoneNumber){
      return NextResponse.json(
        {code: 400, message: "Phone number is required"},
        {status: 400}
      )
    }

    const backendRes = await fetch(path, {
      method: "POST",
      body: JSON.stringify({username, password, firstName, lastName, email, phoneNumber, }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    const result = await backendRes.json();

    return NextResponse.json(
      result,
      {status: backendRes.status}
    )

  }catch( err ){
    return NextResponse.json(
      {code: 500, message: "Interval server error"},
      {status: 500}
    )
  }
}