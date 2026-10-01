import { NextRequest, NextResponse } from 'next/server';

export function requireAdmin(req: NextRequest) {
  const expected = process.env.ADMIN_API_KEY;
  const supplied = req.headers.get('x-admin-key');
  if (!expected || supplied !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export function cleanText(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function safePhone(value: unknown) {
  const phone = cleanText(value, 30);
  return /^[+0-9 ()-]{7,30}$/.test(phone) ? phone : '';
}
