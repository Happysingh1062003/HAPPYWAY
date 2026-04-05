import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ resources: [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ resource: { id: crypto.randomUUID(), ...body, createdAt: new Date().toISOString() } }, { status: 201 });
}
