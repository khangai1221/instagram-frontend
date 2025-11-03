/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export const POST = async (req: NextRequest) => {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const blob = await put(`${nanoid()}/${file.name}`, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (err: any) {
    console.error("🔥 Upload error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
