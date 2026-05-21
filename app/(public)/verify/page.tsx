'use client';

import { useState, useEffect } from 'react';
import { Shield, FileText, ExternalLink } from 'lucide-react';
import UploadZone from '@/components/UploadZone';
import FraudReport, { type AiAnalysis } from '@/components/FraudReport';
import { Toaster, toast } from 'react-hot-toast';

type PropertyType = 'housing' | 'campus-shop' | 'town-shop' | '';

const LOADING_TEXTS = [
  'Ada is analyzing your submission…',
  'Checking for red flags…',
  'Scanning for Nsukka scam patterns…',
  'Cross-referencing known fraud tactics…',
  'Generating your risk report…',
];

function AdaAvatar({ pulse = false }: { pulse?: boolean }) {
  return (
    <div
      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${pulse ? 'animate-pulse' : ''}`}
      style={{ backgroundColor: '#0f5132' }}
    >
      <Shield size={32} className="text-white" />
    </div>
  );
}

function LoadingState() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % LOADING_TEXTS.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="text-center py-14">
      <AdaAvatar pulse />
      <p className="text-green-400 font-semibold text-lg mt-5 transition-all">{LOADING_TEXTS[idx]}</p>
      <p className="text-gray-600 text-sm mt-2">This takes 10–20 seconds. Please wait.</p>
      <div className="flex justify-center gap-1.5 mt-6">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-green-600 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ number, label }: { number: number; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0"
        style={{ backgroundColor: '#0f5132', color: '#fff' }}
      >
        {number}
      </span>
      <h2 className="text-white font-bold text-base">{label}</h2>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border border-gray-800 p-5"
      style={{ backgroundColor: '#0d1f3c' }}
    >
      {children}
    </div>
  );
}

export default function VerifyPage() {
  const [propertyType, setPropertyType] = useState<PropertyType>('');
  const [description, setDescription] = useState('');
  const [engisResult, setEngisResult] = useState('');
  const [docFiles, setDocFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ aiAnalysis: AiAnalysis } | null>(null);

  const showEngis = propertyType === 'campus-shop' || propertyType === 'town-shop';

  function handleDocs(files: File[]) {
    setDocFiles((prev) => [...prev, ...files].slice(0, 3));
  }

  async function handleSubmit() {
    if (!propertyType) { toast.error('Please select a property type'); return; }
    if (!description.trim()) { toast.error('Please describe the property'); return; }

    setLoading(true);
    setResult(null);

    try {
      // Upload documents to Cloudinary
      const uploadedUrls: string[] = [];
      for (const file of docFiles) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.url) uploadedUrls.push(data.url);
      }

      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyType,
          userDescription: description,
          engisResult: engisResult.trim() || undefined,
          documentsUploaded: uploadedUrls,
        }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setResult(data);
    } catch {
      toast.error('Ada encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a1628' }}>
      <Toaster
        toastOptions={{
          style: { background: '#0d1f3c', color: '#e2e8f0', border: '1px solid #1e3a5f' },
        }}
      />

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* ── Ada header ── */}
        <div className="text-center mb-10">
          <AdaAvatar />
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-4">
            Ada — Property Fraud Detector
          </h1>
          <p className="text-gray-400 mt-2 text-sm max-w-md mx-auto leading-relaxed">
            Upload documents. Describe the property. Get your risk report in seconds.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Ada is online</span>
          </div>
        </div>

        {!loading && !result && (
          <div className="space-y-5">
            {/* ── Step 1: Property type ── */}
            <Card>
              <SectionLabel number={1} label="What type of property is this?" />
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: 'housing', label: '🏠', sub: 'Housing' },
                  { value: 'campus-shop', label: '🏫', sub: 'Campus Shop' },
                  { value: 'town-shop', label: '🏪', sub: 'Town Shop' },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPropertyType(opt.value)}
                    className={`py-4 rounded-xl border-2 text-center transition-all ${
                      propertyType === opt.value
                        ? 'border-green-500 bg-green-900/40'
                        : 'border-gray-700 hover:border-gray-600 bg-white/5'
                    }`}
                  >
                    <span className="text-2xl block">{opt.label}</span>
                    <span
                      className={`text-xs font-semibold mt-1 block ${
                        propertyType === opt.value ? 'text-green-300' : 'text-gray-400'
                      }`}
                    >
                      {opt.sub}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* ── Step 2: Description ── */}
            <Card>
              <SectionLabel number={2} label="Describe the property" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder={
                  `Tell Ada about this property — address, what the agent told you, how you found it, anything that felt suspicious.\n\ne.g. Agent said the shop is at SUB near the bookshop. He's asking for ₦300k key money upfront before showing allocation letter…`
                }
                className="w-full rounded-xl px-4 py-3 text-sm text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-green-600 border border-gray-700 placeholder-gray-600"
                style={{ backgroundColor: '#0a1628' }}
              />
              <p className="text-xs text-gray-600 mt-2">
                The more detail you give, the more accurate Ada's analysis will be.
              </p>
            </Card>

            {/* ── Step 3: Documents ── */}
            <Card>
              <SectionLabel number={3} label="Upload documents (optional but recommended)" />
              <p className="text-gray-500 text-xs mb-3">
                Upload any of: Tenancy Agreement, C of O, Allocation Letter, Receipts, Survey Plan
              </p>
              <UploadZone
                onFilesAccepted={handleDocs}
                accept={{ 'image/*': [], 'application/pdf': [] }}
                maxFiles={3}
                label="Drag & drop documents, or click to browse (max 3)"
                dark
              />
              {docFiles.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {docFiles.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                      <FileText size={13} className="text-green-500 flex-shrink-0" />
                      <span className="truncate">{f.name}</span>
                      <button
                        onClick={() => setDocFiles(docFiles.filter((_, j) => j !== i))}
                        className="text-gray-600 hover:text-red-400 ml-auto flex-shrink-0"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-gray-600 mt-3">
                No documents? Ada can still analyze from your description alone.
              </p>
            </Card>

            {/* ── Step 4: ENGIS (shops only) ── */}
            {showEngis && (
              <Card>
                <SectionLabel number={4} label="ENGIS Land Registry Check" />
                <textarea
                  value={engisResult}
                  onChange={(e) => setEngisResult(e.target.value)}
                  rows={4}
                  placeholder="Did you run an ENGIS search? Paste the result here…"
                  className="w-full rounded-xl px-4 py-3 text-sm text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-green-600 border border-gray-700 placeholder-gray-600"
                  style={{ backgroundColor: '#0a1628' }}
                />
                <a
                  href="https://engis.en.gov.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-green-400 text-xs mt-2 hover:underline"
                >
                  <ExternalLink size={11} />
                  How to search ENGIS (engis.en.gov.ng)
                </a>
              </Card>
            )}

            {/* ── Submit ── */}
            <button
              onClick={handleSubmit}
              disabled={!propertyType || !description.trim()}
              className="w-full py-4 rounded-2xl font-extrabold text-white text-base tracking-wide disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              style={{ backgroundColor: '#0f5132' }}
            >
              <Shield size={20} />
              Run Fraud Check — Free
            </button>

            <p className="text-center text-xs text-gray-700">
              Powered by Ada AI · Trained on Nsukka real estate fraud patterns · Free forever
            </p>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && <LoadingState />}

        {/* ── Results ── */}
        {result && !loading && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <AdaAvatar />
              <div>
                <p className="text-white font-bold">Ada's Report</p>
                <p className="text-gray-500 text-xs">Analysis complete</p>
              </div>
            </div>

            <FraudReport
              aiAnalysis={result.aiAnalysis}
              userDescription={description}
              propertyType={propertyType}
            />

            <button
              onClick={() => {
                setResult(null);
                setPropertyType('');
                setDescription('');
                setEngisResult('');
                setDocFiles([]);
              }}
              className="mt-6 w-full py-3 rounded-2xl border border-gray-700 text-gray-400 text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Run another check
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
