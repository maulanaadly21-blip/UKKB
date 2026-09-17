import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import MemberLayout from '../../components/layout/MemberLayout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { getImageUrl } from '../../utils/image';
import { Space, Discount } from '../../types';
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
  Tv,
  Building,
  Sparkles,
  CreditCard,
  QrCode
} from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  const queryDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const queryStart = searchParams.get('start') || '09:00';
  const queryDuration = parseInt(searchParams.get('duration') || '2', 10);

  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State
  const [namaLengkap, setNamaLengkap] = useState<string>(user?.nama || user?.nama_member || '');
  const [emailBisnis, setEmailBisnis] = useState<string>(user?.email || '');
  const [whatsapp, setWhatsapp] = useState<string>(user?.telp || user?.no_hp || '');
  const [instansi, setInstansi] = useState<string>(user?.member?.instansi || '');

  const [tanggalPemakaian, setTanggalPemakaian] = useState<string>(queryDate);
  const [waktuMulai, setWaktuMulai] = useState<string>(queryStart);
  const [durasiPilihan, setDurasiPilihan] = useState<number>(queryDuration || 2);
  const [catatan, setCatatan] = useState<string>('');

  const [kodePromo, setKodePromo] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<Discount | null>(null);
  const [checkingPromo, setCheckingPromo] = useState<boolean>(false);
  const [metodePembayaran, setMetodePembayaran] = useState<string>('qris');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      if (!namaLengkap) setNamaLengkap(user.nama || user.nama_member || user.username);
      if (!emailBisnis) setEmailBisnis(user.email || '');
      if (!whatsapp) setWhatsapp(user.telp || user.no_hp || '');
      if (!instansi && user.member?.instansi) setInstansi(user.member.instansi);
    }
  }, [user]);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const res = await api.get(`/spaces/${spaceId}`);
        if (res.data && (res.data.status || res.data.statusCode === 200)) {
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

  const hargaPerJam = space ? space.harga_per_jam : 25000;
  const tarifDasar = hargaPerJam * durasiPilihan;
  const persenDiskon = appliedPromo ? (appliedPromo.persentase_diskon || appliedPromo.persen_diskon || 0) : 0;
  const potonganDiskon = Math.round((tarifDasar * persenDiskon) / 100);
  const totalPembayaran = Math.max(0, tarifDasar - potonganDiskon);

  // Calculate End Time
  const calculateEndTime = () => {
    const [h, m] = waktuMulai.split(':').map(Number);
    const endH = (h + durasiPilihan) % 24;
    return `${String(endH).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;
  };

  const handleApplyPromo = async () => {
    if (!kodePromo.trim()) return;
    setCheckingPromo(true);
    try {
      const res = await api.post('/diskon/check', { nama_diskon: kodePromo.trim().toUpperCase() });
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        const diskonObj = res.data.data?.diskon || res.data.data;
        setAppliedPromo(diskonObj);
        const discountPct = diskonObj.persentase_diskon || diskonObj.persen_diskon || 0;
        showSuccess(`Voucher ${diskonObj.nama_diskon || kodePromo} (${discountPct}%) berhasil dipasang!`);
      } else {
        throw new Error(res.data?.message || 'Kode promo tidak valid');
      }
    } catch (err: any) {
      showError(err.response?.data?.message || err.message || 'Kode promo tidak valid atau telah kedaluwarsa');
      setAppliedPromo(null);
    } finally {
      setCheckingPromo(false);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      showError('Harap setujui Syarat & Ketentuan reservasi');
      return;
    }
    setSubmitting(true);
    try {
      const payload: any = {
        id_space: Number(spaceId),
        tanggal_reservasi: tanggalPemakaian,
        jam_mulai: waktuMulai,
        durasi_jam: Number(durasiPilihan)
      };

      if (appliedPromo) {
        if (appliedPromo.id) payload.id_diskon = appliedPromo.id;
        if (appliedPromo.nama_diskon || appliedPromo.kode_promo) {
          payload.kode_promo = appliedPromo.nama_diskon || appliedPromo.kode_promo;
        }
      }

      const res = await api.post('/reservasi', payload);
      if (res.data && (res.data.status || res.data.statusCode === 201 || res.data.statusCode === 200)) {
        // Burst celebratory confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if canvas confetti fails
        }

        showSuccess('Pemesanan berhasil dikonfirmasi! Tiket & QR Code Anda telah aktif.');
        navigate('/reservations');
      } else {
        throw new Error(res.data?.message || 'Gagal membuat reservasi');
      }
    } catch (err: any) {
      showError(err.response?.data?.message || err.message || 'Gagal membuat reservasi. Pastikan jadwal tidak bentrok.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MemberLayout>
        <div className="max-w-6xl mx-auto py-16 text-center text-slate-500 font-medium">
          Memuat rincian pemesanan...
        </div>
      </MemberLayout>
    );
  }

  const spaceName = space?.nama_space || space?.nama_ruangan || 'Workspace';
  const spaceLocation = space?.nama_coworking || 'Moklet Hub Coworking';
  const spaceThumb = getImageUrl(space?.foto_url || space?.foto || space?.foto_ruangan, 'spaces') ||
    'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80';

  return (
    <MemberLayout>
      <div className="max-w-6xl mx-auto space-y-8 -mt-2 pb-16">
        {/* Header Breadcrumb & Step Progress Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b border-slate-200/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link to="/" className="hover:text-slate-600">Beranda</Link>
              <span>&gt;</span>
              <Link to="/ruang" className="hover:text-slate-600">{spaceName}</Link>
              <span>&gt;</span>
              <span className="text-[#0F382C] font-bold">Konfirmasi Reservasi</span>
            </div>
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#0F382C] block">
              FINALISASI PEMESANAN
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Rincian & Pembayaran Reservasi
            </h1>
          </div>

          {/* 3 Step Progress Pills */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs text-xs font-bold">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">
                ✓
              </span>
              <span>Pilih Ruang</span>
            </div>
            <span className="text-slate-300">──</span>
            <div className="flex items-center gap-1.5 text-[#0F382C]">
              <span className="w-5 h-5 rounded-full bg-[#0F382C] text-white flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Konfirmasi</span>
            </div>
            <span className="text-slate-300">──</span>
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">
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
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-700" />
              <div>
                <strong className="font-extrabold block text-slate-900">Slot Ruangan Dijamin</strong>
                Reservasi terhubung langsung dengan sistem ketersediaan coworking space secara real-time.
              </div>
            </div>

            {/* Section 1: Informasi Pemesan */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0F382C]" /> Informasi Pemesan
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Data Pelanggan</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nama Lengkap*</label>
                  <input
                    type="text"
                    required
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    placeholder="Nama pemesan"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F382C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Akun*</label>
                  <input
                    type="email"
                    required
                    value={emailBisnis}
                    onChange={(e) => setEmailBisnis(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F382C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nomor Telepon / WhatsApp*</label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="081234567890"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F382C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Instansi / Organisasi</label>
                  <input
                    type="text"
                    value={instansi}
                    onChange={(e) => setInstansi(e.target.value)}
                    placeholder="e.g. SMK Telkom / PT Maju"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F382C]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Jadwal & Waktu */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0F382C]" /> Detail Jadwal & Waktu
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6F4F1] text-[#0F382C]">
                  • Terpilih
                </span>
              </div>

              {/* Ruang Dipilih Box */}
              <div className="bg-[#E6F4F1]/60 border border-emerald-200/60 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Ruang Dipilih</span>
                  <p className="text-xs font-black text-slate-900">{spaceName} ({spaceLocation})</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200 uppercase">
                  {space?.tipe || 'desk'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tanggal Reservasi</label>
                  <input
                    type="date"
                    required
                    value={tanggalPemakaian}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setTanggalPemakaian(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F382C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Waktu Mulai</label>
                  <select
                    value={waktuMulai}
                    onChange={(e) => setWaktuMulai(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F382C]"
                  >
                    <option value="08:00">08:00 WIB</option>
                    <option value="09:00">09:00 WIB</option>
                    <option value="10:00">10:00 WIB</option>
                    <option value="11:00">11:00 WIB</option>
                    <option value="13:00">13:00 WIB</option>
                    <option value="14:00">14:00 WIB</option>
                    <option value="15:00">15:00 WIB</option>
                    <option value="18:00">18:00 WIB</option>
                  </select>
                </div>
              </div>

              {/* Durasi Pemakaian Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Durasi Pemakaian</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { hours: 1, label: '1 Jam', sub: 'Sewa Kilat' },
                    { hours: 2, label: '2 Jam', sub: 'Rapat / Kerja' },
                    { hours: 4, label: '4 Jam', sub: 'Setengah Hari' },
                    { hours: 8, label: '8 Jam', sub: 'Full Day' }
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

              {/* Estimasi Selesai Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Estimasi Jadwal Selesai</span>
                  <p className="text-sm font-black text-slate-900">{calculateEndTime()} WIB</p>
                </div>
                <Hourglass className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* Section 3: Kode Promo & Diskon */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#0F382C]" /> Kode Promo & Diskon
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={kodePromo}
                  onChange={(e) => setKodePromo(e.target.value.toUpperCase())}
                  placeholder="Contoh: PROMOAGUSTUS"
                  className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:outline-none focus:border-[#0F382C]"
                />
                <button
                  type="button"
                  disabled={checkingPromo || !kodePromo.trim()}
                  onClick={handleApplyPromo}
                  className="px-6 py-3 bg-[#0F382C] hover:bg-[#0b2b22] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
                >
                  {checkingPromo ? 'Mengecek...' : 'Terapkan'}
                </button>
              </div>

              {appliedPromo && (
                <div className="bg-[#E6F4F1] border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs font-bold text-[#0F382C]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Diskon {persenDiskon}% aktif! Potongan Rp {potonganDiskon.toLocaleString('id-ID')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedPromo(null);
                      setKodePromo('');
                    }}
                    className="text-slate-400 hover:text-slate-600 text-xs font-medium cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: STICKY SUMMARY CARD ================= */}
          <div className="lg:col-span-5 space-y-4 sticky top-24">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-lg space-y-5">
              {/* Space Header */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src={spaceThumb}
                    alt={spaceName}
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    {space?.tipe?.toUpperCase() || 'SPACE'}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">{spaceName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{spaceLocation}</p>
                </div>
              </div>

              {/* Date Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {tanggalPemakaian}
                </span>
                <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {waktuMulai} - {calculateEndTime()} WIB
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
                      Diskon Promo <span className="bg-emerald-100 text-[#0F382C] px-1.5 py-0.5 rounded text-[10px] font-mono">{appliedPromo?.nama_diskon || kodePromo}</span>
                    </span>
                    <span>- Rp {potonganDiskon.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Biaya Layanan & Fasilitas</span>
                  <span className="font-bold text-emerald-700">Rp 0 (Termasuk)</span>
                </div>
              </div>

              {/* Total Pembayaran */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Total Biaya Reservasi</span>
                  <span className="text-[10px] text-slate-400 font-medium">Berdasarkan durasi sewa</span>
                </div>
                <p className="text-2xl font-black text-[#0F382C]">
                  Rp {totalPembayaran.toLocaleString('id-ID')}
                </p>
              </div>

              {/* Metode Pembayaran Options */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">Metode Konfirmasi Pembayaran</label>
                
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
                      <span>QRIS Instan (BCA, Mandiri, Gopay, OVO)</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#0F382C]">Otomatis</span>
                  </label>

                  <label
                    onClick={() => setMetodePembayaran('tunai')}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      metodePembayaran === 'tunai'
                        ? 'bg-[#E6F4F1]/60 border-[#0F382C] text-[#0F382C]'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={metodePembayaran === 'tunai'} readOnly className="accent-[#0F382C]" />
                      <span>Bayar di Tempat (Kasir / Resepsionis)</span>
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
                <label htmlFor="agreeTerms" className="cursor-pointer text-[11px] leading-tight text-slate-600">
                  Saya menyetujui jadwal sewa serta tata tertib ruangan coworking space.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#0F382C] hover:bg-[#0b2b22] disabled:opacity-50 text-white rounded-xl font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{submitting ? 'Memproses Reservasi...' : 'Konfirmasi & Buat Reservasi'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Data reservasi terisolasi aman dengan App Maker Key.
              </p>
            </div>
          </div>
        </form>
      </div>
    </MemberLayout>
  );
};

export default CheckoutPage;
