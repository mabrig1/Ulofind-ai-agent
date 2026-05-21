import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import { resend } from '@/lib/resend';

const ADMIN_EMAIL = 'mabrigkorie@gmail.com';
const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));

  const filter: Record<string, unknown> = { available: true };

  const category = searchParams.get('category');
  if (category) filter.category = category;

  const nearUNN = searchParams.get('nearUNN');
  if (nearUNN === 'true') filter.nearUNN = true;

  const campusZone = searchParams.get('campusZone');
  if (campusZone) filter.campusZone = campusZone;

  const townArea = searchParams.get('townArea');
  if (townArea) filter.townArea = townArea;

  const housingType = searchParams.get('housingType');
  if (housingType) filter.housingType = housingType;

  const featured = searchParams.get('featured');
  if (featured === 'true') filter.featured = true;

  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  if (minPrice || maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);
    filter.price = priceFilter;
  }

  const [listings, total] = await Promise.all([
    Listing.find(filter)
      .sort({ featured: -1, postedAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Listing.countDocuments(filter),
  ]);

  return NextResponse.json({
    listings,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
    },
  });
}

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  const required = ['category', 'title', 'price', 'agentName', 'agentPhone'];
  const missing = required.filter((f) => !body[f] && body[f] !== 0);
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(', ')}` },
      { status: 400 }
    );
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const listing = await Listing.create({ ...body, expiresAt });

  await resend.emails.send({
    from: 'UloFind <noreply@ulofind.fintigen.com>',
    to: ADMIN_EMAIL,
    subject: `New listing posted on UloFind: ${listing.title}`,
    html: `
      <h2>New Listing Posted</h2>
      <p><strong>Title:</strong> ${listing.title}</p>
      <p><strong>Category:</strong> ${listing.category}</p>
      <p><strong>Price:</strong> ₦${listing.price.toLocaleString()} / ${listing.priceType}</p>
      <p><strong>Agent:</strong> ${listing.agentName} — ${listing.agentPhone}</p>
      <p><strong>Listing ID:</strong> ${listing._id}</p>
      <p><strong>Expires:</strong> ${expiresAt.toDateString()}</p>
    `,
  }).catch(() => {
    // non-fatal — listing is already saved
  });

  return NextResponse.json(listing, { status: 201 });
}
