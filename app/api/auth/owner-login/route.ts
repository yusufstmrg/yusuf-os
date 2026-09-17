// app/api/auth/owner-login/route.ts
import { NextResponse } from "next/server";

/**
 * Owner PIN login endpoint.
 *
 * Expects a JSON payload: { "pin": "<PIN>" }
 * On success, sets a `firebaseToken` cookie containing a special owner‑session token
 * and returns a JSON payload with user information.
 * On failure, returns 401 with an error message.
 */
export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    const expectedPin = process.env.OWNER_PIN ?? "240724";
    if (pin !== expectedPin) {
      return NextResponse.json(
        { ok: false, error: "PIN Keamanan Pemilik salah. Akses ditolak." },
        { status: 401 }
      );
    }

    // Owner session token – recognized by lib/auth/server.ts
    const ownerToken = "owner-session-yusuf-verified-root";
    const response = NextResponse.json({
      ok: true,
      message: "Autentikasi Pemilik Berhasil",
      user: { email: "yusufbsitumorang@gmail.com", name: "Yusuf B. Situmorang" },
    });
    // Set cookie (30 days maxAge, same as Firebase token handling)
    response.cookies.set("firebaseToken", ownerToken, {
      httpOnly: false,
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: "/",
      sameSite: "lax",
    });
    return response;
  } catch (err) {
    console.error("Owner login error:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid request payload" },
      { status: 400 }
    );
  }
}

export async function GET() {
  // For debugging – returns a simple message.
  return NextResponse.json({ message: "Owner login endpoint ready. Use POST with { pin }" });
}
