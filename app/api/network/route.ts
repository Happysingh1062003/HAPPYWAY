import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ profiles: [] });
}

export async function POST() {
  return NextResponse.json({ profile: {} }, { status: 201 });
}
