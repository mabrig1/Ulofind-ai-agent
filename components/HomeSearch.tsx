'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HomeSearch() {
  const router = useRouter();
  const [category, setCategory] = useState('housing');
  const [keyword, setKeyword] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ category });
    if (keyword.trim()) params.set('q', keyword.trim());
    router.push(category === 'housing' ? `/housing?${params}` : `/shops?${params}`);
  }

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 -mt-6 relative z-10">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col sm:flex-row overflow-hidden">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-3 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-100 text-gray-700 bg-gray-50 focus:outline-none"
        >
          <option value="housing">Housing</option>
          <option value="campus-shop">Campus Shop</option>
          <option value="town-shop">Town Shop</option>
        </select>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Location or keyword…"
          className="flex-1 px-4 py-3 text-sm focus:outline-none"
        />
        <button
          type="submit"
          className="text-white px-6 py-3 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#0f5132' }}
        >
          <Search size={16} />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </form>
  );
}
