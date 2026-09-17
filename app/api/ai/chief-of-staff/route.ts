import { NextResponse } from "next/server";
import { askChiefOfStaff } from "@/lib/ai/gemini";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, history, contextData } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ ok: false, error: "Prompt is required" }, { status: 400 });
    }

    const reply = await askChiefOfStaff(prompt, history, contextData);
    return NextResponse.json({ ok: true, reply });
  } catch (error: any) {
    console.error("Chief of Staff API Error:", error);
    return NextResponse.json({ ok: false, error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
