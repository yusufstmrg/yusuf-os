import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/server";
import { refreshNextBestActions } from "@/lib/ai/intelligence";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const db = getDb();
    const owners = await db`SELECT DISTINCT owner_id FROM public.quick_captures WHERE owner_id IS NOT NULL`;
    let refreshed = 0;
    for (const owner of owners) {
      refreshed += await refreshNextBestActions(db, String(owner.owner_id));
    }
    return NextResponse.json({ ok: true, owners: owners.length, refreshed });
  } catch (error) {
    console.error("[v0] Scheduled intelligence failed", error);
    return NextResponse.json({ ok: false, error: "scheduled_intelligence_failed" }, { status: 500 });
  }
}
