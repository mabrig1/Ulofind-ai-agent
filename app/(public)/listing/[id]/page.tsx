import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Shield } from 'lucide-react';
import LeadForm from './LeadForm';
import SimilarListings from './SimilarListings';

interface Props {
  params: { id: string };
}

async function getListing(id: string) {
  try {
    await connectDB();
    const doc = await Listing.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default async function ListingDetailPage({ params }: Props) {
  const listing = await getListing(params.id);
  if (!listing) notFound();

  const photos = (listing.photos as string[]) ?? [];
  const waNumber = ((listing.agentWhatsApp as string) ?? (listing.agentPhone as string)).replace(/\D/g, '');
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi, I'm interested in "${listing.title}" on UloFind.`)}`;
  const displayLocation = (listing.location ?? listing.campusZone ?? listing.townArea ?? '') as string;
  const isShop = (listing.category as string).includes('shop');

  const detailRows = [
    listing.housingType ? ['Type', listing.housingType] : null,
    listing.campusZone ? ['Campus Zone', listing.campusZone] : null,
    listing.townArea ? ['Town Area', listing.townArea] : null,
    listing.location ? ['Location', listing.location] : null,
    listing.nearUNN ? ['Near UNN', 'Yes ✓'] : null,
    listing.furnished ? ['Furnished', 'Yes ✓'] : null,
    listing.distanceFromGate ? ['Distance from Gate', listing.distanceFromGate] : null,
    listing.negotiable ? ['Negotiable', 'Yes'] : null,
    listing.allocationLetterAvailable ? ['Allocation Letter', 'Available ✓'] : null,
    listing.shopType ? ['Shop Type', listing.shopType] : null,
  ].filter(Boolean) as [string, unknown][];

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-5 flex gap-1 flex-wrap">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href={isShop ? '/shops' : '/housing'} className="hover:underline capitalize">
          {(listing.category as string).replace(/-/g, ' ')}
        </Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-[180px]">{listing.title as string}</span>
      </nav>

      <div className="grid md:grid-cols-3 gap-6">
        {/* ── Left col: media + details ── */}
        <div className="md:col-span-2 space-y-6">

          {/* Photo gallery */}
          {photos.length > 0 ? (
            <div className="space-y-2">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={photos[0]}
                  alt={listing.title as string}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {photos.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {photos.slice(1, 5).map((p, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <Image src={p} alt={`Photo ${i + 2}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
              No photos
            </div>
          )}

          {/* Title + price */}
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
              {listing.title as string}
            </h1>
            {displayLocation && (
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <MapPin size={14} />
                <span>{displayLocation}</span>
              </div>
            )}
            <p className="text-3xl font-extrabold mt-3" style={{ color: '#0f5132' }}>
              ₦{(listing.price as number).toLocaleString()}
              <span className="text-base font-normal text-gray-400 ml-1">
                /{listing.priceType === 'per-year' ? 'per year' : 'per month'}
              </span>
            </p>
            {listing.negotiable && (
              <span className="inline-block mt-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                Negotiable
              </span>
            )}
          </div>

          {/* Description */}
          {listing.description && (
            <div>
              <h2 className="font-bold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {listing.description as string}
              </p>
            </div>
          )}

          {/* Details table */}
          {detailRows.length > 0 && (
            <div>
              <h2 className="font-bold text-gray-900 mb-3">Property Details</h2>
              <div className="rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                {detailRows.map(([key, val]) => (
                  <div key={key} className="flex justify-between px-4 py-2.5 text-sm">
                    <span className="text-gray-400">{key}</span>
                    <span className="font-medium text-gray-900 capitalize text-right">{String(val)}</span>
                  </div>
                ))}
                {(listing.amenities as string[])?.length > 0 && (
                  <div className="px-4 py-3 text-sm">
                    <span className="text-gray-400 block mb-2">Amenities</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(listing.amenities as string[]).map((a) => (
                        <span key={a} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Verify CTA */}
          <Link
            href="/verify"
            className="flex items-start gap-3 p-4 rounded-2xl border-2 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition-colors"
          >
            <Shield size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-800 text-sm">
                Verify this property before paying
              </p>
              <p className="text-xs text-yellow-600 mt-0.5">
                Use Ada AI to check for fraud signals specific to Nsukka →
              </p>
            </div>
          </Link>
        </div>

        {/* ── Right col: contact ── */}
        <div>
          <div
            className="border border-gray-100 rounded-2xl p-5 shadow-sm sticky top-20"
          >
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Listed by</p>
            <p className="font-bold text-gray-900 text-lg">{listing.agentName as string}</p>

            <div className="flex flex-col gap-2 mt-4">
              <a
                href={`tel:${listing.agentPhone as string}`}
                className="flex items-center justify-center gap-2 border-2 py-2.5 rounded-xl font-semibold text-sm transition-colors hover:bg-gray-50"
                style={{ borderColor: '#0f5132', color: '#0f5132' }}
              >
                <Phone size={16} />
                {listing.agentPhone as string}
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-white py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity bg-green-500"
              >
                <WaIcon />
                WhatsApp Agent
              </a>
            </div>

            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="text-sm font-bold text-gray-900 mb-3">Send a message</p>
              <LeadForm listingId={String(listing._id)} listingTitle={listing.title as string} />
            </div>
          </div>
        </div>
      </div>

      {/* Similar listings */}
      <div className="mt-10">
        <h2 className="text-xl font-extrabold text-gray-900 mb-4">Similar Listings</h2>
        <SimilarListings category={listing.category as string} excludeId={String(listing._id)} />
      </div>
    </main>
  );
}
