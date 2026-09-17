import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ShieldCheck, Key, Wifi, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Footer: React.FC = () => {
  const { appKey } = useAuth();

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-14 pb-8 mt-24">
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
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs font-normal">
              Platform reservasi ruang kerja & workstation terpadu di Indonesia. Dirancang untuk fokus, produktivitas, dan fleksibilitas tim modern.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E6F4F1] border border-emerald-200 text-[#0F382C] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>API Live: Connected</span>
            </div>
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
                <Link to="/promo" className="hover:text-[#0F382C] transition-colors">
                  Voucher & Promo
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="hover:text-[#0F382C] transition-colors">
                  Tentang Kami & Bantuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Lokasi Coworking */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Lokasi Coworking Hub
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li className="hover:text-[#0F382C] cursor-pointer">Jakarta Hub (SCBD & Kuningan)</li>
              <li className="hover:text-[#0F382C] cursor-pointer">Bandung Creative Space (Dago)</li>
              <li className="hover:text-[#0F382C] cursor-pointer">Malang Moklet Hub (Sawojajar)</li>
              <li className="hover:text-[#0F382C] cursor-pointer">Surabaya Tech Center</li>
            </ul>
          </div>

          {/* Column 4: Kontak & UKK Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Kontak & Pengujian UKK
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href="mailto:halo@adlywangsa.id" className="hover:text-[#0F382C]">
                  halo@adlywangsa.id
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href="tel:+6281234567890" className="hover:text-[#0F382C]">
                  +62 812 3456 7890
                </a>
              </li>
              <li className="flex items-center gap-2 pt-1 font-mono text-[11px] text-slate-500">
                <Key className="w-3.5 h-3.5 text-[#0F382C] shrink-0" />
                <span>Key: {appKey || 'mk_default_ukk_2026'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
          <p>© 2026 Adly Wangsa Coworking Space. Hak Cipta Dilindungi (UKK RPL 2026/2027 Paket B).</p>
          <p className="font-sans tracking-tight">Backend: https://learn.smktelkom-mlg.sch.id/coworking</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
