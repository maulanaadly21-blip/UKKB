import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
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
  ArrowRight,
  MessageSquare
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
  const [jamMulai, setJamMulai] = useState<string>('10:00');
  const [durasiJam, setDurasiJam] = useState<number>(2);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/spaces/${id}`);
        if (res.data && res.data.status) {
          setSpace(res.data.data);
        }
      } catch (err) {
        showError('Ruangan tidak ditemukan');
        navigate('/ruang');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <MemberLayout>
        <div className="max-w-6xl mx-auto py-16 text-center text-slate-500 font-medium">
          Memuat detail ruangan...
        </div>
      </MemberLayout>
    );
  }

  const hargaPerJam = space?.harga_per_jam || 200000;
  const totalEstimasi = hargaPerJam * durasiJam;
  const namaRuang = space?.nama_space || space?.nama_ruangan || 'Glasshouse Meeting Room';

  const handleBookingClick = () => {
    navigate(`/checkout/${space?.id}?date=${selectedDate}&start=${jamMulai}&duration=${durasiJam}`);
  };

  const getImageUrl = (spaceObj: Space | null) => {
    if (!spaceObj) return 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80';
    if (spaceObj.foto_url) return spaceObj.foto_url;
    if (spaceObj.foto) {
      if (spaceObj.foto.startsWith('http')) return spaceObj.foto;
      return `http://localhost:5001/uploads/spaces/${spaceObj.foto}`;
    }
    return 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80';
  };

  return (
    <MemberLayout>
      <div className="max-w-6xl mx-auto space-y-8 -mt-2 pb-16">
        {/* Breadcrumb & Subtitle Tags */}
        <div className="space-y-2 pt-2 border-b border-slate-100 pb-4">
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
                RUANG #SCBD-0482
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
                VERIFIKASI ISO 9001
              </span>
              <span className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                4.9 <span className="text-slate-400 font-normal">(142 Ulasan Terverifikasi)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{namaRuang}</h1>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {space?.nama_coworking || 'SCBD Tower'}, Lantai 4 (Kawasan SCBD, Jakarta Selatan)
          </p>
        </div>

        {/* Hero Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[340px] sm:h-[400px]">
          <div className="md:col-span-8 h-full rounded-3xl overflow-hidden shadow-lg border border-slate-100 relative group">
            <img
              src={getImageUrl(space)}
              alt={namaRuang}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="md:col-span-4 grid grid-rows-2 gap-4 h-full">
            <div className="rounded-2xl overflow-hidden border border-slate-100 relative group">
              <img
                src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80"
                alt="Room Spec 1"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-100 relative group">
              <img
                src="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80"
                alt="Room Spec 2"
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
                <span className="text-sm font-extrabold text-slate-900">{space?.kapasitas || 8} Orang</span>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center space-y-1">
                <Maximize2 className="w-5 h-5 text-[#0F382C] mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Luas Area</span>
                <span className="text-sm font-extrabold text-slate-900">32 m²</span>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center space-y-1">
                <KeyRound className="w-5 h-5 text-[#0F382C] mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Akses Kunci</span>
                <span className="text-sm font-extrabold text-slate-900">QR / Digital Pass</span>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center space-y-1">
                <Zap className="w-5 h-5 text-[#0F382C] mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Daya Listrik</span>
                <span className="text-sm font-extrabold text-slate-900">Mandiri (4 Plug)</span>
              </div>
            </div>

            {/* Description & Overview */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <h2 className="text-lg font-extrabold text-slate-900">Deskripsi & Spesifikasi Ruang</h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {typeof space?.deskripsi === 'string'
                  ? space.deskripsi
                  : 'Ruang kerja premium yang dirancang khusus untuk kenyamanan dan produktivitas tinggi. Dilengkapi peredam suara profesional, pendingin udara terjaga, dan perlengkapan video conference terkini.'}
              </p>
            </div>

            {/* Complete Amenities Grid */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <h2 className="text-lg font-extrabold text-slate-900">Fasilitas Utama Terpasang</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <span>Wi-Fi Fiber 100Mbps</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                  <Tv className="w-4 h-4 text-emerald-600" />
                  <span>Smart TV 4K 65 Inch</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                  <Coffee className="w-4 h-4 text-emerald-600" />
                  <span>Free Flow Kopi & Teh</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>CCTV & Kemanan 24 Jam</span>
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

              <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Reservasi</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={todayStr}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Jam Mulai</label>
                    <select
                      value={jamMulai}
                      onChange={(e) => setJamMulai(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900"
                    >
                      <option value="08:00">08:00 WIB</option>
                      <option value="10:00">10:00 WIB</option>
                      <option value="13:00">13:00 WIB</option>
                      <option value="15:00">15:00 WIB</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Durasi</label>
                    <select
                      value={durasiJam}
                      onChange={(e) => setDurasiJam(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900"
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
                  className="w-full py-3.5 bg-[#0F382C] hover:bg-[#0b2b22] text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
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
