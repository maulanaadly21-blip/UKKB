import React, { ChangeEvent } from 'react';
import { Clock, Calendar, Sparkles } from 'lucide-react';

const timeSlots: string[] = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

interface TimeSliderProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
}

const TimeSlider: React.FC<TimeSliderProps> = ({
  selectedDate,
  setSelectedDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime
}) => {
  const duration = (() => {
    const s = parseInt(startTime.split(':')[0], 10);
    const e = parseInt(endTime.split(':')[0], 10);
    return Math.max(1, e - s);
  })();

  const handleStartChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newStart = e.target.value;
    setStartTime(newStart);
    const sIdx = timeSlots.indexOf(newStart);
    const eIdx = timeSlots.indexOf(endTime);
    if (eIdx <= sIdx && sIdx < timeSlots.length - 1) {
      setEndTime(timeSlots[sIdx + 1]);
    }
  };

  const handleEndChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newEnd = e.target.value;
    const sIdx = timeSlots.indexOf(startTime);
    const eIdx = timeSlots.indexOf(newEnd);
    if (eIdx > sIdx) {
      setEndTime(newEnd);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-soft mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Smart Focus Heatmap & Schedule Slider
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Status
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Geser jam pemesanan untuk memperlihatkan status ketersediaan meja & ruangan secara instan.
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 shrink-0">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Interactive Time Range Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Jam Mulai Pemesanan
          </label>
          <select
            value={startTime}
            onChange={handleStartChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {timeSlots.slice(0, -1).map((time) => (
              <option key={time} value={time}>
                {time} WIB
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Jam Selesai Pemesanan
          </label>
          <select
            value={endTime}
            onChange={handleEndChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {timeSlots.map((time) => {
              const sIdx = timeSlots.indexOf(startTime);
              const tIdx = timeSlots.indexOf(time);
              if (tIdx <= sIdx) return null;
              return (
                <option key={time} value={time}>
                  {time} WIB
                </option>
              );
            })}
          </select>
        </div>

        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              Total Durasi Pemesanan
            </span>
            <span className="text-lg font-extrabold text-emerald-900">{duration} Jam Kerja</span>
          </div>
          <Sparkles className="w-6 h-6 text-emerald-600 animate-pulse" />
        </div>
      </div>

      {/* Visual Slot Heatmap Indicator Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
          <span>Rentang Jam Kerja Hari Ini</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> Tersedia
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Terisi / Booked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block"></span> Promo Voucher
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
          {timeSlots.map((t) => {
            const isSelected =
              timeSlots.indexOf(t) >= timeSlots.indexOf(startTime) &&
              timeSlots.indexOf(t) < timeSlots.indexOf(endTime);
            return (
              <button
                key={t}
                onClick={() => {
                  setStartTime(t);
                  const nextIdx = Math.min(timeSlots.length - 1, timeSlots.indexOf(t) + 2);
                  setEndTime(timeSlots[nextIdx]);
                }}
                className={`py-2 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-emerald-glow scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeSlider;
