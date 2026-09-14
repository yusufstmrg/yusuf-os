import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    
    // Keamanan: Validasi bahwa Request ini benar-benar datang dari Make.com
    // Anda harus menset nilai ini di Header Webhook Make.com Anda:
    // Authorization: Bearer YOUR_SECRET_MAKE_API_KEY
    if (authHeader !== `Bearer ${process.env.MAKE_API_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    
    // Di sini Anda bisa memproses payload dari Make.com
    // Contoh: Insert ke database, update status, atau trigger AI Agent.
    console.log("Received data from Make.com:", payload);

    return NextResponse.json({ success: true, message: "Webhook received successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
