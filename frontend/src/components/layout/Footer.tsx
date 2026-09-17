import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-zinc-200/80 pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Centered Logo */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span className="font-display font-black text-xl tracking-tight uppercase text-zinc-900">
              STUDIO<span className="text-red-600">ELEVEN</span>
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-semibold">
            Architectural Workspaces & Co-Working Studio
          </p>
        </div>

        {/* Minimal Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-bold uppercase tracking-wider text-zinc-600">
          <Link to="/" className="hover:text-red-600 transition-colors">Beranda</Link>
          <Link to="/ruang" className="hover:text-red-600 transition-colors">Katalog Ruang</Link>
          <Link to="/promo" className="hover:text-red-600 transition-colors">Promo & Voucher</Link>
          <Link to="/tentang" className="hover:text-red-600 transition-colors">Tentang Kami</Link>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400 font-medium">
          <p>© 2026 Studio Eleven Co-Working. Hak Cipta Dilindungi.</p>
          <p className="font-display tracking-wider text-zinc-500 font-semibold uppercase">
            Architectural Precision & Design Excellence
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
