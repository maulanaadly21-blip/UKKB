import React from 'react';
import { SlidersHorizontal, Check, RefreshCw } from 'lucide-react';

interface AmenityItem {
  id: string;
  label: string;
  icon: string;
}

const amenitiesList: AmenityItem[] = [
  { id: 'wifi', label: 'Fiber Wi-Fi 1Gbps', icon: '📶' },
  { id: 'monitor', label: 'Monitor 4K / TV', icon: '🖥️' },
  { id: 'chair', label: 'Ergonomic Chair', icon: '🪑' },
  { id: 'coffee', label: 'Artisan Coffee/Tea', icon: '☕' },
  { id: 'soundproof', label: 'Soundproof Room', icon: '🎙️' }
];

interface AmenityMatcherProps {
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  onResetFilters: () => void;
}

const AmenityMatcher: React.FC<AmenityMatcherProps> = ({
  selectedAmenities,
  setSelectedAmenities,
  selectedType,
  setSelectedType,
  onResetFilters
}) => {
  const toggleAmenity = (label: string) => {
    if (selectedAmenities.includes(label)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== label));
    } else {
      setSelectedAmenities([...selectedAmenities, label]);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-soft mb-8">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-emerald-700" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Workspace Amenity Matcher & Filter
          </h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Filter
        </button>
      </div>

      <div className="space-y-4">
        {/* Tipe Ruangan Selector */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Tipe Ruangan Kerja
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Semua Tipe' },
              { id: 'desk', label: 'Dedicated Desk' },
              { id: 'meeting_room', label: 'Meeting Room' },
              { id: 'private_office', label: 'Private Office' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === type.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fasilitas Chips */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Pilih Fasilitas Wajib (Amenity Matcher)
          </label>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map((item) => {
              const isSelected = selectedAmenities.includes(item.label);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleAmenity(item.label)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenityMatcher;
