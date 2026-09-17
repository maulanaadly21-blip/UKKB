import React, { ChangeEvent } from 'react'; 

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
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <i className="fa-solid fa-clock text-base"></i>
          </div>
          <div>
            <h3 className="text-base font-display font-extrabold text-slate-900 uppercase flex items-center gap-2">
              Smart Focus Heatmap &amp; Schedule Slider
              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Status
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Geser jam pemesanan untuk memperlihatkan status ketersediaan meja &amp; ruangan secara instan.
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 shrink-0">
          <i className="fa-solid fa-calendar-days text-red-600 text-sm"></i>
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
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

        <div className="bg-zinc-950 text-white border border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-studio">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-red-400 tracking-wider block">
              TOTAL DURASI PEMESANAN
            </span>
            <span className="text-xl font-display font-black text-white">{duration} JAM KERJA</span>
          </div>
          <i className="fa-solid fa-wand-magic-sparkles text-red-500 text-xl animate-pulse"></i>
        </div>
      </div>

      {/* Visual Slot Heatmap Indicator Bar */}
      <div className="mt-5 pt-4 border-t border-zinc-100">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 mb-2">
          <span className="font-display font-bold uppercase text-zinc-900">Rentang Jam Kerja Hari Ini</span>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span> Tersedia
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 inline-block"></span> Terisi
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
                className={`py-2 rounded-xl text-[10px] font-mono font-bold transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-red-glow scale-105'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
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
