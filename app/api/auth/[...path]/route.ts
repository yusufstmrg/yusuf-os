import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ message: "Firebase Auth handles routing on the client side" });
}

export async function POST() {
  return NextResponse.json({ message: "Firebase Auth handles routing on the client side" });
}
