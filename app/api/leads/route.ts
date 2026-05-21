import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Listing from '@/models/Listing';
import { resend } from '@/lib/resend';

const ADMIN_EMAIL = 'mabrigkorie@gmail.com';

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();
  const { buyerName, buyerPhone, listingId, agentEmail } = body;

  const required = ['buyerName', 'buyerPhone'];
  const missing = required.filter((f) => !body[f]);
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(', ')}` },
      { status: 400 }
    );
  }

  const lead = await Lead.create(body);

  // Look up listing title for the email
  let listingTitle = 'a listing';
  if (listingId) {
    const listing = await Listing.findById(listingId).select('title').lean();
    if (listing) listingTitle = listing.title;
  }

  const recipient = agentEmail ?? ADMIN_EMAIL;

  await resend.emails.send({
    from: 'UloFind <noreply@ulofind.fintigen.com>',
    to: recipient,
    subject: 'New inquiry for your listing on UloFind',
    html: `
      <h2>New Inquiry Received</h2>
      <p>Someone is interested in <strong>${listingTitle}</strong>.</p>
      <table style="border-collapse:collapse;margin-top:12px">
        <tr><td style="padding:4px 12px 4px 0"><strong>Name</strong></td><td>${buyerName}</td></tr>
        <tr><td style="padding:4px 12px 4px 0"><strong>Phone</strong></td><td>${buyerPhone}</td></tr>
        ${body.buyerEmail ? `<tr><td style="padding:4px 12px 4px 0"><strong>Email</strong></td><td>${body.buyerEmail}</td></tr>` : ''}
        ${body.message ? `<tr><td style="padding:4px 12px 4px 0;vertical-align:top"><strong>Message</strong></td><td>${body.message}</td></tr>` : ''}
      </table>
      <p style="margin-top:16px;color:#666;font-size:13px">Reach out to them as soon as possible to confirm availability.</p>
    `,
  }).catch(() => {
    // non-fatal
  });

  return NextResponse.json({ success: true, leadId: lead._id }, { status: 201 });
}
