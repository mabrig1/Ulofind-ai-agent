import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import { requireAdmin } from '@/lib/security';

interface Params { params: { id: string } }

function invalidId(id: string) {
  return !mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_req: NextRequest, { params }: Params) {
  if (invalidId(params.id)) return NextResponse.json({ error: 'Invalid listing id' }, { status: 400 });
  await connectDB();
  const listing = await Listing.findByIdAndUpdate(params.id, { $inc: { views: 1 } }, { new: true }).lean();
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(listing);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (invalidId(params.id)) return NextResponse.json({ error: 'Invalid listing id' }, { status: 400 });
  await connectDB();
  const body = await req.json();
  const allowed = ['title','description','price','priceType','negotiable','photos','available','moderationStatus','moderationNote','featured','verified','amenities','location','distanceFromGate'];
  const updates = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
  if (updates.moderationStatus === 'rejected') updates.featured = false;
  const listing = await Listing.findByIdAndUpdate(params.id, updates, { new: true, runValidators: true });
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(listing);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (invalidId(params.id)) return NextResponse.json({ error: 'Invalid listing id' }, { status: 400 });
  await connectDB();
  const listing = await Listing.findByIdAndDelete(params.id);
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
