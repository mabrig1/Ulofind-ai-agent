'use client';

import { useState, useEffect, useCallback } from 'react';
import ListingCard, { type ListingCardProps } from '@/components/ListingCard';
import { SlidersHorizontal } from 'lucide-react';

const housingTypes = [
  { value: '', label: 'All' },
  { value: 'room', label: 'Rooms' },
  { value: 'self-contained', label: 'Self-Contained' },
  { value: 'room-and-parlour', label: 'Room & Parlour' },
  { value: 'flat', label: 'Flat' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'mini-flat', label: 'Mini Flat' },
  { value: 'boys-quarter', label: "Boys' Quarter" },
];

const locations = ['Hilltop', 'Odim', 'Independence Layout', 'Onuiyi', 'Ede-Oballa', 'Other'];

function SkeletonCard() {
  return <div className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" />;
}

export default function HousingPage() {
  const [listings, setListings] = useState<ListingCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [housingType, setHousingType] = useState('');
  const [nearUNN, setNearUNN] = useState(false);
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ category: 'housing' });
    if (housingType) params.set('housingType', housingType);
    if (nearUNN) params.set('nearUNN', 'true');
    if (location) params.set('location', location);
    params.set('minPrice', String(minPrice));
    params.set('maxPrice', String(maxPrice));
    try {
      const res = await fetch(`/api/listings?${params}`);
      const data = await res.json();
      setListings(data.listings ?? []);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [housingType, nearUNN, location, minPrice, maxPrice]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-3xl font-extrabold text-gray-900">Housing in Nsukka</h1>
        <p className="text-gray-500 mt-1 text-sm">Rooms, flats, self-contained & more near UNN</p>
      </div>

      {/* Housing type tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {housingTypes.map((t) => (
          <button
            key={t.value}
            onClick={() => setHousingType(t.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              housingType === t.value
                ? 'text-white border-transparent'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
            }`}
            style={housingType === t.value ? { backgroundColor: '#0f5132', borderColor: '#0f5132' } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={nearUNN}
            onChange={(e) => setNearUNN(e.target.checked)}
            className="w-4 h-4 rounded accent-green-700"
          />
          <span className="text-sm font-medium text-gray-700">Near UNN only</span>
        </label>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none"
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <button
          onClick={() => setShowPriceFilter(!showPriceFilter)}
          className={`flex items-center gap-1.5 text-sm font-medium border rounded-xl px-3 py-1.5 bg-white transition-colors ${
            showPriceFilter ? 'border-green-700 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <SlidersHorizontal size={14} />
          Price Range
        </button>
      </div>

      {/* Price range inputs */}
      {showPriceFilter && (
        <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-200 flex flex-wrap gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Min (₦)</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              step={10000}
              className="border rounded-xl px-3 py-1.5 text-sm w-36 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Max (₦)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              step={10000}
              className="border rounded-xl px-3 py-1.5 text-sm w-36 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-semibold">No listings found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {listings.length} listing{listings.length !== 1 ? 's' : ''} found
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
