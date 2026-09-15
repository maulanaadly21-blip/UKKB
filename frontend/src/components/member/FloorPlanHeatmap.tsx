import React from 'react';
import { Users, CheckCircle, AlertTriangle } from 'lucide-react';
import Badge from '../common/Badge';
import { Space } from '../../types';

export interface HeatmapSpace extends Space {
  heatmapStatus?: 'tersedia' | 'terisi' | 'promo' | 'maintenance';
}

interface FloorPlanHeatmapProps {
  spaces?: HeatmapSpace[];
  onSelectSpace: (space: HeatmapSpace) => void;
}

const FloorPlanHeatmap: React.FC<FloorPlanHeatmapProps> = ({ spaces = [], onSelectSpace }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Visual Floor Plan Heatmap Matrix
            <Badge variant="emerald" size="xs">Denah Mini Instan</Badge>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Setiap modul mewakili zona meja & ruangan nyata di Coworking Space. Klik modul untuk pemesanan cepat.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Tersedia
          </span>
          <span className="flex items-center gap-1.5 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Terisi
          </span>
          <span className="flex items-center gap-1.5 text-teal-700">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> Promo Active
          </span>
        </div>
      </div>

      {/* Visual Architectural Layout Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
        {spaces.map((space) => {
          const status = space.heatmapStatus || 'tersedia';

          const statusStyles: Record<string, string> = {
            tersedia: 'border-emerald-300 bg-white hover:bg-emerald-50/60 text-slate-900 hover:border-emerald-500',
            terisi: 'border-amber-300 bg-amber-50/70 text-amber-900 cursor-not-allowed opacity-80',
            promo: 'border-teal-300 bg-teal-50/70 text-teal-900 hover:bg-teal-100/70 hover:border-teal-500',
            maintenance: 'border-slate-300 bg-slate-100 text-slate-400 cursor-not-allowed'
          };

          const statusBadgeVariants: Record<string, 'emerald' | 'amber' | 'teal' | 'slate'> = {
            tersedia: 'emerald',
            terisi: 'amber',
            promo: 'teal',
            maintenance: 'slate'
          };

          return (
            <div
              key={space.id}
              onClick={() => {
                if (status !== 'terisi' && status !== 'maintenance') {
                  onSelectSpace(space);
                }
              }}
              className={`p-3.5 rounded-xl border-2 transition-all duration-200 flex flex-col justify-between h-32 relative group cursor-pointer ${statusStyles[status]}`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-extrabold tracking-wider opacity-75">
                  {space.tipe === 'desk' ? 'Flexi Desk' : space.tipe === 'meeting_room' ? 'Meeting Pod' : 'Private Suite'}
                </span>
                <Badge variant={statusBadgeVariants[status]} size="xs">
                  {status === 'tersedia' ? 'Tersedia' : status === 'terisi' ? 'Booked' : status === 'promo' ? 'Promo 20%' : 'Maint'}
                </Badge>
              </div>

              {/* Center Content */}
              <div className="my-1">
                <h4 className="text-xs font-extrabold line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                  {space.nama_ruangan || space.nama_space}
                </h4>
                <p className="text-[11px] font-semibold opacity-80 mt-1">
                  Rp {(space.harga_per_jam || 0).toLocaleString('id-ID')}/jam
                </p>
              </div>

              {/* Footer Capacity */}
              <div className="flex items-center justify-between text-[10px] font-semibold border-t border-slate-200/50 pt-1.5 opacity-80">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {space.kapasitas} Orang
                </span>
                {status === 'tersedia' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                {status === 'terisi' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FloorPlanHeatmap;
