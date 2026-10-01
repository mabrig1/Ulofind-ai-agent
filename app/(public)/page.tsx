import Link from 'next/link';
import { Shield, Search, CheckCircle } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import ListingCard, { type ListingCardProps } from '@/components/ListingCard';
import HomeSearch from '@/components/HomeSearch';

async function getFeatured(): Promise<ListingCardProps[]> {
  try {
    await connectDB();
    const docs = await Listing.find({ available: true, featured: true })
      .sort({ postedAt: -1 })
      .limit(6)
      .lean();
    return JSON.parse(JSON.stringify(docs)) as ListingCardProps[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <main>
      {/* ── Hero ── */}
      <section className="text-white text-center px-4 pt-16 pb-20" style={{ backgroundColor: '#0f5132' }}>
        <p className="text-green-300 text-xs font-semibold uppercase tracking-widest mb-3">
          Nsukka · Enugu State · Nigeria
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-2xl mx-auto">
          Tell Ada What You Need.<br className="hidden sm:block" /> Find the Right Place.
        </h1>
        <p className="mt-4 text-green-100 text-base md:text-lg max-w-lg mx-auto">
          An agentic housing concierge for Nsukka and UNN: discover, compare, screen risk and move from search to viewing with fewer dead ends.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            href="/housing"
            className="bg-white font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors"
            style={{ color: '#0f5132' }}
          >
            Browse Housing
          </Link>
          <Link
            href="/shops"
            className="text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#d4a017' }}
          >
            Browse Shops
          </Link>
        </div>
      </section>

      {/* ── Floating search ── */}
      <HomeSearch />

      {/* ── Stats ── */}
      <section className="max-w-4xl mx-auto px-4 mt-12 mb-10">
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { stat: 'Nsukka', label: 'Local Marketplace' },
            { stat: 'UNN', label: 'Campus Covered' },
            { stat: 'Ada AI', label: 'Risk Screening' },
          ].map((s) => (
            <div
              key={s.label}
              className="py-5 rounded-2xl border border-green-100"
              style={{ backgroundColor: '#f0fdf4' }}
            >
              <p className="text-2xl font-extrabold" style={{ color: '#0f5132' }}>{s.stat}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured listings ── */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-gray-900">Featured Listings</h2>
            <Link href="/housing" className="text-sm font-medium hover:underline" style={{ color: '#0f5132' }}>
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {featured.map((l) => (
              <ListingCard key={String(l._id)} {...l} _id={String(l._id)} />
            ))}
          </div>
        </section>
      )}

      {/* ── How Ada protects you ── */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-2">
            Meet Your Ada Housing Agent
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8 max-w-md mx-auto">
            Ada turns your needs into a housing mission, searches approved inventory, ranks suitable options and guides the next safe step.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: <Search size={28} style={{ color: '#0f5132' }} />,
                title: '1. Tell Ada Your Need',
                desc: 'Describe your budget, preferred area, room type, campus proximity and priorities in normal language.',
              },
              {
                icon: <Shield size={28} style={{ color: '#0f5132' }} />,
                title: '2. Get a Ranked Shortlist',
                desc: 'Ada searches approved UloFind inventory and ranks matches using your constraints, verification status and fit.',
              },
              {
                icon: <CheckCircle size={28} style={{ color: '#0f5132' }} />,
                title: '3. Screen, View & Decide',
                desc: 'Screen risk, compare options and follow a verification checklist before viewing, commitment or payment.',
              },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="mb-3">{card.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fraud CTA banner ── */}
      <section className="bg-red-600 text-white py-12 px-4 text-center">
        <p className="text-xs uppercase tracking-widest text-red-200 mb-2">Stay Safe</p>
        <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Suspect a scam?</h2>
        <p className="text-red-100 text-sm max-w-md mx-auto mb-7">
          Run a free AI risk screening for warning signs associated with common property scams. Always verify identity, authority and documents independently before payment.
        </p>
        <Link
          href="/verify"
          className="inline-block bg-white text-red-600 font-bold px-8 py-3 rounded-full hover:bg-red-50 transition-colors"
        >
          Run a Free Risk Screening →
        </Link>
      </section>
    </main>
  );
}
