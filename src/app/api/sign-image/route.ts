import { cloudinary } from "@/lib/cloudinary";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = (await req.json()) as { paramsToSign: Record<string, string> }

    const { paramsToSign } = body

    const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string)

    return Response.json({ signature })
}