import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';
import {
  Copy,
  Check,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
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
    showSuccess(`Kode promo "${code}" berhasil disalin ke clipboard!`);
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
      nama_coworking: 'Horizon Workspaces & SCBD Hub'
    },
    {
      id: 2,
      kode_promo: 'HEBATSAMPAI20',
      persen_diskon: 15,
      minimal_durasi_jam: 1,
      tanggal_mulai: '2026-09-01',
      tanggal_berakhir: '2026-10-30',
      kuota: 100,
      status: 'aktif',
      nama_coworking: 'Kuningan Tech Hub'
    },
    {
      id: 3,
      kode_promo: 'WELCOMEVIP',
      persen_diskon: 30,
      minimal_durasi_jam: 3,
      tanggal_mulai: '2026-09-01',
      tanggal_berakhir: '2026-10-30',
      kuota: 25,
      status: 'aktif',
      nama_coworking: 'Horizon Workspaces SCBD'
    }
  ];

  return (
    <MemberLayout>
      <div className="space-y-10 pb-12">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-1.5 rounded-full inline-block backdrop-blur-md">
              Voucher & Promo Hemat
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Hemat Pemesanan Ruang Kerja Anda
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Gunakan kode promo khusus di bawah ini untuk mendapatkan potongan harga hingga 30% pada reservasi Dedicated Desk, Meeting Room, dan Private Office.
            </p>
          </div>
        </div>

        {/* Promo Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">
              Voucher Aktif Terpopuler ({displayPromos.length})
            </h2>
            <span className="text-xs text-slate-500">
              Salin kode & gunakan saat checkout
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
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
                    className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden"
                  >
                    {/* Top Discount Tag */}
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#1b4337] flex items-center justify-center font-extrabold text-lg">
                        {pct}%
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                        Hemat {pct}%
                      </span>
                    </div>

                    {/* Promo Details */}
                    <div className="space-y-2">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        {promo.nama_coworking || 'Adly Wangsa Workspaces'}
                      </p>
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#1b4337] transition-colors">
                        Diskon {pct}% Khusus Reservasi
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> Min. {promo.minimal_durasi_jam || 1} Jam
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> S/d {promo.tanggal_berakhir || promo.tanggal_akhir || '2026-12-31'}
                        </span>
                      </div>
                    </div>

                    {/* Voucher Code Box */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between bg-slate-50 border border-dashed border-slate-300 rounded-xl p-2.5">
                        <span className="font-mono font-bold text-sm text-[#1b4337] px-2">
                          {code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(code)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedCode === code ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUsePromo(code)}
                        className="w-full py-2.5 bg-[#1b4337] hover:bg-[#14352b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                      >
                        <span>Gunakan Promo Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Benefits Info Box */}
        <div className="bg-[#f8faf9] rounded-3xl p-8 border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#1b4337] shadow-xs flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Potongan Otomatis</h4>
              <p className="text-xs text-slate-500 mt-0.5">Diskon terhitung otomatis pada rincian total bayar.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#1b4337] shadow-xs flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Tanpa Biaya Tersembunyi</h4>
              <p className="text-xs text-slate-500 mt-0.5">Harga transparan sesuai kontrak jam yang dipilih.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#1b4337] shadow-xs flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Bonus Poin Member</h4>
              <p className="text-xs text-slate-500 mt-0.5">Dapatkan poin reward setiap kali menyelesaikan reservasi.</p>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default PromoPage;
