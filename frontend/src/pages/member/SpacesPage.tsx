import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Building
} from 'lucide-react';
import { Space } from '../../types';

const SpacesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showInfo } = useNotification();

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');

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

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedType('all');
    setSelectedCapacity('all');
    setSelectedPriceRange('all');
    setSelectedFacility('all');
    showInfo('Filter katalog ruang telah direset.');
  };

  const filteredSpaces = spaces.filter((space) => {
    if (selectedType !== 'all' && space.tipe !== selectedType) return false;
    if (searchKeyword.trim()) {
      const query = searchKeyword.toLowerCase();
      const title = (space.nama_space || space.nama_ruangan || '').toLowerCase();
      const desc = typeof space.deskripsi === 'string' ? space.deskripsi.toLowerCase() : '';
      const loc = (space.nama_coworking || '').toLowerCase();
      if (!title.includes(query) && !desc.includes(query) && !loc.includes(query)) return false;
    }
    return true;
  });

  const handleBookNow = (space: Space) => {
    navigate(`/checkout/${space.id}`);
  };

  return (
    <MemberLayout>
      <div className="space-y-8 -mt-2 pb-16">
        {/* Header Breadcrumb & Title Bar */}
        <div className="space-y-3 pt-2 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Beranda</span>
            <span>&gt;</span>
            <span className="text-[#0F382C] font-bold">Katalog Ruang</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#0F382C] bg-[#E6F4F1] px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                RUANG PRODUKTIF TERKURASI
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Temukan Ruang Kerja
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Jelajahi berbagai pilihan meja kerja, kantor privat, dan ruang pertemuan sesuai kebutuhan kerja Anda.
              </p>
            </div>

            <div className="bg-[#E6F4F1] text-[#0F382C] px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-200/80 flex items-center gap-2 shrink-0">
              <Building2 className="w-4 h-4" />
              <span>Total 48 Ruang Tersedia</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-slate-100/90 rounded-2xl p-4 shadow-2xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Box */}
            <div className="sm:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Cari nama ruang atau area..."
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
                <option value="all">Jenis Ruang: Semua</option>
                <option value="desk">Hot Desk / Workstation</option>
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
                <option value="all">Kapasitas: Semua</option>
                <option value="1">1 Orang</option>
                <option value="4">2 - 6 Orang</option>
                <option value="10">6 - 20 Orang</option>
              </select>
            </div>

            {/* Rentang Harga */}
            <div className="sm:col-span-2">
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0F382C] cursor-pointer"
              >
                <option value="all">Rentang Harga</option>
                <option value="under_100k">&lt; Rp 100.000 / jam</option>
                <option value="100k_300k">Rp 100.000 - Rp 300.000</option>
                <option value="over_300k">&gt; Rp 300.000 / jam</option>
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

          {/* Active Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Filter Aktif:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                Semua Lokasi <X className="w-3 h-3 text-slate-400 cursor-pointer" />
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E6F4F1] text-[#0F382C] font-semibold text-[11px] border border-emerald-200">
                Tersedia Hari Ini <X className="w-3 h-3 text-[#0F382C] cursor-pointer" />
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-semibold">
              <span>Urutkan:</span>
              <select className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer">
                <option>Paling Populer</option>
                <option>Harga Terendah</option>
                <option>Kapasitas Terbesar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Space Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-slate-200/60 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredSpaces.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl space-y-3">
            <p className="text-slate-500 font-medium text-sm">Tidak ada ruang kerja yang cocok.</p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#0F382C] text-white rounded-xl text-xs font-bold"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => (
              <SpaceCard key={space.id} space={space} onBookNow={handleBookNow} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <p>Menampilkan 1 - {filteredSpaces.length} dari 48 ruang kerja</p>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#0F382C] text-white font-bold flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex items-center justify-center">
              2
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex items-center justify-center">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex items-center justify-center">
              8
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1 text-[#0F382C] font-bold">
              Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Enterprise Office Banner */}
        <div className="bg-[#E6F4F1] border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#0F382C] text-white flex items-center justify-center shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                Kebutuhan Kantor Skala Perusahaan?
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Hubungi Enterprise Specialist kami untuk rancangan custom suite dan sewa jangka panjang.
              </p>
            </div>
          </div>

          <button
            onClick={() => showInfo('Menghubungkan ke Tim Enterprise Specialist SmartSpace...')}
            className="px-5 py-2.5 bg-[#0F382C] hover:bg-[#0b2b22] text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
          >
            Konsultasi Enterprise
          </button>
        </div>
      </div>
    </MemberLayout>
  );
};

export default SpacesPage;
