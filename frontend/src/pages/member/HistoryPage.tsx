import React, { useState, useEffect } from 'react';
import MemberLayout from '../../components/layout/MemberLayout';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/admin/StatusBadge';
import ETicketModal from '../../components/member/ETicketModal';
import Button from '../../components/common/Button';
import api from '../../api/axios';
import { Reservation } from '../../types';

const HistoryPage: React.FC = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [historyData, setHistoryData] = useState<{ total_reservasi?: number; total_pengeluaran?: number; items: any[] }>({ total_reservasi: 0, total_pengeluaran: 0, items: [] });
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedETicket, setSelectedETicket] = useState<Reservation | null>(null);
  const [isETicketOpen, setIsETicketOpen] = useState<boolean>(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {
        month: selectedMonth,
        year: selectedYear
      };
      const res = await api.get('/reservasi/my/history', { params });
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        const payloadData = res.data.data;
        if (Array.isArray(payloadData)) {
          setHistoryData({ items: payloadData });
        } else if (payloadData && payloadData.items) {
          setHistoryData(payloadData);
        } else {
          setHistoryData({ items: [] });
        }
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setHistoryData({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedMonth, selectedYear]);

  const handleOpenETicket = async (resItem: any) => {
    try {
      const res = await api.get(`/reservasi/${resItem.id}/e-ticket`);
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        setSelectedETicket(res.data.data);
        setIsETicketOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MemberLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <div className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              DIGITAL LOGS &amp; TRANSACTIONS
            </div>
            <h1 className="text-3xl font-display font-black text-zinc-900 uppercase tracking-tight flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-red-600 text-2xl"></i> HISTORI RESERVASI
            </h1>
            <p className="text-xs text-zinc-500 font-medium">Arsip transaksi dan pas masuk digital Studio Eleven Anda</p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200">
            <i className="fa-solid fa-filter text-zinc-400 text-xs ml-2"></i>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-zinc-800 focus:outline-none cursor-pointer hover:border-red-500"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                <option key={m} value={m}>Bulan {m}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-zinc-800 focus:outline-none cursor-pointer hover:border-red-500"
            >
              {[2025, 2026, 2027].map(y => (
                <option key={y} value={y}>Tahun {y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Metric Cards */}
        {(historyData.total_pengeluaran || 0) > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-950 text-white rounded-3xl p-6 border border-zinc-800 shadow-studio relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
              <span className="text-xs font-mono font-bold text-zinc-400 block mb-1 uppercase tracking-wider">Total Reservasi Terkonfirmasi</span>
              <div className="text-3xl font-display font-black text-white">
                {historyData.total_reservasi || historyData.items.length} <span className="text-red-500 text-sm font-normal">SESI</span>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-soft">
              <span className="text-xs font-mono font-bold text-zinc-500 block mb-1 uppercase tracking-wider">Total Pengeluaran Bulan Ini</span>
              <div className="text-3xl font-display font-black text-zinc-900">
                Rp {(historyData.total_pengeluaran || 0).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        )}

        {/* Reservations List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-zinc-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : !historyData.items || historyData.items.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
              <i className="fa-solid fa-clock-rotate-left text-xl"></i>
            </div>
            <h3 className="font-display font-bold text-base text-zinc-800 uppercase">BELUM ADA RIWAYAT</h3>
            <p className="text-xs text-zinc-500">
              Tidak ada riwayat pemesanan yang tercatat untuk Bulan {selectedMonth} {selectedYear}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {historyData.items.map((resItem) => (
              <div key={resItem.id} className="bg-white border border-zinc-200/90 hover:border-zinc-300 rounded-3xl p-6 shadow-soft hover:shadow-studio transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 bg-zinc-950 text-white rounded-lg">
                      {resItem.kode_booking || resItem.kode_reservasi}
                    </span>
                    <StatusBadge status={resItem.status} />
                  </div>
                  <h4 className="text-lg font-display font-extrabold text-zinc-900 uppercase">
                    {resItem.space_name || resItem.nama_space || resItem.nama_ruangan}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 font-medium">
                    <span className="flex items-center gap-1"><i className="fa-solid fa-calendar text-red-500 text-xs"></i> {resItem.tanggal_reservasi}</span>
                    <span>•</span>
                    <span>{resItem.jam_mulai} - {resItem.jam_selesai || `${parseInt(resItem.jam_mulai)+resItem.durasi_jam}:00`} ({resItem.durasi_jam} Jam)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono text-zinc-400 block uppercase">TOTAL BAYAR</span>
                    <span className="text-lg font-display font-black text-zinc-900">
                      Rp {resItem.total_bayar?.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenETicket(resItem)}
                    className="px-4 py-2.5 bg-zinc-950 hover:bg-red-600 text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-soft flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <i className="fa-solid fa-qrcode text-red-400 text-sm"></i>
                    <span>E-TICKET</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ETicketModal
        isOpen={isETicketOpen}
        onClose={() => setIsETicketOpen(false)}
        reservation={selectedETicket}
      />
    </MemberLayout>
  );
};

export default HistoryPage;

