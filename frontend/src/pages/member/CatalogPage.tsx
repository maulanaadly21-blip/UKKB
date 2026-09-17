import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import SpaceCard from '../../components/member/SpaceCard';
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
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Space } from '../../types';

const CatalogPage: React.FC = () => {
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCityTab, setSelectedCityTab] = useState<string>('Semua');

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const res = await api.get('/spaces');
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        setSpaces(res.data.data || []);
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
    const params = new URLSearchParams();
    if (selectedType !== 'all') params.set('tipe', selectedType);
    if (selectedLocation !== 'all') params.set('search', selectedLocation);
    if (selectedDate) params.set('date', selectedDate);
    navigate(`/ruang?${params.toString()}`);
  };

  const handleBookNow = (space: Space) => {
    navigate(`/checkout/${space.id}?date=${selectedDate}`);
  };

  const filteredPopularSpaces = spaces.filter((space) => {
    if (selectedCityTab === 'Semua') return true;
    const loc = (space.nama_coworking || '').toLowerCase();
    const city = (space.kota || '').toLowerCase();
    const desc = (space.deskripsi || '').toLowerCase();
    const target = selectedCityTab.toLowerCase();
    return loc.includes(target) || city.includes(target) || desc.includes(target);
  });

  return (
    <MemberLayout>
      <div className="space-y-16 -mt-2 pb-16">
        {/* 1. HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F4F1] text-[#0F382C] text-xs font-extrabold border border-emerald-200/80">
              <span className="w-2 h-2 rounded-full bg-[#0F382C] animate-pulse"></span>
              PLATFORM RESERVASI COWORKING SPACE
            </span>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
              Temukan Ruang Kerja yang Pas untuk Fokus & Timmu
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
              Akses cepat dan fleksibel ke workstation modern, meeting room kedap suara, dan private office terkurasi di lokasi strategis Indonesia.
            </p>

            {/* Stats Counter Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">{spaces.length > 0 ? `${spaces.length}+` : '48+'}</p>
                <p className="text-xs text-slate-500 font-semibold">Pilihan Ruang Aktif</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-semibold">Fiber Optik Dedicated</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">Instant</p>
                <p className="text-xs text-slate-500 font-semibold">Digital Pass QR</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 h-[380px] sm:h-[420px] bg-slate-100 group">
              <img
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
                alt="Modern Coworking Space"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-200/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0F382C]" />
                    Moklet Hub Coworking • Kawasan Bisnis
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Kapasitas Terjaga • Suasana Tenang
                  </p>
                </div>
                <div className="bg-[#E6F4F1] text-[#0F382C] text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200/80">
                  Ready to Book
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FLOATING SEARCH BAR */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200/80 -mt-6">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Lokasi */}
            <div className="sm:col-span-4 flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                  Lokasi / Area
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent outline-none w-full cursor-pointer p-0 border-none focus:ring-0 truncate"
                >
                  <option value="all">Semua Lokasi & Hub</option>
                  <option value="Jakarta">Jakarta</option>
                  <option value="Bandung">Bandung</option>
                  <option value="Malang">Malang</option>
                  <option value="Surabaya">Surabaya</option>
                </select>
              </div>
            </div>

            {/* Tanggal Reservasi */}
            <div className="sm:col-span-3 flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                  Tanggal Reservasi
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={todayStr}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent outline-none w-full cursor-pointer p-0 border-none focus:ring-0"
                />
              </div>
            </div>

            {/* Tipe Ruangan */}
            <div className="sm:col-span-3 flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                  Tipe Ruang
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent outline-none w-full cursor-pointer p-0 border-none focus:ring-0 truncate"
                >
                  <option value="all">Semua Tipe Ruang</option>
                  <option value="desk">Personal Desk (Hot Desk)</option>
                  <option value="meeting_room">Meeting Room (Ruang Rapat)</option>
                  <option value="private_office">Private Office (Kantor Privat)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full h-12 bg-[#0F382C] hover:bg-[#0b2b22] text-white rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Cari Ruang
              </button>
            </div>
          </form>
        </section>

        {/* 3. SOLUSI RUANG KERJA */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                PILIHAN FORMAT RUANG
              </span>
              <h2 className="text-2xl font-black text-slate-900">Solusi Sesuai Kebutuhanmu</h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md font-medium">
              Dirancang untuk kenyamanan individu maupun dinamika kolaborasi tim secara fleksibel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Personal Desk */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0F382C] flex items-center justify-center font-bold text-lg">
                    🪑
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Fleksibel
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Personal Desk</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                    Untuk freelancer dan pekerja remote yang membutuhkan meja kerja fokus, stopkontak mandiri, dan internet stabil.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Koneksi Fiber Optik Dedicated
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Akses Pantry & Coffee Bar
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Kursi Ergonomis
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Tarif Mulai</span>
                  <p className="text-base font-black text-slate-900">
                    Rp 25.000 <span className="text-xs font-normal text-slate-500">/ jam</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate('/ruang?tipe=desk')}
                  className="text-xs font-bold text-[#0F382C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Lihat Meja <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Meeting Room */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0F382C] flex items-center justify-center font-bold text-lg">
                    📊
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    Rapat Tim
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Meeting Room</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                    Dilengkapi Smart TV 4K, whiteboard, dan tata suara kedap untuk presentasi klien atau sprint tim.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Smart 4K Display & HDMI Kit
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Acoustic Soundproof Wall
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Magnetic Glass Whiteboard
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Tarif Mulai</span>
                  <p className="text-base font-black text-slate-900">
                    Rp 75.000 <span className="text-xs font-normal text-slate-500">/ jam</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate('/ruang?tipe=meeting_room')}
                  className="text-xs font-bold text-[#0F382C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Lihat Ruangan <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Private Office */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0F382C] flex items-center justify-center font-bold text-lg">
                    🏢
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                    EKSKLUSIF
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Private Office</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                    Kantor privat tertutup ber-AC mandiri untuk operasional tim inti, startup, atau cabang perusahaan.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Kunci Digital / QR Pass Mandiri
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Kapasitas 4 - 10 Orang
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Akses 24/7 Penuh
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Tarif Mulai</span>
                  <p className="text-base font-black text-slate-900">
                    Rp 150.000 <span className="text-xs font-normal text-slate-500">/ jam</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate('/ruang?tipe=private_office')}
                  className="text-xs font-bold text-[#0F382C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Lihat Office <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. DAFTAR RUANG TERSEDIA */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                KATALOG RUANG TERBARU
              </span>
              <h2 className="text-2xl font-black text-slate-900">Ruangan Siap Dipesan</h2>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {['Semua', 'Jakarta', 'Bandung', 'Malang'].map((city) => (
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

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 bg-slate-200/60 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredPopularSpaces.length === 0 ? (
            <div className="text-center py-12 bg-white border border-slate-200/80 rounded-2xl space-y-3">
              <p className="text-xs text-slate-500 font-medium">Belum ada ruangan untuk filter lokasi ini.</p>
              <button
                onClick={() => setSelectedCityTab('Semua')}
                className="px-4 py-2 bg-[#0F382C] text-white text-xs font-bold rounded-xl"
              >
                Tampilkan Semua
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPopularSpaces.slice(0, 6).map((space) => (
                <SpaceCard key={space.id} space={space} onBookNow={handleBookNow} />
              ))}
            </div>
          )}

          <div className="text-center pt-2">
            <button
              onClick={() => navigate('/ruang')}
              className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-extrabold rounded-xl shadow-2xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Jelajahi Semua {spaces.length} Ruang Kerja</span>
              <ArrowRight className="w-4 h-4 text-[#0F382C]" />
            </button>
          </div>
        </section>

        {/* 5. MENGAPA PILIH ADLY WANGSA */}
        <section className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                STANDAR LAYANAN PROFESIONAL
              </span>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                Mengapa Memilih Coworking Space Kami?
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Pemesanan instan tanpa proses birokrasi berbelit. Dapatkan nota resmi, e-ticket ber-QR Code terenkripsi, dan akses cepat ke meja kerja berfasilitas lengkap.
              </p>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-2xs max-w-sm">
                <div className="w-12 h-12 rounded-full border-4 border-[#0F382C] flex items-center justify-center font-black text-xs text-[#0F382C]">
                  98%
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Uptime & Kepuasan Member</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Didukung koneksi cadangan multi-ISP dan pendingin ruangan terjaga.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0F382C] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Digital Pass QR Code</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Setiap reservasi langsung menerbitkan nota dan tiket QR Code yang dapat discan di pintu masuk atau resepsionis.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0F382C] flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Koneksi Fiber 100Mbps Simetris</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Koneksi internet dedicated dengan latency rendah, stabil untuk video conference, streaming, dan pengiriman file besar.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0F382C] flex items-center justify-center shrink-0">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Pantry & Free Flow Coffee/Tea</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Nikmati sajian kopi dan teh hangat gratis di pantry untuk menjaga fokus dan energi kerja Anda sepanjang hari.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CALL TO ACTION BANNER */}
        <section className="bg-[#0F382C] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2 max-w-xl z-10">
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-300 block">
              RESERVASI SEKARANG
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Siap untuk mulai bekerja dengan lebih produktif?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-normal leading-relaxed">
              Cek ketersediaan meja atau ruangan sekarang dan dapatkan diskon promo khusus untuk reservasi pertama Anda.
            </p>
          </div>

          <button
            onClick={() => navigate('/ruang')}
            className="z-10 px-6 py-3.5 bg-white text-[#0F382C] hover:bg-slate-100 rounded-xl text-xs font-extrabold shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            Lihat Semua Ruang
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </div>
    </MemberLayout>
  );
};

export default CatalogPage;
