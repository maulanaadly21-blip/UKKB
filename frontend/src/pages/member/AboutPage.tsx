import React from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Wifi,
  Coffee,
  Tv,
  PhoneCall,
  Mail,
  ArrowRight,
  CheckCircle2,
  Building2
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MemberLayout>
      <div className="space-y-12 pb-12">
        {/* Header Banner */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#0F382C] bg-[#E6F4F1] px-3.5 py-1.5 rounded-full inline-block border border-emerald-200">
              Tentang Smart Space Hub
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Infrastruktur Ruang Kerja Masa Depan untuk Profesional & Tim
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Kami menghadirkan ekosistem coworking space modern dengan integrasi reservasi digital, koneksi fiber optik stabil, dan fasilitas lengkap untuk mendukung produktivitas kerja tanpa batas.
            </p>
          </div>
        </div>

        {/* 2 Main Locations Showcase */}
        <div className="space-y-6">
          <div className="text-left">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
              JARINGAN LOKASI
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Pilihan Lokasi Coworking Space
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Lokasi strategis di kawasan bisnis dan sentra kreatif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Location 1: Flagship */}
            <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group">
              <div className="h-56 overflow-hidden relative bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                  alt="Moklet Hub Coworking"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-xs">
                  📍 Flagship Hub
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0F382C] transition-colors">
                    Moklet Hub Coworking & Tech Lounge
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Jl. Danau Ranau No. 1, Sawojajar, Kota Malang
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Pusat workstation terpadu dengan fasilitas meeting room ber-AC, private pod, dan artisan coffee bar untuk memfasilitasi tim startup dan pelajar mandiri.
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>08.00 - 22.00 WIB</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/ruang')}
                    className="px-4 py-2 bg-[#0F382C] hover:bg-[#0b2b22] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Pesan Ruang
                  </button>
                </div>
              </div>
            </div>

            {/* Location 2: Executive Hub */}
            <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group">
              <div className="h-56 overflow-hidden relative bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80"
                  alt="Executive Hub"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-xs">
                  📍 Executive Hub
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0F382C] transition-colors">
                    Executive Suite & Conference Center
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Kawasan Bisnis Sudirman, Jakarta
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Ruang pertemuan korporat kapasitas hingga 20 orang dengan layar 4K Presentation Display dan soundproof akustik berstandar audio tinggi.
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>24 Jam (Akses Digital Pass)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/ruang')}
                    className="px-4 py-2 bg-[#0F382C] hover:bg-[#0b2b22] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Pesan Ruang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200/80 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Fasilitas Terpasang</h2>
            <p className="text-xs text-slate-500">Semua reservasi telah mencakup fasilitas utama di bawah ini.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0F382C] flex items-center justify-center mx-auto">
                <Wifi className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Fiber Optik 100Mbps</h4>
              <p className="text-[11px] text-slate-400">Dedicated low-latency connection</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0F382C] flex items-center justify-center mx-auto">
                <Coffee className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Coffee & Tea Pantry</h4>
              <p className="text-[11px] text-slate-400">Free flow minuman hangat</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0F382C] flex items-center justify-center mx-auto">
                <Tv className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">4K Presentation TV</h4>
              <p className="text-[11px] text-slate-400">Smart screen mirroring & HDMI</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0F382C] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Acoustic Soundproof</h4>
              <p className="text-[11px] text-slate-400">Peredam suara & privasi rapat</p>
            </div>
          </div>
        </div>

        {/* Contact & Support Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-extrabold text-slate-900">Butuh Informasi Seputar Sewa Ruangan?</h3>
            <p className="text-xs text-slate-500">Hubungi pengelola lokasi atau kunjungi langsung meja resepsionis kami.</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5"><PhoneCall className="w-4 h-4 text-emerald-600" /> 0812-9876-5432</span>
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-emerald-600" /> halo@coworking.sch.id</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/ruang')}
            className="px-6 py-3.5 bg-[#0F382C] hover:bg-[#0b2b22] text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <span>Mulai Reservasi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </MemberLayout>
  );
};

export default AboutPage;
