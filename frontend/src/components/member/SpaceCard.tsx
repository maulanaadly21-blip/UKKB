import React, { useState, useEffect } from 'react';
import { MapPin, Users, Heart, ArrowRight } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { Space } from '../../types';

interface SpaceCardProps {
  space: Space;
  onBookNow: (space: Space) => void;
  variant?: string;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space, onBookNow, variant = 'default' }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { showSuccess, showInfo } = useNotification();
  const isAvailable = space.liveStatus !== 'terisi' && space.status !== 'dibatalkan';

  useEffect(() => {
    const favorites: number[] = JSON.parse(localStorage.getItem('favorite_spaces') || '[]');
    if (favorites.includes(space.id)) {
      setIsLiked(true);
    }
  }, [space.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites: number[] = JSON.parse(localStorage.getItem('favorite_spaces') || '[]');
    let newFavorites: number[];
    const name = space.nama_space || space.nama_ruangan || 'Ruangan';
    if (isLiked) {
      newFavorites = favorites.filter((id) => id !== space.id);
      showInfo(`Dihapus dari favorit: ${name}`);
    } else {
      newFavorites = [...favorites, space.id];
      showSuccess(`Ditambahkan ke favorit: ${name}`);
    }
    localStorage.setItem('favorite_spaces', JSON.stringify(newFavorites));
    setIsLiked(!isLiked);
  };

  const formatPrice = (price?: number) => {
    return new Intl.NumberFormat('id-ID').format(price || 0);
  };

  const getTypeLabel = (tipe?: string) => {
    if (tipe === 'private_office') return 'Private Office';
    if (tipe === 'meeting_room') return 'Meeting Room';
    return 'Hot Desk';
  };

  const getUnit = (tipe?: string) => {
    if (tipe === 'private_office') return '/ bulan';
    if (tipe === 'meeting_room') return '/ jam';
    return '/ jam';
  };

  const getImageUrl = (spaceObj: Space) => {
    if (spaceObj.foto_url) return spaceObj.foto_url;
    if (spaceObj.foto) {
      if (spaceObj.foto.startsWith('http')) return spaceObj.foto;
      return `http://localhost:5001/uploads/spaces/${spaceObj.foto}`;
    }
    return spaceObj.foto_ruangan || 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80';
  };

  const locationName = space.nama_coworking || 'SCBD Tower, Jakarta Selatan';
  const specsText = typeof space.deskripsi === 'string' ? space.deskripsi : 'High-speed Wi-Fi, Stopkontak Mandiri';

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Card Image Container */}
        <div className="relative h-48 overflow-hidden bg-slate-100">
          <img
            src={getImageUrl(space)}
            alt={space.nama_space || space.nama_ruangan || 'Space Image'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Top-Left Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full shadow-2xs bg-white/95 text-slate-800 border border-slate-200/60 backdrop-blur-xs">
              {getTypeLabel(space.tipe)}
            </span>
          </div>

          {/* Bottom-Left Availability Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#E6F4F1] text-[#0F382C] border border-emerald-200/80 backdrop-blur-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F382C]"></span>
              Tersedia Hari Ini
            </span>
          </div>

          {/* Top-Right Heart Favorite Button */}
          <button
            type="button"
            onClick={toggleFavorite}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer ${
              isLiked ? 'bg-rose-50 text-rose-500 border border-rose-200' : 'bg-white/90 text-slate-600 hover:text-rose-500'
            }`}
            title={isLiked ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Card Content Body */}
        <div className="p-4 space-y-2">
          {/* Space Title */}
          <h3 className="text-base font-extrabold text-slate-900 line-clamp-1 group-hover:text-[#0F382C] transition-colors">
            {space.nama_space || space.nama_ruangan}
          </h3>

          {/* Location */}
          <p className="text-xs text-slate-500 flex items-center gap-1 font-medium truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{locationName}</span>
          </p>

          {/* Capacity & Specs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium truncate pt-1">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold">{space.kapasitas || 1} Orang</span>
            <span>•</span>
            <span className="truncate text-slate-500">{specsText}</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Action Button */}
      <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Tarif Mulai</span>
          <p className="text-sm font-black text-slate-900">
            Rp {formatPrice(space.harga_per_jam)}
            <span className="text-xs font-normal text-slate-500 ml-0.5">{getUnit(space.tipe)}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => onBookNow(space)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer bg-[#EBF3F9] hover:bg-[#dcebf5] text-[#1E40AF] flex items-center gap-1"
        >
          Detail
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SpaceCard;
