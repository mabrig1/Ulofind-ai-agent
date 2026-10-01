import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'file is required' }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: 'Only JPG, PNG, WebP or PDF files are allowed' }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File must be 5MB or smaller' }, { status: 413 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(base64, {
    folder: 'ulofind',
    resource_type: 'auto',
    use_filename: false,
    unique_filename: true,
  });
  return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
}
