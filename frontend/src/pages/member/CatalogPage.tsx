import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import SpaceCard from '../../components/member/SpaceCard';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';
import { Space } from '../../types';
import { MapPin, CheckCircle2, ArrowRight, ShieldCheck, Wifi, Coffee } from 'lucide-react';

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
            <span className="studio-badge">
              Platform Ruang Kerja Studio
            </span>

            <h1 className="text-4xl sm:text-5xl font-display font-black uppercase text-zinc-900 leading-tight tracking-tight">
              Katalog Ruang Kerja Studio Eleven
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-medium max-w-xl">
              Akses fleksibel ke ruang coworking berfasilitas lengkap, workstation privat, dan ruang meeting profesional di lokasi strategis Indonesia.
            </p>

            {/* Stats Counter Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-200">
              <div>
                <p className="text-2xl sm:text-3xl font-display font-black text-zinc-900">48+</p>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Space Terkurasi</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-display font-black text-zinc-900">99.9%</p>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Fiber Uptime</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-display font-black text-red-600">12.5k</p>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Member Aktif</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 h-[380px] sm:h-[420px] bg-zinc-950 group">
              <img
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
                alt="Studio Eleven Modern Office"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>

              {/* Floating Bottom Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-zinc-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 uppercase font-display">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    SCBD Tower Suite • Jakarta Selatan
                  </p>
                  <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                    Tingkat Okupansi: Tenang (42% terisi)
                  </p>
                </div>
                <div className="bg-zinc-950 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-zinc-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  &lt; 35 dB Soundproof
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. FLOATING SEARCH BAR ================= */}
        <section className="bg-white rounded-3xl p-5 shadow-soft border border-zinc-200/80 -mt-6">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Lokasi Hub */}
            <div className="sm:col-span-4 flex items-center gap-3 px-4 py-3 bg-zinc-50 rounded-2xl border border-zinc-200 hover:border-zinc-300 transition-colors">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
              <div className="w-full">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block leading-tight">
                  Lokasi Hub
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="text-xs font-bold text-zinc-900 bg-transparent outline-none w-full cursor-pointer p-0 border-none focus:ring-0 truncate font-display"
                >
                  <option value="Semua Lokasi (SCBD, Senopati, BSD...)">Semua Lokasi (SCBD, Senopati, BSD...)</option>
                  <option value="SCBD, Jakarta">SCBD Tower, Jakarta</option>
                  <option value="Senopati, Jakarta">Senopati Hub, Jakarta</option>
                  <option value="Dago, Bandung">Dago Kreatif, Bandung</option>
                </select>
              </div>
            </div>

            {/* Tanggal Reservasi */}
            <div className="sm:col-span-3 flex items-center gap-3 px-4 py-3 bg-zinc-50 rounded-2xl border border-zinc-200 hover:border-zinc-300 transition-colors">
              <i className="fa-solid fa-calendar-days text-zinc-400 text-sm shrink-0"></i>
              <div className="w-full">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block leading-tight">
                  Tanggal Reservasi
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs font-bold text-zinc-900 bg-transparent outline-none w-full cursor-pointer p-0 border-none focus:ring-0 font-display"
                />
              </div>
            </div>

            {/* Kapasitas/Harga */}
            <div className="sm:col-span-3 flex items-center gap-3 px-4 py-3 bg-zinc-50 rounded-2xl border border-zinc-200 hover:border-zinc-300 transition-colors">
              <i className="fa-solid fa-users text-zinc-400 text-sm shrink-0"></i>
              <div className="w-full">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block leading-tight">
                  Kapasitas / Harga
                </label>
                <select
                  value={selectedCapacity}
                  onChange={(e) => setSelectedCapacity(e.target.value)}
                  className="text-xs font-bold text-zinc-900 bg-transparent outline-none w-full cursor-pointer p-0 border-none focus:ring-0 truncate font-display"
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
                className="w-full h-12 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-red-glow transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-magnifying-glass text-xs"></i>
                Cari Ruang
              </button>
            </div>
          </form>
        </section>

        {/* ================= 3. SOLUSI RUANG KERJA (Pilihan Ruang) ================= */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="studio-badge">SOLUSI RUANG KERJA</span>
              <h2 className="text-2xl font-display font-black uppercase text-zinc-900">Pilihan Tipe Space</h2>
            </div>
            <p className="text-xs text-zinc-500 max-w-md font-medium">
              Ruang kerja terkurasi untuk efisiensi dan produktivitas maksimal. Sesuaikan dengan ritme dan dinamika tim Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Personal Desk */}
            <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-soft hover:shadow-studio transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                    🪑
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-950 text-white">
                    Rekomendasi
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-display font-extrabold uppercase text-zinc-900">Personal Desk</h3>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed mt-1">
                    Untuk freelancer dan pekerja remote yang butuh fokus tinggi dan internet super kencang.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-zinc-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    Koneksi Fiber 100Mbps Simetris
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    Akses Espresso Bar & Pantry
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
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
                  className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Pilih <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Private Office */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-bold">
                    🏢
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-800">
                    PALING DIMINATI
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-display font-extrabold uppercase text-zinc-900">Private Office</h3>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed mt-1">
                    Ruang kantor tertutup ber-AC pendingin khusus untuk tim mandiri (3 - 10 orang).
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-zinc-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    Akses Kartu RFID 24 Jam Mandiri
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    Layanan Surat &amp; Domisili Usaha
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    10 Jam Kredit Ruang Meeting/Bulan
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 font-mono font-semibold uppercase block">Tarif Sewa</span>
                  <p className="text-base font-display font-black text-zinc-900">
                    Rp 350.000 <span className="text-xs font-normal text-zinc-400">/ jam</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate('/ruang')}
                  className="px-4 py-2 bg-zinc-950 hover:bg-black text-white rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  PILIH &rarr;
                </button>
              </div>
            </div>

            {/* Room Solution Card 2 */}
            <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-soft hover:shadow-studio transition-all duration-300 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-bold">
                    📊
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
                    REKOMENDASI
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-display font-extrabold uppercase text-zinc-900">Meeting Room</h3>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed mt-1">
                    Dilengkapi smart TV, proyektor 4K, dan whiteboard untuk rapat klien.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-zinc-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    Smart 4K Display 65" &amp; Soundbar
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    Magnetic Glass Whiteboard &amp; Kit
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    Penyajikan Minuman &amp; Snack Rapat
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 font-mono font-semibold uppercase block">Tarif Sewa</span>
                  <p className="text-base font-display font-black text-zinc-900">
                    Rp 150.000 <span className="text-xs font-normal text-zinc-400">/ jam</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate('/ruang')}
                  className="px-4 py-2 bg-zinc-950 hover:bg-black text-white rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  PILIH &rarr;
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
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCityTab === city
                      ? 'bg-zinc-950 text-white border border-zinc-800 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
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
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-zinc-200/80 space-y-8 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest block">
                - KAMPUS NYAMAN TANPA KOMPROMI
              </span>
              <h2 className="text-3xl font-display font-black uppercase text-zinc-900 leading-tight">
                Mengapa Studio Eleven?
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                Kami menghilangkan kerumitan birokrasi sewa konvensional. Cukup satu sentuhan di aplikasi untuk mengakses workstation premium dengan standar higienis dan teknologi tinggi.
              </p>

              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex items-center gap-4 shadow-xs max-w-sm">
                <div className="w-12 h-12 rounded-full border-4 border-red-600 flex items-center justify-center font-display font-black text-xs text-red-600 shrink-0">
                  94%
                </div>
                <div>
                  <p className="text-xs font-display font-bold uppercase text-zinc-900">Tingkat Kepuasan Member</p>
                  <p className="text-[11px] text-zinc-500 font-medium">
                    Berdasarkan survei 2,400+ profesional yang memesan ruang kerja mingguan.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="bg-zinc-50 border border-zinc-200/60 rounded-2xl p-5 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-display font-bold uppercase text-zinc-900">Akses 24/7 Tanpa Ribet</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed font-medium">
                    Check-in otomatis dengan kode QR terenkripsi melalui ponsel Anda. Tidak perlu antre di resepsionis atau mengurus jam operasional kantor normal.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/60 rounded-2xl p-5 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-display font-bold uppercase text-zinc-900">Koneksi Internet Fiber Gigabit</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed font-medium">
                    Jaringan simetris low-latency dengan cadangan dua ISP enterprise independen. Sempurna untuk video conference definisi tinggi dan pengiriman data besar.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/60 rounded-2xl p-5 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-display font-bold uppercase text-zinc-900">Fasilitas Kopi &amp; Pantry Terintegrasi</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Nikmati sajian espresso specialty beans lokal, teh herbal organik, serta air mineral reverse-osmosis sepuasnya tanpa biaya tersembunyi selama bekerja.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. CALL TO ACTION BANNER ================= */}
        <section className="bg-zinc-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-zinc-800 relative overflow-hidden">
          <div className="space-y-2 max-w-xl z-10">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-red-500 block">
              - MULAI LANGKAH PERTAMA
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight leading-tight uppercase">
              Siap meningkatkan fokus kerjamu hari ini?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
              Bergabunglah bersama ribuan profesional, freelancer, dan tim inovatif yang telah menemukan ritme kerja terbaik mereka.
            </p>
          </div>

          <button
            onClick={() => navigate('/ruang')}
            className="z-10 px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-display font-bold uppercase tracking-wider shadow-red-glow transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-2"
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
