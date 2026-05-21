import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';

export async function GET() {
  await connectDB();
  const listings = await Listing.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(listings);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const listing = await Listing.create(body);
  return NextResponse.json(listing, { status: 201 });
}
