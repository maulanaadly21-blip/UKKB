import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import RevenueChart from '../../components/admin/RevenueChart';
import CheckInScanner from '../../components/admin/CheckInScanner';
import StatusBadge from '../../components/admin/StatusBadge';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { DollarSign, Layers, CalendarCheck, UserCheck, QrCode } from 'lucide-react';
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
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Admin Space</h1>
            <p className="text-xs text-slate-500">
              Rekapitulasi laporan pendapatan bulanan dan pengelola reservasi (UKK Paket B)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 cursor-pointer"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                <option key={m} value={m}>Bulan {m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 cursor-pointer"
            >
              {[2025, 2026, 2027].map(y => (
                <option key={y} value={y}>Tahun {y}</option>
              ))}
            </select>
            <Button variant="primary" size="sm" icon={QrCode} onClick={() => setIsScannerOpen(true)}>
              Scanner Check-In/Out
            </Button>
          </div>
        </div>

        {/* Summary Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center gap-4 bg-white border border-slate-200 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pendapatan Bersih</span>
              <span className="text-xl font-extrabold text-slate-900">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </span>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4 bg-white border border-slate-200 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Jam Terpakai</span>
              <span className="text-xl font-extrabold text-slate-900">{totalHours} Jam</span>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4 bg-white border border-slate-200 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Transaksi</span>
              <span className="text-xl font-extrabold text-slate-900">{totalBookings} Transaksi</span>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4 bg-white border border-slate-200 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Potongan Promo</span>
              <span className="text-xl font-extrabold text-amber-700">
                Rp {(report?.total_potongan_diskon || 0).toLocaleString('id-ID')}
              </span>
            </div>
          </Card>
        </div>

        {/* Breakdown Per Space Type */}
        {report?.rincian_per_tipe_space && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">Distribusi Pendapatan Per Tipe Space</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {report.rincian_per_tipe_space.map((tipeItem: any, idx: number) => (
                <Card key={idx} className="p-4 border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{tipeItem.label || tipeItem.tipe}</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-lg font-extrabold text-slate-900">Rp {tipeItem.total_pendapatan?.toLocaleString('id-ID')}</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      {tipeItem.total_booking} Booking ({tipeItem.total_jam} jam)
                    </span>
                  </div>
                </Card>
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
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">Reservasi Terbaru</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-soft">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Kode Booking</th>
                  <th className="px-4 py-3">Pemesan</th>
                  <th className="px-4 py-3">Space</th>
                  <th className="px-4 py-3">Tanggal & Jam</th>
                  <th className="px-4 py-3">Total Bayar</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reservations.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-emerald-800">{r.kode_booking || r.kode_reservasi}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{r.member?.nama_member || r.nama_pemesan || `Member #${r.id_member}`}</td>
                    <td className="px-4 py-3">{r.space?.nama_space || r.nama_ruangan || `Space #${r.id_space}`}</td>
                    <td className="px-4 py-3">
                      {r.tanggal_reservasi} <br />
                      <span className="text-slate-400">{r.jam_mulai} - {r.jam_selesai || `${parseInt(r.jam_mulai)+r.durasi_jam}:00`}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      Rp {r.total_bayar?.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {(r.status === 'disetujui' || r.status === 'belum_dikonfirm') && (
                        <Button variant="primary" size="xs" onClick={() => handleCheckIn(r.id)}>
                          Check-In
                        </Button>
                      )}
                      {r.status === 'aktif' && (
                        <Button variant="secondary" size="xs" onClick={() => handleCheckOut(r.id)}>
                          Check-Out
                        </Button>
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
