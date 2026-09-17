import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { getImageUrl, getPlaceholderImage } from '../../utils/image';
import {
  Star,
  MapPin,
  Users,
  Maximize2,
  KeyRound,
  Wifi,
  Tv,
  Coffee,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Calendar,
  Layers,
  Phone
} from 'lucide-react';
import { Space } from '../../types';

const SpaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError } = useNotification();

  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [jamMulai, setJamMulai] = useState<string>('09:00');
  const [durasiJam, setDurasiJam] = useState<number>(2);

  const [checkingAvailability, setCheckingAvailability] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/spaces/${id}`);
        if (res.data && (res.data.status || res.data.statusCode === 200)) {
          setSpace(res.data.data);
        }
      } catch (err) {
        showError('Ruangan tidak ditemukan');
        navigate('/ruang');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchDetail();
    }
  }, [id, navigate, showError]);

  const verifyAvailability = useCallback(async () => {
    if (!id) return;
    setCheckingAvailability(true);
    try {
      const res = await api.get('/spaces/availability', {
        params: {
          id_space: Number(id),
          tanggal: selectedDate,
          jam_mulai: jamMulai,
          durasi_jam: durasiJam
        }
      });
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        const list = res.data.data;
        if (Array.isArray(list) && list.length > 0) {
          const match = list.find((s: any) => s.id === Number(id)) || list[0];
          setIsAvailable(match.is_available !== false);
        } else {
          setIsAvailable(true);
        }
      }
    } catch {
      setIsAvailable(true);
    } finally {
      setCheckingAvailability(false);
    }
  }, [id, selectedDate, jamMulai, durasiJam]);

  useEffect(() => {
    if (space) {
      verifyAvailability();
    }
  }, [space, verifyAvailability]);

  if (loading) {
    return (
      <MemberLayout>
        <div className="max-w-6xl mx-auto py-16 text-center text-slate-500 font-medium">
          Memuat detail ruangan & spesifikasi...
        </div>
      </MemberLayout>
    );
  }

  const hargaPerJam = space?.harga_per_jam || 25000;
  const totalEstimasi = hargaPerJam * durasiJam;
  const namaRuang = space?.nama_space || space?.nama_ruangan || 'Workspace';

  const handleBookingClick = () => {
    navigate(`/checkout/${space?.id}?date=${selectedDate}&start=${jamMulai}&duration=${durasiJam}`);
  };

  const heroImage = getImageUrl(space?.foto_url || space?.foto || space?.foto_ruangan, 'spaces') ||
    getPlaceholderImage(space?.tipe);

  return (
    <MemberLayout>
      <div className="max-w-6xl mx-auto space-y-8 -mt-2 pb-16">
        {/* Breadcrumb & Subtitle Tags */}
        <div className="space-y-2 pt-2 border-b border-slate-200/80 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-400">
              <Link to="/" className="hover:text-slate-600">Beranda</Link>
              <span>&gt;</span>
              <Link to="/ruang" className="hover:text-slate-600">Katalog Ruang</Link>
              <span>&gt;</span>
              <span className="text-[#0F382C] font-bold">{namaRuang}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
                ID #{space?.id || id}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#E6F4F1] text-[#0F382C] font-mono text-[10px] font-bold border border-emerald-200">
                TERVERIFIKASI
              </span>
              <span className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                4.9 <span className="text-slate-400 font-normal">(Rating Member)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{namaRuang}</h1>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {space?.nama_coworking || 'Moklet Hub Coworking'}, Lantai 2 • Kawasan Strategis
          </p>
        </div>

        {/* Hero Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[340px] sm:h-[400px]">
          <div className="md:col-span-8 h-full rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 relative group bg-slate-100">
            <img
              src={heroImage}
              alt={namaRuang}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = getPlaceholderImage(space?.tipe);
              }}
            />
          </div>

          <div className="md:col-span-4 grid grid-rows-2 gap-4 h-full">
            <div className="rounded-2xl overflow-hidden border border-slate-200/80 relative group bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80"
                alt="Room Facility 1"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200/80 relative group bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80"
                alt="Room Facility 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Content Split: Left Details & Right Booking Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Highlights Spec Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center space-y-1">
                <Users className="w-5 h-5 text-[#0F382C] mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Kapasitas</span>
                <span className="text-sm font-extrabold text-slate-900">{space?.kapasitas || 1} Orang</span>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center space-y-1">
                <Maximize2 className="w-5 h-5 text-[#0F382C] mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tipe Ruang</span>
                <span className="text-sm font-extrabold text-slate-900 capitalize">{space?.tipe || 'desk'}</span>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center space-y-1">
                <KeyRound className="w-5 h-5 text-[#0F382C] mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Akses Kunci</span>
                <span className="text-sm font-extrabold text-slate-900">QR Digital Pass</span>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center space-y-1">
                <Zap className="w-5 h-5 text-[#0F382C] mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Daya Listrik</span>
                <span className="text-sm font-extrabold text-slate-900">Stopkontak Mandiri</span>
              </div>
            </div>

            {/* Description & Overview */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <h2 className="text-lg font-extrabold text-slate-900">Deskripsi & Fasilitas Ruangan</h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {typeof space?.deskripsi === 'string' && space.deskripsi.trim() !== ''
                  ? space.deskripsi
                  : 'Ruang kerja berstandar tinggi yang didesain untuk kenyamanan fokus dan kolaborasi tim. Dilengkapi pendingin ruangan terjaga, pencahayaan ergonomis, serta koneksi fiber optik stabil.'}
              </p>
            </div>

            {/* Included Amenities Grid */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <h2 className="text-lg font-extrabold text-slate-900">Fasilitas Termasuk</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Wifi className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Wi-Fi Fiber Dedicated</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Tv className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Smart Presentation Monitor</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Coffee className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free Flow Kopi & Teh</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Keamanan & CCTV 24 Jam</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kebersihan & Sanitasi</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>E-Ticket & QR Turnstile</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Floating Booking Form */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6 sticky top-24">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">TARIF MULAI</span>
                <p className="text-2xl font-black text-slate-900">
                  Rp {hargaPerJam.toLocaleString('id-ID')}
                  <span className="text-xs font-medium text-slate-500"> / jam</span>
                </p>
              </div>

              {/* Live Availability Status Pill */}
              <div className="pt-1">
                {checkingAvailability ? (
                  <div className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping"></span>
                    Mengecek ketersediaan jadwal...
                  </div>
                ) : isAvailable === false ? (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    Jadwal bentrok dengan reservasi lain. Silakan pilih jam lain.
                  </div>
                ) : (
                  <div className="bg-[#E6F4F1] border border-emerald-200 text-[#0F382C] px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Tersedia & Siap Dipesan pada Jam Ini
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Reservasi</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={todayStr}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:outline-none focus:border-[#0F382C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Jam Mulai</label>
                    <select
                      value={jamMulai}
                      onChange={(e) => setJamMulai(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:outline-none focus:border-[#0F382C]"
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

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Durasi</label>
                    <select
                      value={durasiJam}
                      onChange={(e) => setDurasiJam(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:outline-none focus:border-[#0F382C]"
                    >
                      <option value={1}>1 Jam</option>
                      <option value={2}>2 Jam</option>
                      <option value={4}>4 Jam</option>
                      <option value={8}>8 Jam (Full Day)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5 border border-slate-100">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Estimasi Biaya ({durasiJam} jam):</span>
                    <span>Rp {totalEstimasi.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-slate-900 text-sm border-t border-slate-200 pt-1.5">
                    <span>Total Estimasi:</span>
                    <span className="text-[#0F382C]">Rp {totalEstimasi.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBookingClick}
                  disabled={isAvailable === false}
                  className="w-full py-3.5 bg-[#0F382C] hover:bg-[#0b2b22] disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  Pesan Ruangan Ini
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default SpaceDetailPage;
