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
  Zap,
  Tag
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
        const res = await api.get('/diskon/active');
        if (res.data && (res.data.status || res.data.statusCode === 200)) {
          setPromos(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch active promos:', err);
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

  const displayPromos: Discount[] = promos.length > 0 ? promos : [
    {
      id: 1,
      nama_diskon: 'PROMOAGUSTUS',
      persentase_diskon: 20,
      tanggal_awal: '2026-08-01T00:00:00Z',
      tanggal_akhir: '2026-12-31T23:59:59Z'
    },
    {
      id: 2,
      nama_diskon: 'DISKONHEMAT20',
      persentase_diskon: 20,
      tanggal_awal: '2026-08-01T00:00:00Z',
      tanggal_akhir: '2026-12-31T23:59:59Z'
    },
    {
      id: 3,
      nama_diskon: 'SMARTWORK15',
      persentase_diskon: 15,
      tanggal_awal: '2026-08-01T00:00:00Z',
      tanggal_akhir: '2026-12-31T23:59:59Z'
    }
  ];

  return (
    <MemberLayout>
      <div className="space-y-10 pb-12">
        {/* Header Banner */}
        <div className="bg-[#0F382C] rounded-3xl p-8 sm:p-12 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300 bg-white/10 px-3.5 py-1.5 rounded-full inline-block backdrop-blur-md">
              Voucher & Promo Hemat
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Katalog Promo & Potongan Diskon
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
              Gunakan kode voucher aktif saat checkout untuk menikmati potongan harga langsung pada reservasi Personal Desk, Meeting Room, dan Private Office.
            </p>
          </div>
        </div>

        {/* Promo Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#0F382C]" /> Voucher Aktif ({displayPromos.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Salin kode & pasang saat reservasi
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayPromos.map((promo) => {
                const code = promo.nama_diskon || promo.kode_promo || 'PROMO';
                const pct = promo.persentase_diskon || promo.persen_diskon || 20;
                const dateStart = promo.tanggal_awal ? new Date(promo.tanggal_awal).toLocaleDateString('id-ID') : (promo.tanggal_mulai || '-');
                const dateEnd = promo.tanggal_akhir ? new Date(promo.tanggal_akhir).toLocaleDateString('id-ID') : (promo.tanggal_berakhir || '-');

                return (
                  <div
                    key={promo.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden"
                  >
                    {/* Top Discount Tag */}
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#E6F4F1] border border-emerald-200 text-[#0F382C] flex items-center justify-center font-extrabold text-lg">
                        {pct}%
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                        Potongan {pct}%
                      </span>
                    </div>

                    {/* Promo Details */}
                    <div className="space-y-2">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        Coworking Space Promo
                      </p>
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0F382C] transition-colors">
                        Hemat {pct}% untuk Semua Tipe Ruang
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> Berlaku s/d {dateEnd}
                        </span>
                      </div>
                    </div>

                    {/* Voucher Code Box */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between bg-slate-50 border border-dashed border-slate-300 rounded-xl p-2.5">
                        <span className="font-mono font-bold text-sm text-[#0F382C] px-2">
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
                        className="w-full py-2.5 bg-[#0F382C] hover:bg-[#0b2b22] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                      >
                        <span>Gunakan Kode Ini</span>
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
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#0F382C] shadow-2xs border border-slate-200 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Potongan Otomatis</h4>
              <p className="text-xs text-slate-500 mt-0.5">Diskon terhitung langsung saat Anda memasukkan kode di form reservasi.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#0F382C] shadow-2xs border border-slate-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Harga Transparan</h4>
              <p className="text-xs text-slate-500 mt-0.5">Rincian harga awal, potongan promo, dan total bayar tertera jelas.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#0F382C] shadow-2xs border border-slate-200 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Multi-Lokasi</h4>
              <p className="text-xs text-slate-500 mt-0.5">Voucher dapat digunakan di seluruh meja & ruangan coworking yang tersedia.</p>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default PromoPage;
