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
  ArrowRight
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MemberLayout>
      <div className="space-y-12 pb-12">
        {/* Header Banner */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1b4337] bg-emerald-50 px-3.5 py-1.5 rounded-full inline-block border border-emerald-200">
              Tentang Adly Wangsa SpaceHub
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Ruang Kerja Masa Depan untuk Komunitas Modern
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Adly Wangsa SpaceHub menghadirkan infrastruktur coworking space, workstation fleksibel, dan meeting room berstandar internasional dengan konektivitas fiber optik ultra-cepat di pusat bisnis Jakarta.
            </p>
          </div>
        </div>

        {/* 2 Main Locations Showcase */}
        <div className="space-y-6">
          <div className="text-left">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Lokasi Coworking Space Kami
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Dua lokasi strategis di pusat kawasan bisnis Jakarta Selatan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Location 1: SCBD */}
            <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group">
              <div className="h-56 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                  alt="Horizon Workspaces SCBD"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-xs">
                  📍 Headquarters SCBD
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#1b4337] transition-colors">
                    Horizon Workspaces & Creative Hub
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Jl. Jend. Sudirman No. 45, SCBD District, Jakarta Selatan
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Lokasi flagship dengan pemandangan pencakar langit Jakarta, dilengkapi fasilitas kopi artisan sepuasnya, monitor 4K, dan ruang podcast terisolasi suara.
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Operasional: 24 Jam (Keycard)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/ruang')}
                    className="px-4 py-2 bg-[#1b4337] hover:bg-[#14352b] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Pesan Ruang SCBD
                  </button>
                </div>
              </div>
            </div>

            {/* Location 2: Kuningan */}
            <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group">
              <div className="h-56 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80"
                  alt="Kuningan Tech Hub"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-xs">
                  📍 Kuningan Branch
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#1b4337] transition-colors">
                    Kuningan Tech Hub & Executive Suites
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Jl. HR Rasuna Said No. 12, Kuningan, Jakarta Selatan
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Hub ideal bagi startup dan tim profesional yang membutuhkan Executive Boardroom kapasitas hingga 12 orang dan Private Office Suite dengan akses LAN khusus.
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>08.00 - 22.00 WIB</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/ruang')}
                    className="px-4 py-2 bg-[#1b4337] hover:bg-[#14352b] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Pesan Ruang Kuningan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="bg-[#f8faf9] rounded-3xl p-8 sm:p-10 border border-slate-100 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Fasilitas Standar Internasional</h2>
            <p className="text-xs text-slate-500">Semua paket reservasi sudah termasuk fasilitas lengkap di bawah ini.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#1b4337] flex items-center justify-center mx-auto">
                <Wifi className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Fiber Wi-Fi 1Gbps</h4>
              <p className="text-[11px] text-slate-400">Koneksi dedicated low-latency</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#1b4337] flex items-center justify-center mx-auto">
                <Coffee className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Artisan Coffee & Tea</h4>
              <p className="text-[11px] text-slate-400">Pantry & free-flow beverages</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#1b4337] flex items-center justify-center mx-auto">
                <Tv className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Display Monitor 4K</h4>
              <p className="text-[11px] text-slate-400">Screen sharing & video conf</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#1b4337] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Acoustic Soundproof</h4>
              <p className="text-[11px] text-slate-400">Privasi rapat & podcast pod</p>
            </div>
          </div>
        </div>

        {/* Contact & Support Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-extrabold text-slate-900">Butuh Informasi Bantuan atau Pertanyaan?</h3>
            <p className="text-xs text-slate-500">Tim pengelola lokasi kami siap memberikan layanan pendampingan reservasi.</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5"><PhoneCall className="w-4 h-4 text-emerald-600" /> 021-555-8899</span>
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-emerald-600" /> support@adlywangsa.id</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/ruang')}
            className="px-6 py-3.5 bg-[#1b4337] hover:bg-[#14352b] text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <span>Pesan Ruangan Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </MemberLayout>
  );
};

export default AboutPage;
