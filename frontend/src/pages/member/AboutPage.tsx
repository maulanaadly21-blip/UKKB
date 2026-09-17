import React from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MemberLayout>
      <div className="space-y-12 pb-16">
        {/* Header Banner - Studio Dark Hero */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-14 shadow-studio relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-5 z-10 relative">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-red-400 bg-red-950/80 px-4 py-1.5 rounded-full inline-flex items-center gap-2 border border-red-800/60 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              ABOUT STUDIO ELEVEN
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase leading-none text-white">
              INFASTRUKTUR <span className="text-red-500">KREATIF</span> MASA DEPAN
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              Studio Eleven menghadirkan ekosistem coworking space, workstation fleksibel, audio studio, dan executive boardrooms dengan konektivitas Dedicated Fiber 1Gbps di pusat distrik teknologi &amp; industri kreatif.
            </p>
          </div>
        </div>

        {/* 2 Main Locations Showcase */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 mb-1">- LOCATIONS</div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900 tracking-tight uppercase">
                STUDIO LOCATIONS &amp; HUBS
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500 hidden sm:inline">2 OPERATIONAL HUBS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Location 1: SCBD Flagship */}
            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-soft hover:shadow-studio transition-all duration-300 group">
              <div className="h-60 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                  alt="Studio Eleven SCBD Flagship"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-zinc-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-white border border-zinc-800">
                  🔴 FLAGSHIP HQ — SCBD
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-display font-extrabold text-zinc-900 group-hover:text-red-600 transition-colors uppercase">
                    STUDIO ELEVEN FLAGSHIP HQ
                  </h3>
                  <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-1">
                    <i className="fa-solid fa-location-dot text-red-500 text-xs"></i>
                    Jl. Jend. Sudirman No. 45, SCBD District, Jakarta Selatan
                  </p>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                  Hub flagship dengan view pencakar langit, artisan coffee bar free-flow, soundproof podcast pod, dan monitor color-calibrated 4K.
                </p>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
                    <i className="fa-solid fa-clock text-red-600 text-xs"></i>
                    <span>OPERASIONAL: 24/7 PASS</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/ruang')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-display font-bold uppercase tracking-wider shadow-red-glow transition-all cursor-pointer"
                  >
                    BOOSTER SCBD &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Location 2: Kuningan Branch */}
            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-soft hover:shadow-studio transition-all duration-300 group">
              <div className="h-60 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80"
                  alt="Kuningan Tech Hub"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-zinc-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-white border border-zinc-800">
                  📍 KUNINGAN CREATIVE HUB
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-display font-extrabold text-zinc-900 group-hover:text-red-600 transition-colors uppercase">
                    KUNINGAN TECH &amp; MEDIA SUITES
                  </h3>
                  <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-1">
                    <i className="fa-solid fa-location-dot text-red-500 text-xs"></i>
                    Jl. HR Rasuna Said No. 12, Kuningan, Jakarta Selatan
                  </p>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                  Pusat kolaborasi tim startup &amp; media kreatif dengan executive boardrooms berkapasitas hingga 20 orang dan private studio suite.
                </p>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
                    <i className="fa-solid fa-clock text-red-600 text-xs"></i>
                    <span>08.00 - 22.00 WIB</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/ruang')}
                    className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    BOOSTER KUNINGAN &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="bg-zinc-950 rounded-3xl p-8 sm:p-12 border border-zinc-800 space-y-8 text-white shadow-studio relative overflow-hidden">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500">- AMENITIES</span>
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight uppercase text-white">
              FASILITAS KLAS STUDIO
            </h2>
            <p className="text-xs text-zinc-400 font-medium">Setiap sesi pemesanan secara otomatis mencakup fasilitas standar tinggi di bawah ini.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 text-center space-y-3 hover:border-red-600/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center mx-auto border border-red-600/30">
                <i className="fa-solid fa-wifi text-xl"></i>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase">Fiber 1Gbps</h4>
              <p className="text-[11px] text-zinc-400">Koneksi dedicated low-latency &amp; dual backup WAN</p>
            </div>

            <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 text-center space-y-3 hover:border-red-600/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center mx-auto border border-red-600/30">
                <i className="fa-solid fa-mug-hot text-xl"></i>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase">Artisan Coffee</h4>
              <p className="text-[11px] text-zinc-400">Barista espresso machine &amp; organic teas</p>
            </div>

            <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 text-center space-y-3 hover:border-red-600/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center mx-auto border border-red-600/30">
                <i className="fa-solid fa-tv text-xl"></i>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase">4K Pro Displays</h4>
              <p className="text-[11px] text-zinc-400">Ultra-wide color screens &amp; wireless cast</p>
            </div>

            <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 text-center space-y-3 hover:border-red-600/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center mx-auto border border-red-600/30">
                <i className="fa-solid fa-shield-halved text-xl"></i>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase">Soundproof Pods</h4>
              <p className="text-[11px] text-zinc-400">Peredam suara akustik 45dB untuk panggilan &amp; studio</p>
            </div>
          </div>
        </div>

        {/* Contact & Support Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-3xl p-8 sm:p-10 shadow-red-glow flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-display font-black uppercase tracking-tight">BUTUH KONSULTASI LOKASI ATAU EVENT PRIVATE?</h3>
            <p className="text-xs text-red-100 font-medium">Tim pengelola Studio Eleven siap membantu reservasi skala besar atau tur lokasi.</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-2 text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5"><i className="fa-solid fa-phone text-xs"></i> 021-555-8899</span>
              <span className="flex items-center gap-1.5"><i className="fa-solid fa-envelope text-xs"></i> hello@studioeleven.id</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/ruang')}
            className="px-6 py-4 bg-zinc-950 hover:bg-black text-white rounded-2xl text-xs font-display font-bold uppercase tracking-wider flex items-center gap-2 shadow-studio transition-all shrink-0 cursor-pointer border border-zinc-800"
          >
            <span>RESERVASI SEKARANG</span>
            <i className="fa-solid fa-arrow-right text-red-500 text-xs"></i>
          </button>
        </div>
      </div>
    </MemberLayout>
  );
};

export default AboutPage;

