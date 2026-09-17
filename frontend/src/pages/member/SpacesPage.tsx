import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import SpaceCard from '../../components/member/SpaceCard';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';
import {
  Search,
  RotateCcw,
  Building2,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Space } from '../../types';

const SpacesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showInfo } = useNotification();

  const queryType = searchParams.get('tipe') || 'all';
  const querySearch = searchParams.get('search') || '';
  const queryDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [searchKeyword, setSearchKeyword] = useState<string>(querySearch);
  const [selectedType, setSelectedType] = useState<string>(queryType);
  const [selectedCapacity, setSelectedCapacity] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  // Live Availability Check Form
  const [checkDate, setCheckDate] = useState<string>(queryDate);
  const [checkStartTime, setCheckStartTime] = useState<string>('09:00');
  const [checkDuration, setCheckDuration] = useState<number>(2);
  const [availabilityMode, setAvailabilityMode] = useState<boolean>(false);

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 9;

  const fetchSpaces = useCallback(async () => {
    setLoading(true);
    try {
      if (availabilityMode) {
        const params: any = {
          tanggal: checkDate,
          jam_mulai: checkStartTime,
          durasi_jam: checkDuration
        };
        if (selectedType !== 'all') params.tipe = selectedType;
        const res = await api.get('/spaces/availability', { params });
        if (res.data && (res.data.status || res.data.statusCode === 200)) {
          setSpaces(res.data.data || []);
        }
      } else {
        const params: any = {};
        if (selectedType !== 'all') params.tipe = selectedType;
        if (searchKeyword.trim()) params.search = searchKeyword.trim();
        const res = await api.get('/spaces', { params });
        if (res.data && (res.data.status || res.data.statusCode === 200)) {
          setSpaces(res.data.data || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch spaces:', err);
      // Fallback to general list if availability check endpoint is empty
      try {
        const resFallback = await api.get('/spaces');
        if (resFallback.data && (resFallback.data.status || resFallback.data.statusCode === 200)) {
          setSpaces(resFallback.data.data || []);
        }
      } catch {
        setSpaces([]);
      }
    } finally {
      setLoading(false);
    }
  }, [availabilityMode, checkDate, checkStartTime, checkDuration, selectedType, searchKeyword]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedType('all');
    setSelectedCapacity('all');
    setSelectedPriceRange('all');
    setSortBy('default');
    setAvailabilityMode(false);
    setSearchParams({});
    showInfo('Semua filter telah direset.');
  };

  const filteredSpaces = spaces.filter((space) => {
    if (selectedType !== 'all' && space.tipe !== selectedType) return false;
    
    if (selectedCapacity !== 'all') {
      const cap = Number(selectedCapacity);
      if (cap === 1 && space.kapasitas > 1) return false;
      if (cap === 4 && (space.kapasitas < 2 || space.kapasitas > 6)) return false;
      if (cap === 10 && space.kapasitas < 6) return false;
    }

    if (selectedPriceRange !== 'all') {
      const price = space.harga_per_jam || 0;
      if (selectedPriceRange === 'under_50k' && price > 50000) return false;
      if (selectedPriceRange === '50k_150k' && (price < 50000 || price > 150000)) return false;
      if (selectedPriceRange === 'over_150k' && price < 150000) return false;
    }

    if (searchKeyword.trim()) {
      const query = searchKeyword.toLowerCase();
      const title = (space.nama_space || space.nama_ruangan || '').toLowerCase();
      const desc = typeof space.deskripsi === 'string' ? space.deskripsi.toLowerCase() : '';
      const loc = (space.nama_coworking || '').toLowerCase();
      if (!title.includes(query) && !desc.includes(query) && !loc.includes(query)) return false;
    }

    return true;
  });

  // Sort
  const sortedSpaces = [...filteredSpaces].sort((a, b) => {
    if (sortBy === 'price_asc') return (a.harga_per_jam || 0) - (b.harga_per_jam || 0);
    if (sortBy === 'price_desc') return (b.harga_per_jam || 0) - (a.harga_per_jam || 0);
    if (sortBy === 'capacity_desc') return (b.kapasitas || 0) - (a.kapasitas || 0);
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedSpaces.length / pageSize));
  const paginatedSpaces = sortedSpaces.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleBookNow = (space: Space) => {
    navigate(`/ruang/${space.id}`);
  };

  return (
    <MemberLayout>
      <div className="space-y-8 -mt-2 pb-16">
        {/* Header Breadcrumb & Title Bar */}
        <div className="space-y-3 pt-2 border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Beranda</span>
            <span>&gt;</span>
            <span className="text-[#0F382C] font-bold">Katalog Ruang</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#0F382C] bg-[#E6F4F1] px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                KATALOG RUANG KERJA TERPADU
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Pilih Ruangan & Meja Kerja
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Temukan workstation, meeting pod, atau private suite yang cocok dengan jadwal kerjamu.
              </p>
            </div>

            <div className="bg-[#E6F4F1] text-[#0F382C] px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-200/80 flex items-center gap-2 shrink-0">
              <Building2 className="w-4 h-4" />
              <span>{spaces.length} Ruang Terdaftar</span>
            </div>
          </div>
        </div>

        {/* Filter & Live Availability Check Section */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Box */}
            <div className="sm:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Cari nama ruang, gedung, atau fasilitas..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0F382C]"
              />
            </div>

            {/* Jenis Ruang */}
            <div className="sm:col-span-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0F382C] cursor-pointer"
              >
                <option value="all">Semua Tipe Ruang</option>
                <option value="desk">Personal Desk</option>
                <option value="meeting_room">Meeting Room</option>
                <option value="private_office">Private Office</option>
              </select>
            </div>

            {/* Kapasitas */}
            <div className="sm:col-span-2">
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0F382C] cursor-pointer"
              >
                <option value="all">Semua Kapasitas</option>
                <option value="1">1 Orang (Hot Desk)</option>
                <option value="4">2 - 6 Orang (Meeting)</option>
                <option value="10">6+ Orang (Suite)</option>
              </select>
            </div>

            {/* Rentang Harga */}
            <div className="sm:col-span-2">
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0F382C] cursor-pointer"
              >
                <option value="all">Semua Tarif</option>
                <option value="under_50k">&lt; Rp 50.000 / jam</option>
                <option value="50k_150k">Rp 50k - Rp 150k / jam</option>
                <option value="over_150k">&gt; Rp 150.000 / jam</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filter
              </button>
            </div>
          </div>

          {/* Availability Checker Bar */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0F382C]" /> Cek Slot Jam:
              </span>
              <input
                type="date"
                value={checkDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
              />
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={checkStartTime}
                  onChange={(e) => setCheckStartTime(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
                >
                  <option value="08:00">08:00 WIB</option>
                  <option value="09:00">09:00 WIB</option>
                  <option value="10:00">10:00 WIB</option>
                  <option value="13:00">13:00 WIB</option>
                  <option value="15:00">15:00 WIB</option>
                  <option value="18:00">18:00 WIB</option>
                </select>
              </div>
              <select
                value={checkDuration}
                onChange={(e) => setCheckDuration(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
              >
                <option value={1}>Durasi: 1 Jam</option>
                <option value={2}>Durasi: 2 Jam</option>
                <option value={4}>Durasi: 4 Jam</option>
                <option value={8}>Durasi: 8 Jam (Full)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setAvailabilityMode(true);
                fetchSpaces();
              }}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                availabilityMode
                  ? 'bg-[#0F382C] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {availabilityMode ? 'Mode Ketersediaan Aktif' : 'Cek Ketersediaan Real-Time'}
            </button>
          </div>

          {/* Active Filter Chips & Sort Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Filter Aktif:</span>
              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                  Tipe: {selectedType} <X className="w-3 h-3 text-slate-400 cursor-pointer" onClick={() => setSelectedType('all')} />
                </span>
              )}
              {searchKeyword && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                  "{searchKeyword}" <X className="w-3 h-3 text-slate-400 cursor-pointer" onClick={() => setSearchKeyword('')} />
                </span>
              )}
              {availabilityMode && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E6F4F1] text-[#0F382C] font-semibold text-[11px] border border-emerald-200">
                  {checkDate} @ {checkStartTime} ({checkDuration}j) <X className="w-3 h-3 text-[#0F382C] cursor-pointer" onClick={() => setAvailabilityMode(false)} />
                </span>
              )}
              {selectedType === 'all' && !searchKeyword && !availabilityMode && (
                <span className="text-slate-400 text-xs">Menampilkan semua ruangan</span>
              )}
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-semibold">
              <span>Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer"
              >
                <option value="default">Rekomendasi</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="capacity_desc">Kapasitas Terbesar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Space Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-slate-200/60 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : paginatedSpaces.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-700 font-bold text-base">Tidak ada ruang kerja yang cocok</p>
            <p className="text-slate-400 font-medium text-xs max-w-sm mx-auto">
              Coba ganti filter tipe ruangan, jam ketersediaan, atau reset kata kunci pencarian.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#0F382C] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer mt-2"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedSpaces.map((space) => (
              <SpaceCard key={space.id} space={space} onBookNow={handleBookNow} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {sortedSpaces.length > pageSize && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 text-xs text-slate-500 font-medium">
            <p>Menampilkan {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedSpaces.length)} dari {sortedSpaces.length} ruang kerja</p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-colors ${
                    currentPage === num
                      ? 'bg-[#0F382C] text-white'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-[#0F382C] font-bold"
              >
                Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </MemberLayout>
  );
};

export default SpacesPage;
