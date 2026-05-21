'use client';

import Link from 'next/link';
import { Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { href: '/housing', label: 'Housing' },
  { href: '/shops', label: 'Shops' },
  { href: '/post', label: 'Post Listing' },
  { href: '/verify', label: 'Verify Property' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="p-1.5 rounded-lg text-white" style={{ backgroundColor: '#0f5132' }}>
            <Home size={18} />
          </span>
          <div className="leading-tight">
            <p className="text-xl font-extrabold tracking-tight" style={{ color: '#0f5132' }}>
              UloFind
            </p>
            <p className="text-[10px] text-gray-400 hidden sm:block">Find it. Verify it. Move in.</p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium">
          {links.slice(0, 2).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:opacity-70 transition-opacity"
              style={{ color: '#0f5132' }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/verify"
            className="hover:opacity-70 transition-opacity"
            style={{ color: '#0f5132' }}
          >
            Verify Property
          </Link>
          <Link
            href="/post"
            className="text-white px-5 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#0f5132' }}
          >
            Post Listing
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden"
          style={{ color: '#0f5132' }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-5 flex flex-col gap-4">
          {links.slice(0, 3).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-base font-medium py-1 border-b border-gray-50"
              style={{ color: '#0f5132' }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/verify"
            className="text-base font-medium py-1 border-b border-gray-50"
            style={{ color: '#0f5132' }}
            onClick={() => setOpen(false)}
          >
            Verify Property
          </Link>
          <Link
            href="/post"
            className="text-white text-center py-3 rounded-full font-bold"
            style={{ backgroundColor: '#0f5132' }}
            onClick={() => setOpen(false)}
          >
            Post Listing Free
          </Link>
        </div>
      )}
    </nav>
  );
}
