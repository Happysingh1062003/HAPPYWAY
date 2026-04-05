import { NextRequest, NextResponse } from 'next/server';

// Demo vault data for when no DB is connected
const demoItems = [
  { id: '1', title: 'IEEE Best Paper Award 2024', criterion: 'awards', strength: 'compelling', strengthScore: 88, description: 'Best Paper Award at IEEE ICMLA', issuingOrganization: 'IEEE', createdAt: new Date().toISOString() },
  { id: '2', title: 'Nature Machine Intelligence Publication', criterion: 'scholarly_articles', strength: 'compelling', strengthScore: 92, description: 'First-author paper on transformer architecture', issuingOrganization: 'Nature Portfolio', createdAt: new Date().toISOString() },
];

export async function GET(req: NextRequest) {
  try {
    const criterion = req.nextUrl.searchParams.get('criterion');
    let items = demoItems;
    if (criterion) {
      items = items.filter(i => i.criterion === criterion);
    }
    return NextResponse.json({ items }, { status: 200 });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch evidence' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newItem = {
      id: crypto.randomUUID(),
      ...body,
      strength: 'solid',
      strengthScore: 65,
      aiAnalysis: 'Analysis pending...',
      aiSuggestions: 'Suggestions will appear after analysis completes.',
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to create evidence' }, { status: 500 });
  }
}
