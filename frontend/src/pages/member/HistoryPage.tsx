import React, { useState, useEffect } from 'react';
import MemberLayout from '../../components/layout/MemberLayout';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/admin/StatusBadge';
import ETicketModal from '../../components/member/ETicketModal';
import Button from '../../components/common/Button';
import api from '../../api/axios';
import { History, QrCode, Calendar, Clock, DollarSign, Building } from 'lucide-react';
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
          const totalSpent = payloadData.reduce((acc: number, item: any) => acc + (item.total_bayar || 0), 0);
          setHistoryData({
            total_reservasi: payloadData.length,
            total_pengeluaran: totalSpent,
            items: payloadData
          });
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
      } else {
        setSelectedETicket(resItem);
        setIsETicketOpen(true);
      }
    } catch {
      setSelectedETicket(resItem);
      setIsETicketOpen(true);
    }
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <MemberLayout>
      <div className="max-w-4xl mx-auto space-y-6 -mt-2 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F382C] block">
              ARSIP PEMESANAN BULANAN
            </span>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <History className="w-6 h-6 text-[#0F382C]" /> Histori Pemesanan Member
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Lihat rekapitulasi pemesanan, jadwal penggunaan, dan nota e-ticket per bulan.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer shadow-2xs"
            >
              {monthNames.map((name, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer shadow-2xs"
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  Tahun {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#E6F4F1] border border-emerald-200 rounded-2xl p-5 shadow-2xs">
            <span className="text-xs font-bold text-[#0F382C] block">Total Pemesanan Bulan {monthNames[selectedMonth - 1]}</span>
            <span className="text-2xl font-black text-[#0F382C] mt-1 block">
              {historyData.total_reservasi || historyData.items.length} Reservasi
            </span>
          </div>
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 block">Total Pengeluaran Selesai</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              Rp {(historyData.total_pengeluaran || 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-200/60 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : !historyData.items || historyData.items.length === 0 ? (
          <Card className="text-center py-16 text-slate-500 text-xs font-medium space-y-2">
            <History className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">Tidak ada riwayat pemesanan</p>
            <p>Belum ada transaksi tercatat untuk periode {monthNames[selectedMonth - 1]} {selectedYear}.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {historyData.items.map((resItem) => {
              const bookingCode = resItem.kode_booking || resItem.kode_reservasi || `RES-${resItem.id}`;
              const spaceName = resItem.space?.nama_space || resItem.nama_space || resItem.nama_ruangan || 'Workspace';
              const locationName = resItem.space?.nama_coworking || resItem.nama_coworking || 'Moklet Hub Coworking';

              return (
                <div
                  key={resItem.id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {bookingCode}
                      </span>
                      <StatusBadge status={resItem.status} />
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900">{spaceName}</h4>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {resItem.tanggal_reservasi}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {resItem.jam_mulai} - {resItem.jam_selesai || `${parseInt(resItem.jam_mulai)+resItem.durasi_jam}:00`} ({resItem.durasi_jam} Jam)
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Biaya</span>
                      <span className="text-base font-black text-[#0F382C]">
                        Rp {resItem.total_bayar?.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" icon={QrCode} onClick={() => handleOpenETicket(resItem)}>
                      Lihat E-Ticket
                    </Button>
                  </div>
                </div>
              );
            })}
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
