import { NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/auth/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token : "";
    if (!token) return NextResponse.json({ ok: false }, { status: 400 });
    await verifyFirebaseToken(token);
    const response = NextResponse.json({ ok: true });
    response.cookies.set("firebaseToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
    return response;
  } catch (error) {
    console.error("[v0] Session exchange failed", error);
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("firebaseToken", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
