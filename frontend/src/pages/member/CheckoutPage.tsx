import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Space, PromoDiskon } from '../../types';
import {
  Calendar,
  Clock,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Users,
  Hourglass,
  Lock,
  ArrowRight,
  Wifi,
  Coffee,
  Tv
} from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  const queryDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State
  const [namaLengkap, setNamaLengkap] = useState<string>(user?.nama || 'Bambang Wicaksono');
  const [emailBisnis, setEmailBisnis] = useState<string>(user?.email || 'bambang.w@company.id');
  const [whatsapp, setWhatsapp] = useState<string>(user?.telp || '+62 812 9876 5432');
  const [instansi, setInstansi] = useState<string>('PT Solusi Digital Nusantara');

  const [tanggalPemakaian, setTanggalPemakaian] = useState<string>(queryDate);
  const [waktuMulai, setWaktuMulai] = useState<string>('10:00');
  const [durasiPilihan, setDurasiPilihan] = useState<number>(2); // 1, 2, 3, 8
  const [jumlahPeserta, setJumlahPeserta] = useState<number>(6);
  const [catatan, setCatatan] = useState<string>('Siapkan kabel converter HDMI to Type-C dan proyektor tambahan.');

  const [kodePromo, setKodePromo] = useState<string>('SMARTWORK20');
  const [appliedPromo, setAppliedPromo] = useState<Partial<PromoDiskon> | null>({ nama_diskon: 'SMARTWORK20', persentase_diskon: 20 });
  const [metodePembayaran, setMetodePembayaran] = useState<string>('qris');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const res = await api.get(`/spaces/${spaceId}`);
        if (res.data && res.data.status) {
          setSpace(res.data.data);
        }
      } catch {
        showError('Ruangan tidak ditemukan');
        navigate('/ruang');
      } finally {
        setLoading(false);
      }
    };
    if (spaceId) {
      fetchSpace();
    }
  }, [spaceId, navigate, showError]);

  const hargaPerJam = space ? space.harga_per_jam : 200000;
  const tarifDasar = hargaPerJam * durasiPilihan;
  const potonganDiskon = appliedPromo && appliedPromo.persentase_diskon ? (tarifDasar * appliedPromo.persentase_diskon) / 100 : 0;
  const ppn = Math.round((tarifDasar - potonganDiskon) * 0.11);
  const totalPembayaran = Math.max(0, tarifDasar - potonganDiskon + ppn);

  const handleApplyPromo = async () => {
    if (!kodePromo.trim()) return;
    try {
      const res = await api.post('/diskon/check', { nama_diskon: kodePromo.trim() });
      if (res.data && res.data.status) {
        setAppliedPromo(res.data.data);
        showSuccess(`Voucher ${res.data.data.nama_diskon} berhasil dipasang!`);
      }
    } catch (err: any) {
      showError(err.response?.data?.message || 'Kode promo tidak valid');
      setAppliedPromo(null);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      showError('Anda harus menyetujui Syarat & Ketentuan terlebih dahulu');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        id_space: Number(spaceId),
        tanggal_reservasi: tanggalPemakaian,
        jam_mulai: waktuMulai,
        durasi_jam: Number(durasiPilihan),
        kode_promo: appliedPromo ? appliedPromo.nama_diskon : null
      };

      const res = await api.post('/reservasi', payload);
      if (res.data && res.data.status) {
        showSuccess('Reservasi berhasil dibuat! Mengalihkan ke E-Ticket...');
        navigate('/reservations');
      }
    } catch (err: any) {
      showError(err.response?.data?.message || 'Gagal membuat reservasi');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MemberLayout>
        <div className="max-w-6xl mx-auto py-12 text-center text-slate-500 font-medium">
          Memuat rincian pemesanan...
        </div>
      </MemberLayout>
    );
  }

  const spaceName = space?.nama_space || space?.nama_ruangan || 'Glasshouse Meeting Room';
  const spaceLocation = space?.nama_coworking || 'SCBD Tower Lt. 4, Jakarta Selatan';

  return (
    <MemberLayout>
      <div className="max-w-6xl mx-auto space-y-8 -mt-2 pb-16">
        {/* Header Breadcrumb & Step Progress Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link to="/" className="hover:text-slate-600">Beranda</Link>
              <span>&gt;</span>
              <Link to="/ruang" className="hover:text-slate-600">{spaceName}</Link>
              <span>&gt;</span>
              <span className="text-[#0F382C] font-bold">Reservasi</span>
            </div>
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-slate-400 block">
              LANGKAH VERIFIKASI
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Konfirmasi & Rincian Reservasi
            </h1>
          </div>

          {/* 3 Step Progress Pills */}
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F382C]">
              <span className="w-6 h-6 rounded-full bg-[#0F382C] text-white flex items-center justify-center text-[11px]">
                1
              </span>
              <span>Detail Pesanan</span>
            </div>
            <span className="text-slate-300">──</span>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[11px]">
                2
              </span>
              <span>Pembayaran</span>
            </div>
            <span className="text-slate-300">──</span>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[11px]">
                3
              </span>
              <span>E-Ticket</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: FORM SECTIONS ================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Guarantee Alert */}
            <div className="bg-[#E6F4F1] border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-[#0F382C] font-medium">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold block">Ketersediaan Terjamin</strong>
                Slot ruang {spaceName} disimpan khusus untuk Anda selama 15 menit ke depan.
              </div>
            </div>

            {/* Section 1: Informasi Pemesan */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0F382C]" /> Informasi Pemesan
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Profil Utama</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nama Lengkap*</label>
                  <input
                    type="text"
                    required
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F382C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Alamat Email Bisnis*</label>
                  <input
                    type="email"
                    required
                    value={emailBisnis}
                    onChange={(e) => setEmailBisnis(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F382C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nomor WhatsApp Aktif*</label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F382C]"
                  />
                  <p className="text-[10px] text-slate-400">E-Ticket dan QR check-in akan dikirim ke nomor ini.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Instansi / Perusahaan</label>
                  <input
                    type="text"
                    value={instansi}
                    onChange={(e) => setInstansi(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F382C]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Detail Jadwal & Waktu */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0F382C]" /> Detail Jadwal & Waktu
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6F4F1] text-[#0F382C]">
                  • Tersedia
                </span>
              </div>

              {/* Ruang Dipilih Box */}
              <div className="bg-[#E6F4F1]/60 border border-emerald-200/60 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Ruang Dipilih</span>
                  <p className="text-xs font-black text-slate-900">{spaceName} (SCBD Tower)</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200">
                  Lantai-4
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tanggal Pemakaian</label>
                  <input
                    type="date"
                    value={tanggalPemakaian}
                    onChange={(e) => setTanggalPemakaian(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F382C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Waktu Mulai</label>
                  <input
                    type="time"
                    value={waktuMulai}
                    onChange={(e) => setWaktuMulai(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F382C]"
                  />
                </div>
              </div>

              {/* Durasi Pemakaian Pills */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Durasi Pemakaian</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { hours: 1, label: '1 Jam', sub: 'Sewa Kilat' },
                    { hours: 2, label: '2 Jam', sub: 'Rapat Standar' },
                    { hours: 3, label: '3 Jam', sub: 'Workshop Tim' },
                    { hours: 8, label: 'Seharian', sub: 'Full Day (8 Jam)' }
                  ].map((dur) => (
                    <button
                      key={dur.hours}
                      type="button"
                      onClick={() => setDurasiPilihan(dur.hours)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        durasiPilihan === dur.hours
                          ? 'bg-[#0F382C] text-white border-[#0F382C] shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-xs font-black">{dur.label}</p>
                      <p className={`text-[10px] ${durasiPilihan === dur.hours ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {dur.sub}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimasi Selesai & Stepper Peserta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Estimasi Selesai</span>
                    <p className="text-sm font-black text-slate-900">12:00 WIB</p>
                  </div>
                  <Hourglass className="w-5 h-5 text-slate-400" />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Jumlah Peserta</span>
                    <div className="flex items-center gap-3 mt-0.5">
                      <button
                        type="button"
                        onClick={() => setJumlahPeserta(Math.max(1, jumlahPeserta - 1))}
                        className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-slate-900">{jumlahPeserta} Orang</span>
                      <button
                        type="button"
                        onClick={() => setJumlahPeserta(Math.min(8, jumlahPeserta + 1))}
                        className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Kapasitas Maks. 8</span>
                </div>
              </div>
            </div>

            {/* Section 3: Catatan Tambahan */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900">Catatan Tambahan</h3>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Opsional</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Kebutuhan spesifik, perlengkapan AV, atau preferensi susunan meja:
              </p>
              <textarea
                rows={3}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Siapkan kabel converter HDMI to Type-C dan proyektor tambahan."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0F382C]"
              ></textarea>
            </div>

            {/* Section 4: Kode Promo & Voucher */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#0F382C]" /> Kode Promo & Voucher
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={kodePromo}
                  onChange={(e) => setKodePromo(e.target.value.toUpperCase())}
                  placeholder="SMARTWORK20"
                  className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:outline-none focus:border-[#0F382C]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-6 py-3 bg-[#0F382C] hover:bg-[#0b2b22] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Terapkan
                </button>
              </div>

              {appliedPromo && (
                <div className="bg-[#E6F4F1] border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-xs font-bold text-[#0F382C]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Promo hemat 20% berhasil dipasang! (Hemat Rp {potonganDiskon.toLocaleString('id-ID')})</span>
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: STICKY SUMMARY CARD ================= */}
          <div className="lg:col-span-5 space-y-4 sticky top-24">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xl space-y-5">
              {/* Space Header */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  <img
                    src={space?.foto_url || 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80'}
                    alt={spaceName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    EXECUTIVE SUITE
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">{spaceName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{spaceLocation}</p>
                </div>
              </div>

              {/* Date Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Rabu, 15 Jan 2025
                </span>
                <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  10:00 - 12:00 WIB
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs border-t border-b border-slate-100 py-4">
                <div className="flex justify-between text-slate-600">
                  <span>Tarif Dasar (Rp {hargaPerJam.toLocaleString('id-ID')} x {durasiPilihan} jam)</span>
                  <span className="font-bold text-slate-900">Rp {tarifDasar.toLocaleString('id-ID')}</span>
                </div>

                {potonganDiskon > 0 && (
                  <div className="flex justify-between items-center text-emerald-800 font-bold">
                    <span className="flex items-center gap-1">
                      Diskon Promo <span className="bg-emerald-100 text-[#0F382C] px-1.5 py-0.5 rounded text-[10px] font-mono">SMARTWORK20</span>
                    </span>
                    <span>- Rp {potonganDiskon.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Biaya Layanan & Pemeliharaan</span>
                  <span className="font-bold text-emerald-700">Rp 0 (Gratis)</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>PPN (11%)</span>
                  <span className="font-bold text-slate-900">Rp {ppn.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Total Pembayaran */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Total Pembayaran</span>
                  <span className="text-[10px] text-slate-400 font-medium">Termasuk pajak & layanan</span>
                </div>
                <p className="text-2xl font-black text-[#0F382C]">
                  Rp {totalPembayaran.toLocaleString('id-ID')}
                </p>
              </div>

              {/* Metode Pembayaran Options */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">Pilih Metode Pembayaran</label>
                
                <div className="space-y-2">
                  <label
                    onClick={() => setMetodePembayaran('qris')}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      metodePembayaran === 'qris'
                        ? 'bg-[#E6F4F1]/60 border-[#0F382C] text-[#0F382C]'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={metodePembayaran === 'qris'} readOnly className="accent-[#0F382C]" />
                      <span>QRIS Instan (GoPay, OVO, BCA, Dana)</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#0F382C]">Cepat</span>
                  </label>

                  <label
                    onClick={() => setMetodePembayaran('va')}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      metodePembayaran === 'va'
                        ? 'bg-[#E6F4F1]/60 border-[#0F382C] text-[#0F382C]'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={metodePembayaran === 'va'} readOnly className="accent-[#0F382C]" />
                      <span>Virtual Account (BCA / Mandiri / BNI)</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setMetodePembayaran('card')}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      metodePembayaran === 'card'
                        ? 'bg-[#E6F4F1]/60 border-[#0F382C] text-[#0F382C]'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={metodePembayaran === 'card'} readOnly className="accent-[#0F382C]" />
                      <span>Kartu Kredit / Debit Visa & Mastercard</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Checkbox Terms */}
              <div className="pt-2 flex items-start gap-2.5 text-xs text-slate-600">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 accent-[#0F382C] rounded cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="cursor-pointer text-[11px] leading-tight">
                  Saya menyetujui Syarat & Ketentuan serta Tata Tertib Ruang Kerja Smart Space.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#0F382C] hover:bg-[#0b2b22] text-white rounded-xl font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{submitting ? 'Memproses Reservasi...' : 'Konfirmasi & Bayar Sekarang'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Transaksi dienkripsi secara aman & garansi uang kembali.
              </p>
            </div>

            {/* 3 Badges below card */}
            <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-600 text-center">
              <div className="bg-slate-100 rounded-xl p-2 flex flex-col items-center justify-center gap-1">
                <Wifi className="w-4 h-4 text-slate-500" />
                <span>High-Speed 100Mbps</span>
              </div>
              <div className="bg-slate-100 rounded-xl p-2 flex flex-col items-center justify-center gap-1">
                <Coffee className="w-4 h-4 text-slate-500" />
                <span>Free Flow Espresso</span>
              </div>
              <div className="bg-slate-100 rounded-xl p-2 flex flex-col items-center justify-center gap-1">
                <Tv className="w-4 h-4 text-slate-500" />
                <span>4K Presentation Display</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </MemberLayout>
  );
};

export default CheckoutPage;
