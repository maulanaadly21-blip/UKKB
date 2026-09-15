import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-14 pb-8 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-100">
          {/* Column 1: Logo & Brand Description */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img
                src="/logo-transparent.png"
                alt="Adly Wangsa Logo"
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                Adly <span className="text-[#0F382C]">Wangsa</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Platform reservasi ruang kerja & workstation terpadu di Indonesia. Dirancang untuk fokus, produktivitas, dan fleksibilitas tim modern.
            </p>
          </div>

          {/* Column 2: Tautan Cepat */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Tautan Cepat
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <Link to="/" className="hover:text-[#0F382C] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/ruang" className="hover:text-[#0F382C] transition-colors">
                  Katalog Ruang
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="hover:text-[#0F382C] transition-colors">
                  Ketentuan
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="hover:text-[#0F382C] transition-colors">
                  Bantuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Lokasi Coworking */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Lokasi Coworking
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li className="hover:text-[#0F382C] cursor-pointer">Jakarta Selatan</li>
              <li className="hover:text-[#0F382C] cursor-pointer">Bandung</li>
              <li className="hover:text-[#0F382C] cursor-pointer">Yogyakarta</li>
              <li className="hover:text-[#0F382C] cursor-pointer">Surabaya</li>
            </ul>
          </div>

          {/* Column 4: Kontak */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Kontak
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href="mailto:halo@smartspace.id" className="hover:text-[#0F382C]">
                  halo@smartspace.id
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href="tel:+6281234567890" className="hover:text-[#0F382C]">
                  +62 812 3456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
          <p>© 2025 Smart Space Coworking. Hak Cipta Dilindungi.</p>
          <p className="font-sans tracking-tight">Designed with Architectural Precision</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
