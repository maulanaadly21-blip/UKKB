import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import SpaceCard from '../../components/member/SpaceCard';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';
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
      <div className="space-y-16 -mt-2 pb-24">
        {/* ============================================================ */}
        {/* 1. HERO SECTION - STUDIO ELEVEN ARCHITECTURAL BANNER */}
        {/* ============================================================ */}
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white p-8 sm:p-12 md:p-16 border border-zinc-800 shadow-2xl min-h-[460px] flex flex-col justify-between group">
          {/* Background Image with Dark Overlay */}
          <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')` }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>

          {/* Top Bar inside Hero */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 font-display">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Studio Eleven Workspaces
            </div>

            <div className="inline-flex items-center gap-2 bg-zinc-900/90 text-zinc-200 border border-zinc-800 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Database Updated
            </div>
          </div>

          {/* Main Hero Headline */}
          <div className="relative z-10 text-center my-12 space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase tracking-wider text-white drop-shadow-md">
              CO-WORKING <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">SPACE</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium max-w-2xl mx-auto tracking-wide">
              Architectural workstation design tailored for high-focus professionals, tech innovators, and creative teams.
            </p>
          </div>

          {/* Bottom Floating Filter & Search Bar */}
          <div className="relative z-10 bg-white/95 backdrop-blur-md border border-zinc-200 text-zinc-900 rounded-2xl sm:rounded-full p-2.5 sm:p-3 shadow-xl max-w-4xl mx-auto w-full grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
            {/* Search Input */}
            <div className="sm:col-span-4 relative pl-3">
              <i className="fa-solid fa-magnifying-glass text-zinc-400 text-xs absolute left-4 top-3.5"></i>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Cari lokasi atau nama space..."
                className="w-full pl-9 pr-3 py-2 bg-transparent text-xs font-bold text-zinc-900 focus:outline-none placeholder:text-zinc-400"
              />
            </div>

            {/* Type Dropdown */}
            <div className="sm:col-span-3 border-t sm:border-t-0 sm:border-l border-zinc-200 pl-3">
              <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block">Tipe Space</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Tipe</option>
                <option value="desk">Personal Hot Desk</option>
                <option value="meeting_room">Meeting Room</option>
                <option value="private_office">Private Office</option>
              </select>
            </div>

            {/* Capacity Dropdown */}
            <div className="sm:col-span-3 border-t sm:border-t-0 sm:border-l border-zinc-200 pl-3">
              <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block">Kapasitas Tim</label>
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Kapasitas</option>
                <option value="1">1 Orang</option>
                <option value="4">2 - 6 Orang</option>
                <option value="10">6 - 20 Orang</option>
              </select>
            </div>

            {/* Red Action Search Button */}
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={() => fetchSpaces()}
                className="w-full sm:w-11 h-11 bg-red-600 hover:bg-red-500 text-white rounded-xl sm:rounded-full flex items-center justify-center shadow-red-glow transition-transform active:scale-95 cursor-pointer"
                title="Cari Sekarang"
              >
                <i className="fa-solid fa-magnifying-glass text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. ABOUT US & STATS SECTION */}
        {/* ============================================================ */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-8 sm:p-12 shadow-soft grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Narrative */}
          <div className="md:col-span-7 space-y-4">
            <span className="studio-badge">Fit Out & Architectural Interior</span>
            <h2 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-tight text-zinc-900">
              ABOUT US
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
              Designing spaces. Delivering properties. We are a hybrid studio and network of prime co-working hubs shaping both space strategy and how they're operated.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/tentang')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-colors cursor-pointer"
              >
                DISCOVER MORE <span className="w-2 h-2 rounded-full bg-red-600"></span>
              </button>
            </div>
          </div>

          {/* Right Column: Key Stats */}
          <div className="md:col-span-5 grid grid-cols-1 gap-6 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-zinc-200 pt-6 md:pt-0">
            <div className="border-b border-zinc-100 pb-4">
              <span className="text-3xl sm:text-4xl font-display font-black text-zinc-900 block">25+</span>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Hub Locations Nationwide</span>
            </div>
            <div className="border-b border-zinc-100 pb-4">
              <span className="text-3xl sm:text-4xl font-display font-black text-zinc-900 block">365+</span>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Dedicated Workstations</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-display font-black text-red-600 block">95%</span>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Member Satisfaction Rate</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. OUR EXPERTISE & CATALOG GRID SECTION */}
        {/* ============================================================ */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
            <div className="space-y-2">
              <span className="studio-badge">Ruang Kerja Terkurasi</span>
              <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-zinc-900 tracking-tight">
                OUR EXPERTISE
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'SEMUA RUANG' },
                { id: 'desk', label: 'PERSONAL DESK' },
                { id: 'meeting_room', label: 'MEETING ROOM' },
                { id: 'private_office', label: 'PRIVATE OFFICE' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all cursor-pointer ${
                    selectedType === tab.id
                      ? 'bg-red-600 text-white shadow-red-glow'
                      : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Space Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-zinc-200/60 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredSpaces.length === 0 ? (
            <div className="text-center py-16 bg-white border border-zinc-200 rounded-3xl space-y-4">
              <p className="text-zinc-500 font-medium text-sm">Tidak ada ruang kerja yang sesuai kriteria pencarian.</p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-red-glow"
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
        </div>

        {/* ============================================================ */}
        {/* 4. FEATURED PROJECT / FEATURED SHOWCASE CARD */}
        {/* ============================================================ */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl overflow-hidden shadow-soft space-y-6">
          <div className="p-8 sm:p-10 pb-0">
            <span className="studio-badge">Featured Workspace Showcase</span>
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-zinc-900 tracking-tight mt-1">
              FEATURED PROJECT
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-10 pt-0">
            {/* Left Image */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 group">
              <img
                src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80"
                alt="Lumen Cabin Featured Space"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-950 text-white border border-zinc-800">
                  - SHOWCASE SUITE
                </span>
              </div>
            </div>

            {/* Right Details */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h3 className="text-2xl font-display font-black uppercase text-zinc-900">
                  LUMEN CABIN WORKSUITE
                </h3>
                <p className="text-xs text-zinc-500 font-medium mt-2 leading-relaxed">
                  Ruang pertemuan eksklusif berstandar internasional dengan pencahayaan alami, akustik suara kedap, dan perabot ergonomis Vitra.
                </p>
              </div>

              {/* Spec Badges Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">Kapasitas</span>
                  <span className="text-base font-display font-bold text-zinc-900">12 - 16 Orang</span>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">Koneksi</span>
                  <span className="text-base font-display font-bold text-zinc-900">1 Gbps Fiber</span>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">Fasilitas</span>
                  <span className="text-base font-display font-bold text-zinc-900">Projector 4K</span>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">Akustik</span>
                  <span className="text-base font-display font-bold text-zinc-900">Soundproof</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/ruang')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-red-glow transition-transform active:scale-95 cursor-pointer"
                >
                  RESERVASI SEKARANG
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. TRUSTED CLIENTS & LOGOS SECTION */}
        {/* ============================================================ */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-8 sm:p-12 shadow-soft space-y-8">
          <div className="text-center space-y-2">
            <span className="studio-badge">Kemitraan Terpercaya</span>
            <h2 className="text-2xl font-display font-black uppercase text-zinc-900 tracking-tight">
              OUR PARTNERS & TRUSTED CLIENTS
            </h2>
          </div>

          {/* Testimonial Quote */}
          <div className="max-w-3xl mx-auto bg-zinc-50 border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
              alt="Client Testimonial Avatar"
              className="w-16 h-16 rounded-2xl object-cover border border-zinc-300 shadow-sm shrink-0"
            />
            <div className="space-y-2 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-zinc-700 font-semibold italic leading-relaxed">
                "Studio Eleven merancang ruang kerja kami dengan perpaduan visual spektakuler dan tingkat produktivitas tinggi. Pengalaman sewa terbaik!"
              </p>
              <div>
                <p className="text-xs font-display font-bold text-zinc-900 uppercase">M. MAULANA ADLY</p>
                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Product Manager, Studio Eleven Network</p>
              </div>
            </div>
          </div>

          {/* Brand Partner Logos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {['URBAN SPACE', 'PRO-WORK', 'VITRA STUDIO', 'TRUE WORK'].map((logo, idx) => (
              <div key={idx} className="h-16 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center font-display font-extrabold text-xs text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 transition-colors uppercase tracking-widest">
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 6. DARK STUDIO CTA BANNER - "READY TO SHAPE WHAT'S NEXT?" */}
        {/* ============================================================ */}
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white p-8 sm:p-12 md:p-16 border border-zinc-800 shadow-2xl text-center space-y-6">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-red-600/10 blur-3xl pointer-events-none"></div>

          <span className="studio-badge">Siap Untuk Memulai?</span>
          <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-white max-w-2xl mx-auto leading-tight">
            READY TO SHAPE WHAT'S NEXT?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium max-w-xl mx-auto">
            Reservasi ruang kerja berstandar studio arsitektur terbaik untuk tim Anda hari ini.
          </p>

          <div className="max-w-md mx-auto pt-4">
            <button
              onClick={() => navigate('/ruang')}
              className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-red-glow transition-transform active:scale-95 cursor-pointer"
            >
              JELAJAHI RUANG SEKARANG
            </button>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default SpacesPage;
