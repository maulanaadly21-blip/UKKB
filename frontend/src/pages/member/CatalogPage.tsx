import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import SpaceCard from '../../components/member/SpaceCard';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  Wifi,
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { Space } from '../../types';

const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { showInfo } = useNotification();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedLocation, setSelectedLocation] = useState<string>('Semua Lokasi (SCBD, Senopati, BSD...)');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('1 Orang (Hot Desk / Pod)');
  const [selectedCityTab, setSelectedCityTab] = useState<string>('Semua');

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const res = await api.get('/spaces');
      if (res.data && res.data.status) {
        setSpaces(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch spaces:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleSearchSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    navigate('/ruang');
  };

  const handleBookNow = (space: Space) => {
    navigate(`/checkout/${space.id}?date=${selectedDate}`);
  };

  const filteredPopularSpaces = spaces.filter((space) => {
    if (selectedCityTab === 'Semua') return true;
    const loc = (space.nama_coworking || '').toLowerCase();
    const city = (space.kota || '').toLowerCase();
    const target = selectedCityTab.toLowerCase();
    return loc.includes(target) || city.includes(target);
  });

  return (
    <MemberLayout>
      <div className="space-y-16 -mt-2 pb-16">
        {/* ================= 1. HERO SECTION ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E6F4F1] text-[#0F382C] text-xs font-bold border border-emerald-200/80">
              <span className="w-2 h-2 rounded-full bg-[#0F382C]"></span>
              PLATFORM RUANG KERJA MODERN
            </span>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              Temukan Ruang Kerja yang Sesuai Kebutuhanmu
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
              Akses fleksibel ke ruang coworking berfasilitas lengkap, workstation privat, dan ruang meeting profesional di lokasi strategis Indonesia.
            </p>

            {/* Stats Counter Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-2xl font-black text-slate-900">48+</p>
                <p className="text-xs text-slate-500 font-medium">Hak Tempat Kerja</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">99.9%</p>
                <p className="text-xs text-slate-500 font-medium">Koneksi Fiber Uptime</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">12.5k</p>
                <p className="text-xs text-slate-500 font-medium">Member Aktif</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 h-[380px] sm:h-[420px] bg-slate-100 group">
              <img
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
                alt="SmartSpace Modern Office"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Bottom Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-200/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0F382C]" />
                    SCBD Tower Suite • Jakarta Selatan
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Tingkat Okupansi: Tenang (42% terisi)
                  </p>
                </div>
                <div className="bg-[#E6F4F1] text-[#0F382C] text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200/80">
                  Masuk Studio &lt; 35 dB
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. FLOATING SEARCH BAR ================= */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-100/90 -mt-6">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Lokasi Hub */}
            <div className="sm:col-span-4 flex items-center gap-3 px-4 py-2.5 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                  Lokasi Hub
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent outline-none w-full cursor-pointer p-0 border-none focus:ring-0 truncate"
                >
                  <option value="Semua Lokasi (SCBD, Senopati, BSD...)">Semua Lokasi (SCBD, Senopati, BSD...)</option>
                  <option value="SCBD, Jakarta">SCBD Tower, Jakarta</option>
                  <option value="Senopati, Jakarta">Senopati Hub, Jakarta</option>
                  <option value="Dago, Bandung">Dago Kreatif, Bandung</option>
                </select>
              </div>
            </div>

            {/* Tanggal Reservasi */}
            <div className="sm:col-span-3 flex items-center gap-3 px-4 py-2.5 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                  Tanggal Reservasi
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent outline-none w-full cursor-pointer p-0 border-none focus:ring-0"
                />
              </div>
            </div>

            {/* Kapasitas/Harga */}
            <div className="sm:col-span-3 flex items-center gap-3 px-4 py-2.5 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                  Kapasitas / Harga
                </label>
                <select
                  value={selectedCapacity}
                  onChange={(e) => setSelectedCapacity(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent outline-none w-full cursor-pointer p-0 border-none focus:ring-0 truncate"
                >
                  <option value="1 Orang (Hot Desk / Pod)">1 Orang (Hot Desk / Pod)</option>
                  <option value="2 - 6 Orang (Meeting Room)">2 - 6 Orang (Meeting Room)</option>
                  <option value="6 - 20 Orang (Enterprise Suite)">6 - 20 Orang (Enterprise Suite)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full h-12 bg-[#0F382C] hover:bg-[#0b2b22] text-white rounded-xl font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Cari Ruang
              </button>
            </div>
          </form>
        </section>

        {/* ================= 3. SOLUSI RUANG KERJA (Pilihan Ruang) ================= */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                SOLUSI RUANG KERJA
              </span>
              <h2 className="text-2xl font-black text-slate-900">Pilihan Ruang</h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md font-medium">
              Ruang kerja terkurasi untuk efisiensi dan produktivitas maksimal. Sesuaikan dengan ritme dan dinamika tim Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Personal Desk */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0F382C] flex items-center justify-center font-bold">
                    🪑
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Rekomendasi
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Personal Desk</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                    Untuk freelancer dan pekerja remote yang butuh fokus tinggi dan internet stabil.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Pilihan Opctical 100Mbps Simetris
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Akses Espresso Bar & Pantry
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Kursi Ergonomis Herman Miller
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Tarif Sewa</span>
                  <p className="text-base font-black text-slate-900">
                    Rp 50.000 <span className="text-xs font-normal text-slate-500">/ hari</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate('/ruang?tipe=desk')}
                  className="text-xs font-bold text-[#0F382C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Pilih <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Private Office */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0F382C] flex items-center justify-center font-bold">
                    🏢
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                    PALING DIMINATI
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Private Office</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                    Ruang kantor tertutup ber-AC pendingin khusus untuk tim mandiri (3 - 10 orang).
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Akses Kartu RFID 24 Jam Mandiri
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Layanan Surat & Domisili Usaha
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    10 Jam Kredit Ruang Meeting/Bulan
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Tarif Sewa</span>
                  <p className="text-base font-black text-slate-900">
                    Rp 2.500.000 <span className="text-xs font-normal text-slate-500">/ bulan</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate('/ruang?tipe=private_office')}
                  className="text-xs font-bold text-[#0F382C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Pilih <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Meeting Room */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0F382C] flex items-center justify-center font-bold">
                    📊
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    Rekomendasi
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Meeting Room</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                    Dilengkapi smart TV, proyektor 4K, dan whiteboard untuk rapat klien.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Smart 4K Display 65" & Soundbar
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Magnetic Glass Whiteboard & Kit
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Penyajikan Minuman & Snack Rapat
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Tarif Sewa</span>
                  <p className="text-base font-black text-slate-900">
                    Rp 150.000 <span className="text-xs font-normal text-slate-500">/ jam</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate('/ruang?tipe=meeting_room')}
                  className="text-xs font-bold text-[#0F382C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Pilih <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. LOKASI PALING DICARI (Ruang Populer) ================= */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                LOKASI PALING DICARI
              </span>
              <h2 className="text-2xl font-black text-slate-900">Ruang Populer</h2>
            </div>

            {/* City Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {['Semua', 'Jakarta', 'Bandung', 'Yogyakarta'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCityTab(city)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCityTab === city
                      ? 'bg-[#0F382C] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 bg-slate-200/60 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredPopularSpaces.slice(0, 6).map((space) => (
                <SpaceCard key={space.id} space={space} onBookNow={handleBookNow} />
              ))}
            </div>
          )}
        </section>

        {/* ================= 5. MENGAPA SMART SPACE? ================= */}
        <section className="bg-slate-50/80 rounded-3xl p-8 sm:p-12 border border-slate-100 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                KAMPUS NYAMAN TANPA KOMPROMI
              </span>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                Mengapa Smart Space?
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Kami menghilangkan kerumitan birokrasi sewa konvensional. Cukup satu sentuhan di aplikasi untuk mengakses workstation premium dengan standar higienis dan teknologi tinggi.
              </p>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-2xs max-w-sm">
                <div className="w-12 h-12 rounded-full border-4 border-[#0F382C] flex items-center justify-center font-black text-xs text-[#0F382C]">
                  94%
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Tingkat Kepuasan Member</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Berdasarkan survei 2,400+ profesional yang memesan ruang kerja mingguan.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0F382C] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Akses 24/7 Tanpa Ribet</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Check-in otomatis dengan kode QR terenkripsi melalui ponsel Anda. Tidak perlu antre di resepsionis atau mengurus jam operasional kantor normal.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0F382C] flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Koneksi Internet Fiber Gigabit</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Jaringan simetris low-latency dengan cadangan dua ISP enterprise independen. Sempurna untuk video conference definisi tinggi dan pengiriman data besar.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0F382C] flex items-center justify-center shrink-0">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Fasilitas Kopi & Pantry Terintegrasi</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Nikmati sajian espresso specialty beans lokal, teh herbal organik, serta air mineral reverse-osmosis sepuasnya tanpa biaya tersembunyi selama bekerja.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. CALL TO ACTION BANNER ================= */}
        <section className="bg-[#0F382C] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2 max-w-xl z-10">
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-300 block">
              MULAI LANGKAH PERTAMA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Siap meningkatkan fokus kerjamu hari ini?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-normal leading-relaxed">
              Bergabunglah bersama ribuan profesional, freelancer, dan tim inovatif yang telah menemukan ritme kerja terbaik mereka.
            </p>
          </div>

          <button
            onClick={() => navigate('/ruang')}
            className="z-10 px-6 py-3.5 bg-white text-[#0F382C] hover:bg-slate-100 rounded-xl text-xs font-extrabold shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            Mulai Reservasi
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </div>
    </MemberLayout>
  );
};

export default CatalogPage;
