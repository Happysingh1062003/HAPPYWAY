import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
    }

    // Validate file size (25MB)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 25MB.' }, { status: 400 });
    }

    // In demo mode, return mock upload result
    return NextResponse.json({
      url: `/uploads/${file.name}`,
      key: `uploads/demo/${Date.now()}-${file.name}`,
      size: file.size,
      type: file.type,
    }, { status: 200 });
  } catch (_error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
