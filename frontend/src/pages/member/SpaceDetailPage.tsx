import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
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
        <div className="space-y-2 pt-2 border-b border-zinc-200/80 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-zinc-400">
              <Link to="/" className="hover:text-zinc-900">Beranda</Link>
              <span>&gt;</span>
              <Link to="/ruang" className="hover:text-zinc-900">Katalog Ruang</Link>
              <span>&gt;</span>
              <span className="text-red-600 font-extrabold">{namaRuang}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-zinc-950 text-white font-display text-[10px] font-bold uppercase tracking-wider">
                RUANG #SCBD-0482
              </span>
              <span className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <i className="fa-solid fa-star text-amber-400 text-xs"></i>
                4.9 <span className="text-zinc-400 font-normal">(142 Ulasan Terverifikasi)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Header Title */}
        <div>
          <span className="studio-badge">Ruang Kerja Terverifikasi</span>
          <h1 className="text-3xl sm:text-4xl font-display font-black uppercase text-zinc-900 tracking-tight mt-1">{namaRuang}</h1>
          <p className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mt-1">
            <i className="fa-solid fa-location-dot text-red-600 text-xs"></i>
            {space?.nama_coworking || 'SCBD Tower'}, Lantai 4 (Kawasan SCBD, Jakarta Selatan)
          </p>
        </div>

        {/* Hero Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[340px] sm:h-[400px]">
          <div className="md:col-span-8 h-full rounded-3xl overflow-hidden shadow-soft border border-zinc-200 relative group">
            <img
              src={getImageUrl(space)}
              alt={namaRuang}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="md:col-span-4 grid grid-rows-2 gap-4 h-full">
            <div className="rounded-2xl overflow-hidden border border-zinc-200 relative group">
              <img
                src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80"
                alt="Room Spec 1"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-zinc-200 relative group">
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
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 text-center space-y-1 shadow-soft">
                <i className="fa-solid fa-users text-red-600 text-lg block mx-auto"></i>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Kapasitas</span>
                <span className="text-sm font-display font-extrabold text-zinc-900">{space?.kapasitas || 8} Orang</span>
              </div>

              <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 text-center space-y-1 shadow-soft">
                <i className="fa-solid fa-expand text-red-600 text-lg block mx-auto"></i>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Luas Area</span>
                <span className="text-sm font-display font-extrabold text-zinc-900">32 m²</span>
              </div>

              <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 text-center space-y-1 shadow-soft">
                <i className="fa-solid fa-key text-red-600 text-lg block mx-auto"></i>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Akses Kunci</span>
                <span className="text-sm font-display font-extrabold text-zinc-900">QR Pass</span>
              </div>

              <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 text-center space-y-1 shadow-soft">
                <i className="fa-solid fa-bolt text-red-600 text-lg block mx-auto"></i>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Daya Listrik</span>
                <span className="text-sm font-display font-extrabold text-zinc-900">Mandiri</span>
              </div>
            </div>

            {/* Description & Overview */}
            <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-soft">
              <h2 className="text-lg font-display font-extrabold uppercase text-zinc-900">Deskripsi &amp; Spesifikasi Ruang</h2>
              <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                {typeof space?.deskripsi === 'string'
                  ? space.deskripsi
                  : 'Ruang kerja premium yang dirancang khusus untuk kenyamanan dan produktivitas tinggi. Dilengkapi peredam suara profesional, pendingin udara terjaga, dan perlengkapan video conference terkini.'}
              </p>
            </div>

            {/* Complete Amenities Grid */}
            <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft">
              <div>
                <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest block mb-1">- PREMIUM AMENITIES</span>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold uppercase text-zinc-900">FASILITAS UTAMA TERPASANG</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 border border-zinc-200/60 rounded-2xl flex items-start gap-3.5 hover:border-red-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-wifi text-base"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-bold uppercase text-zinc-900">Koneksi Internet Fiber Gigabit</h3>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">Wi-Fi simetris 100Mbps low-latency dengan cadangan dua ISP enterprise.</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200/60 rounded-2xl flex items-start gap-3.5 hover:border-red-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-desktop text-base"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-bold uppercase text-zinc-900">Smart Display TV 4K 65"</h3>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">Ultra-HD screen sharing nirkabel &amp; perlengkapan soundbar video conference.</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200/60 rounded-2xl flex items-start gap-3.5 hover:border-red-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-mug-hot text-base"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-bold uppercase text-zinc-900">Fasilitas Kopi &amp; Pantry Terintegrasi</h3>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">Sajian espresso specialty, teh herbal organik, dan air mineral reverse-osmosis.</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200/60 rounded-2xl flex items-start gap-3.5 hover:border-red-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-camera text-base"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-bold uppercase text-zinc-900">Akses 24/7 &amp; Keamanan Terenkripsi</h3>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">Check-in otomatis dengan QR turnstile gate pass &amp; pengawasan CCTV 24 jam.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Floating Booking Form */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-soft space-y-6 sticky top-24">
              <div>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">TARIF SEWA</span>
                <p className="text-2xl font-display font-black text-zinc-900">
                  Rp {hargaPerJam.toLocaleString('id-ID')}
                  <span className="text-xs font-normal text-zinc-400"> / jam</span>
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-100 text-xs">
                <div>
                  <label className="font-bold uppercase tracking-wider text-zinc-700 block mb-1 text-[11px]">Tanggal Reservasi</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={todayStr}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-3 font-bold text-zinc-900 font-display focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold uppercase tracking-wider text-zinc-700 block mb-1 text-[11px]">Jam Mulai</label>
                    <select
                      value={jamMulai}
                      onChange={(e) => setJamMulai(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-3 font-bold text-zinc-900 font-display focus:border-red-500"
                    >
                      <option value="08:00">08:00 WIB</option>
                      <option value="10:00">10:00 WIB</option>
                      <option value="13:00">13:00 WIB</option>
                      <option value="15:00">15:00 WIB</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold uppercase tracking-wider text-zinc-700 block mb-1 text-[11px]">Durasi</label>
                    <select
                      value={durasiJam}
                      onChange={(e) => setDurasiJam(parseInt(e.target.value, 10))}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-3 font-bold text-zinc-900 font-display focus:border-red-500"
                    >
                      <option value={1}>1 Jam</option>
                      <option value={2}>2 Jam</option>
                      <option value={4}>4 Jam</option>
                      <option value={8}>8 Jam (Full Day)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-zinc-950 text-white p-4 rounded-2xl space-y-2 border border-zinc-800">
                  <div className="flex justify-between text-zinc-400 font-medium text-xs">
                    <span>Estimasi Biaya ({durasiJam} jam):</span>
                    <span>Rp {totalEstimasi.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-display font-bold text-white text-sm border-t border-zinc-800 pt-2">
                    <span>Total Estimasi:</span>
                    <span className="text-red-500">Rp {totalEstimasi.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBookingClick}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-red-glow transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  Lanjut Pembayaran &amp; Reservasi
                  <i className="fa-solid fa-arrow-right text-xs"></i>
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
