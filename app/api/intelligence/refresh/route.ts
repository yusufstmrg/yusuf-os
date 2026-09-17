import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db/server";
import { refreshNextBestActions } from "@/lib/ai/intelligence";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!auth) return NextResponse.json({ ok: false, error: "auth_not_configured" }, { status: 503 });
  const result = await auth.getSession();
  const user = result?.data?.user;
  const session = result?.data?.session;
  if (!user || !session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "database_not_configured" }, { status: 503 });
  const count = await refreshNextBestActions(db, user.id);
  return NextResponse.json({ ok: true, count });
}
