import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { resend } from '@/lib/resend';

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const lead = await Lead.create(body);

  await resend.emails.send({
    from: 'Ulofind <noreply@ulofind.fintigen.com>',
    to: 'victoryonline1@gmail.com',
    subject: 'New lead on Ulofind',
    html: `<p>New lead from <strong>${body.name}</strong> (${body.phone}) on listing ${body.listingId}.</p>`,
  });

  return NextResponse.json(lead, { status: 201 });
}
