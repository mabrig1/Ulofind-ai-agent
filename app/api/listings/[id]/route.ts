import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  await connectDB();

  const listing = await Listing.findByIdAndUpdate(
    params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(listing);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  await connectDB();
  const body = await req.json();

  // Prevent overwriting immutable fields via PATCH
  const { _id, postedAt, ...updates } = body;
  void _id; void postedAt;

  const listing = await Listing.findByIdAndUpdate(params.id, updates, { new: true });
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(listing);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  await connectDB();
  const listing = await Listing.findByIdAndDelete(params.id);
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
