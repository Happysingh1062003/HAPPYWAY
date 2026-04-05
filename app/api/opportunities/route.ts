import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ opportunities: [] });
}

export async function POST() {
  return NextResponse.json({ opportunity: {} }, { status: 201 });
}
