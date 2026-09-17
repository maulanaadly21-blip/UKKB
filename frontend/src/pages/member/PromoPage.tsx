import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';
import { Discount } from '../../types';

const PromoPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess } = useNotification();
  const [promos, setPromos] = useState<Discount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromos = async () => {
      setLoading(true);
      try {
        const res = await api.get('/diskon');
        if (res.data && res.data.status) {
          setPromos(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch promo list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showSuccess(`Kode promo "${code}" berhasil disalin!`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  const handleUsePromo = (code: string) => {
    handleCopyCode(code);
    navigate('/ruang');
  };

  const displayPromos: any[] = promos.length > 0 ? promos : [
    {
      id: 1,
      kode_promo: 'PROMOCOWORKING',
      persen_diskon: 20,
      minimal_durasi_jam: 2,
      tanggal_mulai: '2026-09-01',
      tanggal_berakhir: '2026-10-30',
      kuota: 50,
      status: 'aktif',
      nama_coworking: 'Studio Eleven Flagship SCBD'
    },
    {
      id: 2,
      kode_promo: 'STUDIOBOOST20',
      persen_diskon: 15,
      minimal_durasi_jam: 1,
      tanggal_mulai: '2026-09-01',
      tanggal_berakhir: '2026-10-30',
      kuota: 100,
      status: 'aktif',
      nama_coworking: 'Kuningan Creative Hub'
    },
    {
      id: 3,
      kode_promo: 'CREATIVEVIP30',
      persen_diskon: 30,
      minimal_durasi_jam: 3,
      tanggal_mulai: '2026-09-01',
      tanggal_berakhir: '2026-10-30',
      kuota: 25,
      status: 'aktif',
      nama_coworking: 'Studio Eleven Flagship SCBD'
    }
  ];

  return (
    <MemberLayout>
      <div className="space-y-10 pb-16">
        {/* Header Banner - Dark Studio Theme */}
        <div className="bg-zinc-950 rounded-3xl p-8 sm:p-14 text-white shadow-studio relative overflow-hidden border border-zinc-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-red-400 bg-red-950/80 border border-red-800/60 px-3.5 py-1.5 rounded-full inline-flex items-center gap-2">
              <i className="fa-solid fa-tag text-red-500 text-xs"></i>
              STUDIO PROMO &amp; VOUCHER PASS
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase leading-none">
              DAPATKAN <span className="text-red-500">DISKON</span> SPESIAL
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
              Gunakan kode voucher aktif di bawah ini saat checkout untuk mendapatkan potongan harga hingga 30% untuk seluruh workstation, audio pods, &amp; executive boardrooms.
            </p>
          </div>
        </div>

        {/* Promo Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest mb-1">- ACTIVE VOUCHERS</div>
              <h2 className="text-2xl font-display font-extrabold text-zinc-900 uppercase">
                VOUCHER POPULER ({displayPromos.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500 hidden sm:inline">KLIK SALIN UNTUK GUNAKAN VOUCHER</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-zinc-100 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayPromos.map((promo) => {
                const code = promo.kode_promo || promo.nama_diskon || '';
                const pct = promo.persen_diskon || promo.persentase_diskon || 20;
                return (
                  <div
                    key={promo.id}
                    className="bg-white border border-zinc-200/90 hover:border-zinc-300 rounded-3xl p-6 shadow-soft hover:shadow-studio transition-all duration-300 flex flex-col justify-between space-y-5 group relative overflow-hidden"
                  >
                    {/* Top Discount Tag */}
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 text-white flex flex-col items-center justify-center font-display font-black text-xl shadow-studio">
                        <span className="text-red-500 text-lg leading-none">{pct}%</span>
                        <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">OFF</span>
                      </div>
                      <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] uppercase font-mono font-bold px-3 py-1 rounded-full">
                        HEMAT {pct}%
                      </span>
                    </div>

                    {/* Promo Details */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                        {promo.nama_coworking || 'STUDIO ELEVEN WORKSPACES'}
                      </p>
                      <h3 className="text-lg font-display font-extrabold text-zinc-900 uppercase group-hover:text-red-600 transition-colors">
                        DISKON {pct}% SESI WORKSPACE
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 font-medium pt-1">
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-clock text-red-500 text-xs"></i> Min. {promo.minimal_durasi_jam || 1} Jam
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <i className="fa-solid fa-calendar text-red-500 text-xs"></i> s/d {promo.tanggal_berakhir || promo.tanggal_akhir || '2026-12-31'}
                        </span>
                      </div>
                    </div>

                    {/* Voucher Code Box */}
                    <div className="pt-4 border-t border-zinc-100 space-y-3">
                      <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-2xl p-2.5">
                        <span className="font-mono font-bold text-sm text-white px-2 tracking-wider">
                          {code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(code)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer shadow-red-glow"
                        >
                          {copiedCode === code ? (
                            <>
                              <i className="fa-solid fa-check text-xs text-white"></i>
                              <span>TERSALIN</span>
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-copy text-xs"></i>
                              <span>SALIN</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUsePromo(code)}
                        className="w-full py-3 bg-zinc-950 hover:bg-black text-white rounded-2xl text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer border border-zinc-800"
                      >
                        <span>GUNAKAN PROMO INI</span>
                        <i className="fa-solid fa-arrow-right text-red-500 text-xs"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Benefits Info Box */}
        <div className="bg-zinc-950 text-white rounded-3xl p-8 border border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-studio">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-red-500 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-bolt text-red-500 text-xl"></i>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-display font-bold uppercase">Potongan Otomatis</h4>
              <p className="text-xs text-zinc-400 font-medium">Kalkulasi diskon instan saat checkout tanpa prosedur berbelit.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-red-500 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-shield-halved text-red-500 text-xl"></i>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-display font-bold uppercase">Garansi Tanpa Biaya Tersembunyi</h4>
              <p className="text-xs text-zinc-400 font-medium">Harga nett transparan sesuai dengan pilihan jam yang dipesan.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-red-500 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-gift text-red-500 text-xl"></i>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-display font-bold uppercase">Reward Member Pass</h4>
              <p className="text-xs text-zinc-400 font-medium">Dapatkan status priority pass untuk tiap reservasi berulang.</p>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default PromoPage;

