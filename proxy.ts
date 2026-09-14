import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (!pathname.startsWith("/os")) return NextResponse.next();
  
  const token = request.cookies.get("firebaseToken")?.value;
  
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    url.searchParams.set("callbackUrl", pathname);
    url.searchParams.set("reason", "auth_setup");
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/os/:path*"],
};
