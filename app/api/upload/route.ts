import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string } | undefined;

    if (!session || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
    }

    // Try detecting JSON body for pre-signed URLs
    let isPresignedRequest = false;
    let payload;
    try {
      payload = await req.clone().json();
      if (payload.filename && payload.contentType) {
        isPresignedRequest = true;
      }
    } catch {
      // Not JSON, assume it's a FormData file buffer
    }

    // Scenario A: Client wants a Presigned URL for direct S3 upload
    if (isPresignedRequest && payload) {
      if (!process.env.CLOUDFLARE_R2_ACCOUNT_ID || !process.env.CLOUDFLARE_R2_BUCKET_NAME || !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
         return NextResponse.json({ error: 'Cloudflare R2 not configured in this environment. Cannot generate presigned URL.' }, { status: 501 });
      }

      const s3 = new S3Client({ 
        region: 'auto',
        endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        }
      });
      const key = `vaults/${user.id}/${Date.now()}-${payload.filename}`;
      const command = new PutObjectCommand({ 
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME, 
        Key: key, 
        ContentType: payload.contentType 
      });
      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

      return NextResponse.json({ uploadUrl, key }, { status: 200 });
    }

    // Scenario B: Traditional FormData Buffer upload (Currently acts as local mock fallback)
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Secure file type validation
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 25MB.' }, { status: 400 });
    }

    // Safely act as an authenticated mock since S3 presigned wasn't explicitly requested
    return NextResponse.json({
      url: `/uploads/${file.name}`,
      key: `uploads/${user.id}/${Date.now()}-${file.name}`,
      size: file.size,
      type: file.type,
    }, { status: 200 });
  } catch (error) {
    console.error('[API/Upload] Error:', error);
    return NextResponse.json({ error: 'Upload failed securely' }, { status: 500 });
  }
}
