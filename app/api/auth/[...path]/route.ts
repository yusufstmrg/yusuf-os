import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";

const OWNER_EMAIL = "yusufbsitumorang@gmail.com";
const DEFAULT_PIN = "240724";

export async function GET() {
  return NextResponse.json({ message: "Firebase Auth handles routing on the client side" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { pin } = body;
    const expectedPin = process.env.OWNER_PIN || DEFAULT_PIN;

    if (pin) {
      if (pin.trim() !== expectedPin.trim()) {
        return NextResponse.json(
          { ok: false, error: "PIN Akses Pemilik tidak sesuai. Akses ditolak." },
          { status: 401 }
        );
      }

      const cookieStore = await cookies();
      cookieStore.set("firebaseToken", "owner-session-yusuf-verified-root", {
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
        sameSite: "lax",
        httpOnly: false,
      });

      return NextResponse.json({
        ok: true,
        message: "Autentikasi Pemilik Berhasil",
        user: {
          id: "00000000-0000-0000-0000-000000000000",
          email: OWNER_EMAIL,
          name: "Yusuf B. Situmorang",
        },
      });
    }

    return NextResponse.json({ message: "Firebase Auth handles routing on the client side" });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
