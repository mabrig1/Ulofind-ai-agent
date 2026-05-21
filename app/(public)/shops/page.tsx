'use client';

import { useState, useEffect, useCallback } from 'react';
import ListingCard, { type ListingCardProps } from '@/components/ListingCard';

type Tab = 'campus' | 'town';

const campusZones = [
  { value: '', label: 'All' },
  { value: 'SUB', label: 'SUB' },
  { value: 'hostel-area', label: 'Hostel Areas' },
  { value: 'faculty-canteen', label: 'Faculty Canteens' },
  { value: 'library-axis', label: 'Library' },
  { value: 'main-gate', label: 'Main Gate' },
  { value: 'back-gate', label: 'Back Gate' },
  { value: 'engineering-area', label: 'Engineering' },
  { value: 'medical-area', label: 'Medical Area' },
];

const townAreas = [
  { value: '', label: 'All' },
  { value: 'ogige-market', label: 'Ogige Market' },
  { value: 'international-market', label: "Int'l Market" },
  { value: 'university-road', label: 'University Rd' },
  { value: 'hilltop', label: 'Hilltop' },
  { value: 'odim', label: 'Odim' },
  { value: 'town-center', label: 'Town Center' },
  { value: 'enugu-road', label: 'Enugu Road' },
  { value: 'other', label: 'Other' },
];

function SkeletonCard() {
  return <div className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" />;
}

export default function ShopsPage() {
  const [tab, setTab] = useState<Tab>('campus');
  const [campusZone, setCampusZone] = useState('');
  const [townArea, setTownArea] = useState('');
  const [listings, setListings] = useState<ListingCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      category: tab === 'campus' ? 'campus-shop' : 'town-shop',
    });
    if (tab === 'campus' && campusZone) params.set('campusZone', campusZone);
    if (tab === 'town' && townArea) params.set('townArea', townArea);
    try {
      const res = await fetch(`/api/listings?${params}`);
      const data = await res.json();
      setListings(data.listings ?? []);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [tab, campusZone, townArea]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const filters = tab === 'campus' ? campusZones : townAreas;
  const activeFilter = tab === 'campus' ? campusZone : townArea;
  const setFilter = tab === 'campus' ? setCampusZone : setTownArea;

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-5">
        <h1 className="text-3xl font-extrabold text-gray-900">Shops in Nsukka</h1>
        <p className="text-gray-500 mt-1 text-sm">Campus &amp; town shops available for rent</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-0 mb-6 border border-gray-200 rounded-2xl overflow-hidden w-fit shadow-sm">
        <button
          onClick={() => { setTab('campus'); setCampusZone(''); }}
          className={`px-6 py-2.5 text-sm font-semibold transition-colors ${
            tab === 'campus' ? 'text-white' : 'text-gray-600 hover:bg-gray-50 bg-white'
          }`}
          style={tab === 'campus' ? { backgroundColor: '#0f5132' } : {}}
        >
          🏫 Inside UNN Campus
        </button>
        <button
          onClick={() => { setTab('town'); setTownArea(''); }}
          className={`px-6 py-2.5 text-sm font-semibold transition-colors ${
            tab === 'town' ? 'text-white' : 'text-gray-600 hover:bg-gray-50 bg-white'
          }`}
          style={tab === 'town' ? { backgroundColor: '#0f5132' } : {}}
        >
          🏪 Nsukka Town
        </button>
      </div>

      {/* Zone/area filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeFilter === f.value
                ? 'text-white border-transparent'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
            }`}
            style={activeFilter === f.value ? { backgroundColor: '#0f5132', borderColor: '#0f5132' } : {}}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-semibold">No shops found</p>
          <p className="text-sm mt-1">Try a different zone or category</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {listings.length} shop{listings.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {listings.map((l) => (
              <ListingCard key={String(l._id)} {...l} _id={String(l._id)} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
