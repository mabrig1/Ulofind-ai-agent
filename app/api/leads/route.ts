import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Listing from '@/models/Listing';
import { resend } from '@/lib/resend';
import { cleanText, safePhone } from '@/lib/security';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (ch) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch] || ch));
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const buyerName = cleanText(body.buyerName, 100);
  const buyerPhone = safePhone(body.buyerPhone);
  const buyerEmail = cleanText(body.buyerEmail, 200);
  const message = cleanText(body.message, 1500);
  const listingId = cleanText(body.listingId, 50);

  if (!buyerName || !buyerPhone || !mongoose.Types.ObjectId.isValid(listingId)) {
    return NextResponse.json({ error: 'Valid buyerName, buyerPhone and listingId are required' }, { status: 400 });
  }

  const listing = await Listing.findOne({ _id: listingId, available: true, moderationStatus: 'approved' })
    .select('title agentName')
    .lean();
  if (!listing) return NextResponse.json({ error: 'Listing is not available' }, { status: 404 });

  const lead = await Lead.create({ listingId, buyerName, buyerPhone, buyerEmail: buyerEmail || undefined, message: message || undefined });

  if (ADMIN_EMAIL) {
    const safeTitle = escapeHtml(listing.title);
    await resend.emails.send({
      from: 'UloFind <noreply@ulofind.fintigen.com>',
      to: ADMIN_EMAIL,
      subject: 'New UloFind listing inquiry',
      html: `
        <h2>New Inquiry Received</h2>
        <p>Someone is interested in <strong>${safeTitle}</strong>.</p>
        <p><strong>Name:</strong> ${escapeHtml(buyerName)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(buyerPhone)}</p>
        ${buyerEmail ? `<p><strong>Email:</strong> ${escapeHtml(buyerEmail)}</p>` : ''}
        ${message ? `<p><strong>Message:</strong> ${escapeHtml(message)}</p>` : ''}
      `,
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, leadId: lead._id }, { status: 201 });
}
