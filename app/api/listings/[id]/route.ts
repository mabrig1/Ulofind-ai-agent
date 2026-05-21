import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  await connectDB();
  const listing = await Listing.findById(params.id).lean();
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(listing);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  await connectDB();
  const body = await req.json();
  const listing = await Listing.findByIdAndUpdate(params.id, body, { new: true });
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(listing);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  await connectDB();
  await Listing.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
