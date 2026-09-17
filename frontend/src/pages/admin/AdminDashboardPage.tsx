import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import RevenueChart from '../../components/admin/RevenueChart';
import CheckInScanner from '../../components/admin/CheckInScanner';
import StatusBadge from '../../components/admin/StatusBadge';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
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
        showSuccess('Check-In member berhasil! Status reservasi aktif.');
        fetchDashboard();
      }
    } catch (err) {
      try {
        await api.patch(`/admin/reservasi/${resId}/status`, { status: 'aktif' });
        showSuccess('Check-In member berhasil.');
        fetchDashboard();
      } catch (err2) {
        showError('Gagal memproses Check-In');
      }
    }
  };

  const handleCheckOut = async (resId: number) => {
    try {
      const res = await api.post(`/admin/reservasi/${resId}/check-out`);
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        showSuccess('Check-Out member berhasil! Status reservasi selesai.');
        fetchDashboard();
      }
    } catch (err) {
      try {
        await api.patch(`/admin/reservasi/${resId}/status`, { status: 'selesai' });
        showSuccess('Check-Out member berhasil.');
        fetchDashboard();
      } catch (err2) {
        showError('Gagal memproses Check-Out');
      }
    }
  };

  const totalRevenue = report?.realisasi_pendapatan_bersih || report?.estimasi_pendapatan_kotor || 0;
  const totalBookings = report?.total_transaksi || reservations.length;
  const totalHours = report?.total_jam_terpakai || 0;

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <span className="studio-badge">ADMIN CONTROL CENTER</span>
            <h1 className="text-3xl font-display font-black uppercase text-zinc-900 tracking-tight mt-1">DASHBOARD ADMIN SPACE</h1>
            <p className="text-xs text-zinc-500 font-medium">
              Laporan performa pendapatan bulanan, occupancy meter, dan validasi reservasi Studio Eleven
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              className="bg-white border border-zinc-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-zinc-800 cursor-pointer hover:border-red-500"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                <option key={m} value={m}>Bulan {m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="bg-white border border-zinc-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-zinc-800 cursor-pointer hover:border-red-500"
            >
              {[2025, 2026, 2027].map(y => (
                <option key={y} value={y}>Tahun {y}</option>
              ))}
            </select>
            <Button variant="primary" size="sm" icon="fa-solid fa-qrcode" onClick={() => setIsScannerOpen(true)} className="bg-red-600 hover:bg-red-500 text-white font-display font-bold uppercase tracking-wider shadow-red-glow rounded-xl">
              SCANNER PASS
            </Button>
          </div>
        </div>

        {/* Summary Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-zinc-950 text-white rounded-3xl border border-zinc-800 shadow-studio relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-red-600/10 rounded-full blur-xl pointer-events-none" />
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold mb-3 border border-red-600/30">
              <i className="fa-solid fa-dollar-sign text-lg"></i>
            </div>
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">REALISASI PENDAPATAN</span>
            <span className="text-2xl font-display font-black text-white">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-zinc-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold mb-3">
              <i className="fa-solid fa-layer-group text-lg"></i>
            </div>
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">TOTAL JAM TERPAKAI</span>
            <span className="text-2xl font-display font-black text-zinc-900">{totalHours} JAM</span>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-zinc-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold mb-3">
              <i className="fa-solid fa-calendar-check text-lg"></i>
            </div>
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">TOTAL TRANSAKSI</span>
            <span className="text-2xl font-display font-black text-zinc-900">{totalBookings} SESI</span>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-zinc-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold mb-3">
              <i className="fa-solid fa-user-check text-lg"></i>
            </div>
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">TOTAL POTONGAN PROMO</span>
            <span className="text-2xl font-display font-black text-red-600">
              Rp {(report?.total_potongan_diskon || 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Breakdown Per Space Type */}
        {report?.rincian_per_tipe_space && (
          <div className="space-y-4">
            <h3 className="text-lg font-display font-extrabold uppercase text-zinc-900">DISTRIBUSI PENDAPATAN TIPE RUANGAN</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {report.rincian_per_tipe_space.map((tipeItem: any, idx: number) => (
                <div key={idx} className="p-5 bg-white border border-zinc-200 rounded-3xl shadow-soft">
                  <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">{tipeItem.label || tipeItem.tipe}</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-xl font-display font-black text-zinc-900">Rp {tipeItem.total_pendapatan?.toLocaleString('id-ID')}</span>
                    <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                      {tipeItem.total_booking} Booking ({tipeItem.total_jam} jam)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Charts */}
        <RevenueChart
          monthlyTrend={[]}
          roomTypeDistribution={report?.rincian_per_tipe_space || []}
        />

        {/* Recent Reservations Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-extrabold uppercase text-zinc-900">RESERVASI TERBARU</h3>
            <span className="text-xs font-mono text-zinc-500">5 TRANSAKSI TERAKHIR</span>
          </div>
          <div className="overflow-x-auto border border-zinc-200 rounded-3xl bg-white shadow-soft">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-300 font-display font-bold uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-5 py-4">KODE BOOKING</th>
                  <th className="px-5 py-4">PEMESAN</th>
                  <th className="px-5 py-4">SPACE</th>
                  <th className="px-5 py-4">TANGGAL &amp; JAM</th>
                  <th className="px-5 py-4">TOTAL BAYAR</th>
                  <th className="px-5 py-4">STATUS</th>
                  <th className="px-5 py-4 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {reservations.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-red-600">{r.kode_booking || r.kode_reservasi}</td>
                    <td className="px-5 py-4 font-bold text-zinc-900">{r.member?.nama_member || r.nama_pemesan || `Member #${r.id_member}`}</td>
                    <td className="px-5 py-4 uppercase font-display font-bold text-zinc-800">{r.space?.nama_space || r.nama_ruangan || `Space #${r.id_space}`}</td>
                    <td className="px-5 py-4">
                      {r.tanggal_reservasi} <br />
                      <span className="text-zinc-400 font-mono text-[11px]">{r.jam_mulai} - {r.jam_selesai || `${parseInt(r.jam_mulai)+r.durasi_jam}:00`}</span>
                    </td>
                    <td className="px-5 py-4 font-display font-black text-zinc-900">
                      Rp {r.total_bayar?.toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-4 text-right space-x-1">
                      {(r.status === 'disetujui' || r.status === 'belum_dikonfirm') && (
                        <button type="button" onClick={() => handleCheckIn(r.id)} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-display font-bold text-[11px] uppercase tracking-wider cursor-pointer shadow-red-glow">
                          CHECK-IN
                        </button>
                      )}
                      {r.status === 'aktif' && (
                        <button type="button" onClick={() => handleCheckOut(r.id)} className="px-3 py-1.5 bg-zinc-950 hover:bg-black text-white rounded-xl font-display font-bold text-[11px] uppercase tracking-wider cursor-pointer">
                          CHECK-OUT
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
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

