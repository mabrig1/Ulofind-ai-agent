import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-green-300 py-10 mt-auto" style={{ backgroundColor: '#0f5132' }}>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <p className="text-white font-extrabold text-lg mb-1">UloFind</p>
          <p className="text-green-300 text-xs mb-3">Find it. Verify it. Move in.</p>
          <p className="text-green-400 text-xs">
            Verified housing &amp; shops in Nsukka, Enugu State. Powered by Ada AI fraud protection.
          </p>
          <a
            href="https://wa.me/2348000000000"
            className="inline-block mt-3 text-xs text-white underline underline-offset-2"
          >
            WhatsApp Support
          </a>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Browse</p>
          <ul className="space-y-2 text-xs">
            <li><Link href="/housing" className="hover:text-white transition-colors">Housing</Link></li>
            <li><Link href="/shops" className="hover:text-white transition-colors">Campus Shops</Link></li>
            <li><Link href="/shops" className="hover:text-white transition-colors">Town Shops</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Tools</p>
          <ul className="space-y-2 text-xs">
            <li><Link href="/verify" className="hover:text-white transition-colors">Fraud Check</Link></li>
            <li><Link href="/post" className="hover:text-white transition-colors">Post a Listing</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Contact</p>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="mailto:hello@ulofind.fintigen.com" className="hover:text-white transition-colors">
                hello@ulofind.fintigen.com
              </a>
            </li>
            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Terms of Use</Link></li>
          </ul>
        </div>
      </div>
      <p className="text-center text-xs text-green-500 mt-8">
        © 2025 UloFind. All rights reserved. Built for Nsukka students &amp; residents.
      </p>
    </footer>
  );
}
