import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Ulofind
        </Link>
        <div className="flex gap-6 text-sm font-medium text-gray-700">
          <Link href="/housing" className="hover:text-blue-600">Housing</Link>
          <Link href="/shops" className="hover:text-blue-600">Shops</Link>
          <Link href="/verify" className="hover:text-blue-600">Verify</Link>
          <Link href="/post" className="hover:text-blue-600 bg-blue-600 text-white px-4 py-1.5 rounded-full">
            Post Listing
          </Link>
        </div>
      </div>
    </nav>
  );
}
