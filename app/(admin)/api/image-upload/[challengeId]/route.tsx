import { upload } from "@/lib/supabase-client";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { challengeId: string } },
) {
  const challengeId = parseInt(params.challengeId);
  const formData = await req.formData();

  const file = formData.get("file") as File;

  try {
    if (!file) {
      throw "No file was provided.";
    }

    if (!file.type.startsWith("image")) {
      throw "Invalid file type.";
    }

    const result = await upload(file, challengeId);

    if (result.error) {
      throw result.error;
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Couldn't upload image", message: error },
      {
        status: 500,
      },
    );
  }
}
