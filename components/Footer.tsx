import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <p className="text-white font-bold text-lg mb-2">Ulofind</p>
          <p>Find housing and shops near your campus in Nigeria.</p>
        </div>
        <div>
          <p className="text-white font-semibold mb-2">Browse</p>
          <ul className="space-y-1">
            <li><Link href="/housing" className="hover:text-white">Housing</Link></li>
            <li><Link href="/shops" className="hover:text-white">Shops</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-2">Tools</p>
          <ul className="space-y-1">
            <li><Link href="/verify" className="hover:text-white">Fraud Check</Link></li>
            <li><Link href="/post" className="hover:text-white">Post Listing</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-2">Legal</p>
          <ul className="space-y-1">
            <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white">Terms of Use</Link></li>
          </ul>
        </div>
      </div>
      <p className="text-center text-xs mt-8">© {new Date().getFullYear()} Ulofind. All rights reserved.</p>
    </footer>
  );
}
