'use client';

import { useState } from 'react';
import UploadZone from '@/components/UploadZone';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

type Category = 'housing' | 'campus-shop' | 'town-shop' | '';

interface FormData {
  category: Category;
  title: string;
  description: string;
  price: string;
  priceType: 'per-year' | 'per-month';
  negotiable: boolean;
  housingType: string;
  location: string;
  nearUNN: boolean;
  amenities: string[];
  furnished: boolean;
  campusZone: string;
  allocationLetterAvailable: boolean;
  townArea: string;
  shopType: string;
  agentName: string;
  agentPhone: string;
  agentWhatsApp: string;
}

const AMENITIES = ['water', 'light', 'security', 'borehole', 'parking', 'kitchen', 'bathroom-inside', 'fence'];
const HOUSING_TYPES = ['room', 'self-contained', 'room-and-parlour', 'flat', 'apartment', 'boys-quarter', 'mini-flat'];
const CAMPUS_ZONES = ['SUB', 'faculty-canteen', 'hostel-area', 'library-axis', 'engineering-area', 'medical-area', 'main-gate', 'back-gate', 'sports-complex', 'other'];
const TOWN_AREAS = ['ogige-market', 'international-market', 'university-road', 'hilltop', 'odim', 'town-center', 'enugu-road', 'other'];
const LOCATIONS = ['Hilltop', 'Odim', 'Independence Layout', 'Onuiyi', 'Ede-Oballa', 'Other'];

const INITIAL: FormData = {
  category: '', title: '', description: '', price: '', priceType: 'per-year',
  negotiable: false, housingType: '', location: '', nearUNN: false,
  amenities: [], furnished: false, campusZone: '', allocationLetterAvailable: false,
  townArea: '', shopType: '', agentName: '', agentPhone: '', agentWhatsApp: '',
};

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((s, i) => (
        <>
          <div
            key={s}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              step >= s ? 'text-white' : 'bg-gray-200 text-gray-400'
            }`}
            style={step >= s ? { backgroundColor: '#0f5132' } : {}}
          >
            {step > s ? '✓' : s}
          </div>
          {i < 2 && <div className={`flex-1 h-0.5 rounded ${step > s ? 'bg-green-700' : 'bg-gray-200'}`} style={step > s ? { backgroundColor: '#0f5132' } : {}} />}
        </>
      ))}
    </div>
  );
}

export default function PostPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [createdId, setCreatedId] = useState('');

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAmenity(a: string) {
    set('amenities', form.amenities.includes(a) ? form.amenities.filter((x) => x !== a) : [...form.amenities, a]);
  }

  function handleFiles(files: File[]) {
    const next = [...photos, ...files].slice(0, 5);
    setPhotos(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  }

  function removePhoto(i: number) {
    setPhotos(photos.filter((_, j) => j !== i));
    setPreviews(previews.filter((_, j) => j !== i));
  }

  async function handleSubmit() {
    if (!form.agentName || !form.agentPhone || !form.price || !form.title) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of photos) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.url) uploadedUrls.push(data.url);
      }
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), photos: uploadedUrls }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCreatedId(data._id);
    } catch {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
      return;
    }
    setLoading(false);
  }

  if (createdId) {
    const shareText = encodeURIComponent(
      `Check out this listing on UloFind: ${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ulofind.fintigen.com'}/listing/${createdId}`
    );
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <CheckCircle size={56} className="mx-auto mb-4" style={{ color: '#0f5132' }} />
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Your listing is live!</h1>
        <p className="text-gray-500 mb-8">Share it with potential tenants or customers.</p>
        <a
          href={`https://wa.me/?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          Share on WhatsApp
        </a>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <Toaster />
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Post a Listing</h1>
      <p className="text-gray-500 text-sm mb-6">Free. No account needed. Live in minutes.</p>
      <StepIndicator step={step} />

      {/* ── Step 1: Category ── */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">What are you listing?</h2>
          <div className="grid gap-3">
            {([
              { value: 'housing', label: '🏠 Housing', desc: 'Room, flat, self-contained, apartment' },
              { value: 'campus-shop', label: '🏫 Campus Shop', desc: 'Inside UNN campus' },
              { value: 'town-shop', label: '🏪 Town Shop', desc: 'Ogige, Hilltop, University Road…' },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => set('category', opt.value)}
                className={`text-left p-4 rounded-2xl border-2 transition-colors ${
                  form.category === opt.value ? '' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                style={
                  form.category === opt.value
                    ? { borderColor: '#0f5132', backgroundColor: '#f0fdf4' }
                    : {}
                }
              >
                <p className="font-semibold text-gray-900">{opt.label}</p>
                <p className="text-sm text-gray-500 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
          <button
            disabled={!form.category}
            onClick={() => setStep(2)}
            className="mt-6 w-full text-white py-3 rounded-2xl font-bold disabled:opacity-40"
            style={{ backgroundColor: '#0f5132' }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* ── Step 2: Details ── */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Property Details</h2>

          <input
            type="text"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Listing title *  e.g. Clean Self-Contained near Back Gate"
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
          />

          {/* Housing fields */}
          {form.category === 'housing' && (
            <>
              <select
                value={form.housingType}
                onChange={(e) => set('housingType', e.target.value)}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              >
                <option value="">Select housing type</option>
                {HOUSING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              >
                <option value="">Select location</option>
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input type="checkbox" checked={form.nearUNN} onChange={(e) => set('nearUNN', e.target.checked)} className="w-4 h-4 accent-green-700" />
                  Near UNN campus
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input type="checkbox" checked={form.furnished} onChange={(e) => set('furnished', e.target.checked)} className="w-4 h-4 accent-green-700" />
                  Furnished
                </label>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        form.amenities.includes(a) ? 'text-white border-transparent' : 'border-gray-200 text-gray-600 bg-white'
                      }`}
                      style={form.amenities.includes(a) ? { backgroundColor: '#0f5132' } : {}}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Campus shop fields */}
          {form.category === 'campus-shop' && (
            <>
              <select
                value={form.campusZone}
                onChange={(e) => set('campusZone', e.target.value)}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              >
                <option value="">Select campus zone</option>
                {CAMPUS_ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
              <input
                type="text"
                value={form.shopType}
                onChange={(e) => set('shopType', e.target.value)}
                placeholder="Shop type  e.g. Food canteen, Stationery, Boutique"
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              />
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.allocationLetterAvailable}
                  onChange={(e) => set('allocationLetterAvailable', e.target.checked)}
                  className="w-4 h-4 accent-green-700"
                />
                UNN Allocation Letter available
              </label>
            </>
          )}

          {/* Town shop fields */}
          {form.category === 'town-shop' && (
            <>
              <select
                value={form.townArea}
                onChange={(e) => set('townArea', e.target.value)}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              >
                <option value="">Select area</option>
                {TOWN_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <input
                type="text"
                value={form.shopType}
                onChange={(e) => set('shopType', e.target.value)}
                placeholder="Shop type  e.g. Provision store, Boutique, Electronics"
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              />
            </>
          )}

          {/* Price */}
          <div className="flex gap-3">
            <input
              type="number"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="Price (₦)  *"
              className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />
            <select
              value={form.priceType}
              onChange={(e) => set('priceType', e.target.value as 'per-year' | 'per-month')}
              className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            >
              <option value="per-year">/ Year</option>
              <option value="per-month">/ Month</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={form.negotiable} onChange={(e) => set('negotiable', e.target.checked)} className="w-4 h-4 accent-green-700" />
            Price is negotiable
          </label>

          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            placeholder="Description"
            className="w-full border rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none"
          />

          {/* Agent info */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <p className="text-sm font-bold text-gray-800">Your Contact Details</p>
            <input
              type="text"
              value={form.agentName}
              onChange={(e) => set('agentName', e.target.value)}
              placeholder="Your name *"
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />
            <input
              type="tel"
              value={form.agentPhone}
              onChange={(e) => set('agentPhone', e.target.value)}
              placeholder="Phone number *"
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />
            <input
              type="tel"
              value={form.agentWhatsApp}
              onChange={(e) => set('agentWhatsApp', e.target.value)}
              placeholder="WhatsApp number (if different)"
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-3 rounded-2xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!form.title || !form.price || !form.agentName || !form.agentPhone}
              className="flex-1 text-white py-3 rounded-2xl font-bold disabled:opacity-40"
              style={{ backgroundColor: '#0f5132' }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Photos ── */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-gray-900">Upload Photos</h2>
          <p className="text-sm text-gray-500">Up to 5 photos. Good photos get more inquiries.</p>
          <UploadZone onFilesAccepted={handleFiles} />
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/80"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-3 rounded-2xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 text-white py-3 rounded-2xl font-bold disabled:opacity-50"
              style={{ backgroundColor: '#0f5132' }}
            >
              {loading ? 'Posting…' : 'Post Listing Free'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
