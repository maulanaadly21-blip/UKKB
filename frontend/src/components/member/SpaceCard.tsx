import React, { useState, useEffect } from 'react';
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
    <div className="bg-white border border-zinc-200/80 rounded-3xl overflow-hidden shadow-soft hover:shadow-studio hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Card Image Container */}
        <div className="relative h-52 overflow-hidden bg-zinc-100">
          <img
            src={getImageUrl(space)}
            alt={space.nama_space || space.nama_ruangan || 'Space Image'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Top-Left Category Badge with Red Dot */}
          <div className="absolute top-3.5 left-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs bg-white/95 text-zinc-900 border border-zinc-200 backdrop-blur-md flex items-center gap-1.5 font-display">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              {getTypeLabel(space.tipe)}
            </span>
          </div>

          {/* Bottom-Left Availability Badge */}
          <div className="absolute bottom-3.5 left-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-950/80 text-white border border-zinc-800 backdrop-blur-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Tersedia Hari Ini
            </span>
          </div>

          {/* Top-Right Heart Favorite Button */}
          <button
            type="button"
            onClick={toggleFavorite}
            className={`absolute top-3.5 right-3.5 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer ${
              isLiked ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-white/90 text-zinc-600 hover:text-red-600'
            }`}
            title={isLiked ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
          >
            <i className={`${isLiked ? 'fa-solid fa-heart text-red-600' : 'fa-regular fa-heart'} text-xs`}></i>
          </button>
        </div>

        {/* Card Content Body */}
        <div className="p-5 space-y-2.5">
          {/* Space Title */}
          <h3 className="text-base font-display font-extrabold uppercase text-zinc-900 line-clamp-1 group-hover:text-red-600 transition-colors tracking-tight">
            {space.nama_space || space.nama_ruangan}
          </h3>

          {/* Location */}
          <p className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium truncate">
            <i className="fa-solid fa-location-dot text-zinc-400 shrink-0 text-xs"></i>
            <span className="truncate">{locationName}</span>
          </p>

          {/* Capacity & Specs */}
          <div className="flex items-center gap-2 text-xs text-zinc-600 font-medium truncate pt-1">
            <i className="fa-solid fa-users text-zinc-400 shrink-0 text-xs"></i>
            <span className="font-bold text-zinc-900">{space.kapasitas || 1} Orang</span>
            <span className="text-zinc-300">•</span>
            <span className="truncate text-zinc-500">{specsText}</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Action Button */}
      <div className="p-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
        <div>
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest block">Tarif Mulai</span>
          <p className="text-sm font-display font-extrabold text-zinc-900">
            Rp {formatPrice(space.harga_per_jam)}
            <span className="text-xs font-normal text-zinc-400 ml-0.5">{getUnit(space.tipe)}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => onBookNow(space)}
          className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer bg-red-600 hover:bg-red-500 text-white shadow-red-glow flex items-center gap-1.5"
        >
          Lihat Space
          <i className="fa-solid fa-arrow-right text-xs"></i>
        </button>
      </div>
    </div>
  );
};

export default SpaceCard;
