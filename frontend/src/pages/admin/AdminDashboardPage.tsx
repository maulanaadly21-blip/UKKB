import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import RevenueChart from '../../components/admin/RevenueChart';
import CheckInScanner from '../../components/admin/CheckInScanner';
import StatusBadge from '../../components/admin/StatusBadge';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { DollarSign, Layers, CalendarCheck, UserCheck, QrCode, CheckCircle, ArrowRight } from 'lucide-react';
import { Reservation } from '../../types';

const AdminDashboardPage: React.FC = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [report, setReport] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const { showSuccess, showError } = useNotification();

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [reportRes, resRes] = await Promise.all([
        api.get('/admin/reports/monthly', { params: { month: selectedMonth, year: selectedYear } }).catch(() => null),
        api.get('/admin/reservasi').catch(() => null)
      ]);

      if (reportRes?.data && (reportRes.data.status || reportRes.data.statusCode === 200)) {
        setReport(reportRes.data.data);
      }
      if (resRes?.data && (resRes.data.status || resRes.data.statusCode === 200)) {
        setReservations(resRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [selectedMonth, selectedYear]);

  const handleCheckIn = async (resId: number) => {
    try {
      const res = await api.post(`/admin/reservasi/${resId}/check-in`);
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        showSuccess('Check-In berhasil! Status reservasi aktif.');
        fetchDashboard();
      } else {
        throw new Error();
      }
    } catch {
      try {
        await api.patch(`/admin/reservasi/${resId}/status`, { status: 'aktif' });
        showSuccess('Check-In member berhasil.');
        fetchDashboard();
      } catch {
        showError('Gagal memproses Check-In');
      }
    }
  };

  const handleCheckOut = async (resId: number) => {
    try {
      const res = await api.post(`/admin/reservasi/${resId}/check-out`);
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        showSuccess('Check-Out berhasil! Status reservasi selesai.');
        fetchDashboard();
      } else {
        throw new Error();
      }
    } catch {
      try {
        await api.patch(`/admin/reservasi/${resId}/status`, { status: 'selesai' });
        showSuccess('Check-Out member berhasil.');
        fetchDashboard();
      } catch {
        showError('Gagal memproses Check-Out');
      }
    }
  };

  const totalRevenue = report?.realisasi_pendapatan_bersih || report?.estimasi_pendapatan_kotor ||
    reservations.filter(r => r.status === 'aktif' || r.status === 'selesai' || r.status === 'disetujui').reduce((acc, cur) => acc + (cur.total_bayar || 0), 0);
  const totalBookings = report?.total_transaksi || reservations.length;
  const totalHours = report?.total_jam_terpakai || reservations.reduce((acc, cur) => acc + (cur.durasi_jam || 0), 0);
  const totalDiskon = report?.total_potongan_diskon || reservations.reduce((acc, cur) => acc + (cur.potongan_diskon || 0), 0);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F382C] block">
              PANEL PENGELOLA COWORKING
            </span>
            <h1 className="text-2xl font-black text-slate-900">Dashboard & Rekapitulasi Laporan</h1>
            <p className="text-xs text-slate-500">
              Estimasi pendapatan bulanan, status ketersediaan, dan transaksi aktif
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 cursor-pointer shadow-2xs"
            >
              {monthNames.map((m, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  Bulan {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 cursor-pointer shadow-2xs"
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  Tahun {y}
                </option>
              ))}
            </select>
            <Button variant="primary" size="sm" icon={QrCode} onClick={() => setIsScannerOpen(true)}>
              Scanner QR
            </Button>
          </div>
        </div>

        {/* Summary Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center gap-4 bg-white border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F4F1] text-[#0F382C] flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Pendapatan</span>
              <span className="text-xl font-extrabold text-slate-900">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </span>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4 bg-white border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Jam Terpakai</span>
              <span className="text-xl font-extrabold text-slate-900">{totalHours} Jam</span>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4 bg-white border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Pemesanan</span>
              <span className="text-xl font-extrabold text-slate-900">{totalBookings} Transaksi</span>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4 bg-white border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Potongan Voucher</span>
              <span className="text-xl font-extrabold text-amber-700">
                Rp {totalDiskon.toLocaleString('id-ID')}
              </span>
            </div>
          </Card>
        </div>

        {/* Analytics Charts */}
        <RevenueChart
          monthlyTrend={[
            { bulan: 'Jan', total_pendapatan: Math.round(totalRevenue * 0.7) },
            { bulan: 'Feb', total_pendapatan: Math.round(totalRevenue * 0.85) },
            { bulan: 'Mar', total_pendapatan: totalRevenue }
          ]}
          roomTypeDistribution={report?.rincian_per_tipe_space || [
            { tipe: 'desk', total_pendapatan: Math.round(totalRevenue * 0.4) },
            { tipe: 'meeting_room', total_pendapatan: Math.round(totalRevenue * 0.35) },
            { tipe: 'private_office', total_pendapatan: Math.round(totalRevenue * 0.25) }
          ]}
        />

        {/* Recent Reservations Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Reservasi Terbaru Masuk</h3>
            <span className="text-xs text-slate-400 font-medium">Menampilkan 5 transaksi terakhir</span>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Kode Booking</th>
                  <th className="px-4 py-3">Pelanggan</th>
                  <th className="px-4 py-3">Space Ruangan</th>
                  <th className="px-4 py-3">Jadwal Penggunaan</th>
                  <th className="px-4 py-3">Total Bayar</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      Belum ada transaksi reservasi yang tercatat.
                    </td>
                  </tr>
                ) : (
                  reservations.slice(0, 5).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[#0F382C]">
                        {r.kode_booking || r.kode_reservasi || `#${r.id}`}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {r.member?.nama_member || r.nama_pemesan || `Member #${r.id_member}`}
                      </td>
                      <td className="px-4 py-3">
                        {r.space?.nama_space || r.nama_ruangan || `Space #${r.id_space}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900">{r.tanggal_reservasi}</span>
                        <br />
                        <span className="text-slate-400 text-[11px]">{r.jam_mulai} - {r.jam_selesai || `${parseInt(r.jam_mulai)+r.durasi_jam}:00`} ({r.durasi_jam} jam)</span>
                      </td>
                      <td className="px-4 py-3 font-extrabold text-slate-900">
                        Rp {r.total_bayar?.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3 text-right space-x-1">
                        {(r.status === 'disetujui' || r.status === 'belum_dikonfirm') && (
                          <Button variant="primary" size="xs" icon={CheckCircle} onClick={() => handleCheckIn(r.id)}>
                            Check-In
                          </Button>
                        )}
                        {r.status === 'aktif' && (
                          <Button variant="secondary" size="xs" icon={ArrowRight} onClick={() => handleCheckOut(r.id)}>
                            Check-Out
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CheckInScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        reservations={reservations}
      />
    </AdminLayout>
  );
};

export default AdminDashboardPage;
