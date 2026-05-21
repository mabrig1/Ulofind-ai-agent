'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Props {
  listingId: string;
  listingTitle: string;
}

export default function LeadForm({ listingId, listingTitle }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) { toast.error('Name and phone are required'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          buyerName: name,
          buyerPhone: phone,
          message: message || `I'm interested in: ${listingTitle}`,
        }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
      toast.success('Message sent!');
    } catch {
      toast.error('Failed to send. Try WhatsApp instead.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <p className="text-sm font-medium text-center py-3" style={{ color: '#0f5132' }}>
        ✓ Message sent! The agent will contact you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <Toaster />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name *"
        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number *"
        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message (optional)"
        rows={3}
        className="w-full border rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-green-700"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full text-white py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#0f5132' }}
      >
        {loading ? 'Sending…' : 'Send Inquiry'}
      </button>
    </form>
  );
}
