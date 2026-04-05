import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({ resource: { id } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  return NextResponse.json({ resource: { id, ...body } });
}

export async function DELETE(_req: NextRequest, { params: _params }: { params: Promise<{ id: string }> }) {
  return NextResponse.json({ success: true });
}
