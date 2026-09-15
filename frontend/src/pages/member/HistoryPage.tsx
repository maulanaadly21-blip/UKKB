import React, { useState, useEffect } from 'react';
import MemberLayout from '../../components/layout/MemberLayout';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/admin/StatusBadge';
import ETicketModal from '../../components/member/ETicketModal';
import Button from '../../components/common/Button';
import api from '../../api/axios';
import { History, QrCode } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <History className="w-6 h-6 text-emerald-700" /> Histori Pemesanan Bulanan
            </h1>
            <p className="text-xs text-slate-500">Arsip transaksi dan reservasi space Anda (UKK Paket B)</p>
          </div>

          {/* Filter Bar */}
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                <option key={m} value={m}>Bulan {m}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {[2025, 2026, 2027].map(y => (
                <option key={y} value={y}>Tahun {y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Card */}
        {(historyData.total_pengeluaran || 0) > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <span className="text-xs font-semibold text-emerald-700 block">Total Reservasi</span>
              <span className="text-xl font-extrabold text-emerald-900">{historyData.total_reservasi || historyData.items.length} Pesanan</span>
            </div>
            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4">
              <span className="text-xs font-semibold text-slate-600 block">Total Pengeluaran</span>
              <span className="text-xl font-extrabold text-slate-900">Rp {(historyData.total_pengeluaran || 0).toLocaleString('id-ID')}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-200/60 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : !historyData.items || historyData.items.length === 0 ? (
          <Card className="text-center py-12 text-slate-500 text-sm">
            Tidak ada riwayat pemesanan untuk Bulan {selectedMonth} {selectedYear}.
          </Card>
        ) : (
          <div className="space-y-3">
            {historyData.items.map((resItem) => (
              <Card key={resItem.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-700">{resItem.kode_booking || resItem.kode_reservasi}</span>
                    <StatusBadge status={resItem.status} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{resItem.space_name || resItem.nama_space || resItem.nama_ruangan}</h4>
                  <p className="text-xs text-slate-500">
                    {resItem.tanggal_reservasi} • {resItem.jam_mulai} - {resItem.jam_selesai || `${parseInt(resItem.jam_mulai)+resItem.durasi_jam}:00`} ({resItem.durasi_jam} Jam)
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-sm font-extrabold text-slate-900">
                    Rp {resItem.total_bayar?.toLocaleString('id-ID')}
                  </span>
                  <Button variant="outline" size="sm" icon={QrCode} onClick={() => handleOpenETicket(resItem)}>
                    E-Ticket
                  </Button>
                </div>
              </Card>
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
