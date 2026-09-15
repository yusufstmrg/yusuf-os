import { generateText } from "ai";
import { NextResponse } from "next/server";
import { requirePrivateDb } from "@/lib/os/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const { user, db } = await requirePrivateDb();
    const [tasks, captures, goals] = await Promise.all([
      db`SELECT title, priority, due_date, status FROM public.tasks WHERE owner_id=${user.id}::uuid AND status NOT IN ('done','completed') ORDER BY priority ASC NULLS LAST, due_date ASC NULLS LAST LIMIT 12`,
      db`SELECT raw_input FROM public.quick_captures WHERE owner_id=${user.id}::uuid AND processed=false ORDER BY created_at DESC LIMIT 8`,
      db`SELECT title, progress, status, target_date FROM public.goals WHERE owner_id=${user.id}::uuid AND status NOT IN ('done','completed') ORDER BY priority ASC NULLS LAST LIMIT 8`,
    ]);
    const { text } = await generateText({
      model: "anthropic/claude-sonnet-5",
      system: "You are Yusuf's private Chief of Staff. Be concise, grounded only in supplied data, and never invent facts. Return a practical brief with: focus, why now, three actions, and one risk. Yusuf makes all final decisions.",
      prompt: JSON.stringify({ tasks, captures, goals }),
    });
    return NextResponse.json({ ok: true, brief: text });
  } catch (error) {
    console.error("[v0] AI brief failed", error);
    return NextResponse.json({ ok: false, error: "Unable to generate a private brief." }, { status: 500 });
  }
}
