import {NextResponse, NextRequest} from 'next/server';
import {URL} from '@/lib/data';
import { cookies } from 'next/headers';

const path = `${URL}/orders/summary`;

export async function GET(req: NextRequest){
  try {
    const cookieStorage = cookies();
    const accesstoken = cookieStorage.get("accessToken")?.value;

    if (!accesstoken){
      return NextResponse.json(
        {code: 401, message: "Unauthorized"},
        {status: 401}
      )
    };

    const resBackend = await fetch(`${path}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accesstoken}`
      }
    })

    const result = await resBackend.json();

    return NextResponse.json(
      result,
      {status: resBackend.status}
    )
  } catch (error) {
    return NextResponse.json(
      {code: 500, message: "Internal connection failed"},
      {status: 500}
    )
  }
}