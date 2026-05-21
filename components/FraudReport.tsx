'use client';

import { useState } from 'react';

interface FraudResult {
  verdict: 'safe' | 'suspicious' | 'likely_fraud';
  confidence: number;
  reasoning: string;
}

const verdictColors = {
  safe: 'bg-green-100 text-green-800',
  suspicious: 'bg-yellow-100 text-yellow-800',
  likely_fraud: 'bg-red-100 text-red-800',
};

export default function FraudReportComponent() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<FraudResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCheck() {
    setLoading(true);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="Paste listing description or agent message here…"
        className="w-full border rounded-xl p-4 text-sm resize-none"
      />
      <button
        onClick={handleCheck}
        disabled={loading || !text.trim()}
        className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium disabled:opacity-50"
      >
        {loading ? 'Checking…' : 'Check for Fraud'}
      </button>
      {result && (
        <div className={`rounded-xl p-4 ${verdictColors[result.verdict]}`}>
          <p className="font-bold capitalize">{result.verdict.replace('_', ' ')}</p>
          <p className="text-sm mt-1">{result.reasoning}</p>
          <p className="text-xs mt-2 opacity-70">
            Confidence: {Math.round(result.confidence * 100)}%
          </p>
        </div>
      )}
    </div>
  );
}
