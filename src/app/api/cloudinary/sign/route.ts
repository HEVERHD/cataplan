import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

function signParams(paramsToSign: Record<string, string | number>, apiSecret: string): string {
  const str = Object.keys(paramsToSign)
    .sort()
    .map((k) => `${k}=${paramsToSign[k]}`)
    .join("&");
  return createHash("sha1").update(str + apiSecret).digest("hex");
}

export async function POST(req: NextRequest) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    return NextResponse.json({ error: "Cloudinary no configurado" }, { status: 500 });
  }

  const { paramsToSign } = await req.json();
  const signature = signParams(paramsToSign, apiSecret);

  return NextResponse.json({ signature });
}
