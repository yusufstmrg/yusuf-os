import { NextResponse } from "next/server";
import { triageQuickCapture } from "@/lib/ai/gemini";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { note } = body;

    if (!note || typeof note !== "string") {
      return NextResponse.json({ ok: false, error: "Note text is required" }, { status: 400 });
    }

    const triageResult = await triageQuickCapture(note);
    return NextResponse.json({ ok: true, result: triageResult });
  } catch (error: any) {
    console.error("AI Triage API Error:", error);
    return NextResponse.json({ ok: false, error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
