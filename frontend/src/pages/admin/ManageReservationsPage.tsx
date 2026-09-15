import React, { useState, useEffect, FormEvent } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import StatusBadge from '../../components/admin/StatusBadge';
import CheckInScanner from '../../components/admin/CheckInScanner';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { CalendarCheck, QrCode, Search, CheckCircle, ArrowRight } from 'lucide-react';
import { Reservation } from '../../types';

const ManageReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const { showSuccess, showError } = useNotification();

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const res = await api.get('/admin/reservasi', { params });
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        setReservations(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchReservations();
  };

  const handleCheckIn = async (id: number) => {
    try {
      const res = await api.post(`/admin/reservasi/${id}/check-in`);
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        showSuccess('Check-in member berhasil! Status reservasi aktif.');
        fetchReservations();
      }
    } catch (err: any) {
      try {
        await api.patch(`/admin/reservasi/${id}/status`, { status: 'aktif' });
        showSuccess('Check-in member berhasil (Status: aktif)');
        fetchReservations();
      } catch (err2: any) {
        showError(err.response?.data?.message || 'Gagal proses check-in');
      }
    }
  };

  const handleCheckOut = async (id: number) => {
    try {
      const res = await api.post(`/admin/reservasi/${id}/check-out`);
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        showSuccess('Check-out member berhasil! Reservasi selesai.');
        fetchReservations();
      }
    } catch (err: any) {
      try {
        await api.patch(`/admin/reservasi/${id}/status`, { status: 'selesai' });
        showSuccess('Check-out member berhasil (Status: selesai)');
        fetchReservations();
      } catch (err2: any) {
        showError(err.response?.data?.message || 'Gagal proses check-out');
      }
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    if (status === 'aktif') return handleCheckIn(id);
    if (status === 'selesai') return handleCheckOut(id);

    try {
      const res = await api.patch(`/admin/reservasi/${id}/status`, { status });
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        showSuccess(`Status reservasi diubah menjadi '${status}'`);
        fetchReservations();
      }
    } catch (err: any) {
      showError(err.response?.data?.message || 'Gagal memperbarui status reservasi');
    }
  };

  const filteredReservations = reservations.filter((r: any) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const bookingCode = (r.kode_booking || r.kode_reservasi || '').toLowerCase();
    const memberName = (r.member?.nama_member || r.nama_pemesan || '').toLowerCase();
    const spaceName = (r.space?.nama_space || r.nama_ruangan || '').toLowerCase();
    return bookingCode.includes(term) || memberName.includes(term) || spaceName.includes(term);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-6 h-6 text-emerald-700" /> Transaksi Reservasi & Check-In/Out
            </h1>
            <p className="text-xs text-slate-500">Verifikasi kedatangan pelanggan dan update status pemesanan (UKK Paket B)</p>
          </div>

          <Button variant="primary" icon={QrCode} onClick={() => setIsScannerOpen(true)}>
            Buka Quick QR Scanner
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <Input
              placeholder="Cari Berdasarkan Kode Booking, Nama Member, atau Space..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
            <Button type="submit" variant="outline">
              Cari
            </Button>
          </form>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Semua Status' },
              { value: 'belum_dikonfirm', label: 'Belum Dikonfirmasi' },
              { value: 'disetujui', label: 'Disetujui' },
              { value: 'aktif', label: 'Aktif (Checked In)' },
              { value: 'selesai', label: 'Selesai (Checked Out)' },
              { value: 'dibatalkan', label: 'Dibatalkan' }
            ]}
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-200/60 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-soft">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Kode Booking</th>
                  <th className="px-4 py-3">Pelanggan / Member</th>
                  <th className="px-4 py-3">Space Ruangan</th>
                  <th className="px-4 py-3">Tanggal & Jam</th>
                  <th className="px-4 py-3">Total Bayar</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredReservations.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-emerald-800">{r.kode_booking || r.kode_reservasi}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block">{r.member?.nama_member || r.nama_pemesan || `Member #${r.id_member}`}</span>
                      <span className="text-[10px] text-slate-400">{r.member?.telp || r.no_hp || '-'}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">{r.space?.nama_space || r.nama_ruangan || `Space #${r.id_space}`}</td>
                    <td className="px-4 py-3">
                      {r.tanggal_reservasi} <br />
                      <span className="text-slate-500">{r.jam_mulai} - {r.jam_selesai || `${parseInt(r.jam_mulai)+r.durasi_jam}:00`} ({r.durasi_jam} jam)</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      Rp {r.total_bayar?.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {r.status === 'belum_dikonfirm' && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleUpdateStatus(r.id, 'disetujui')}
                        >
                          Setujui
                        </Button>
                      )}
                      {(r.status === 'disetujui' || r.status === 'belum_dikonfirm') && (
                        <Button
                          variant="primary"
                          size="xs"
                          icon={CheckCircle}
                          onClick={() => handleCheckIn(r.id)}
                        >
                          Check-In
                        </Button>
                      )}
                      {r.status === 'aktif' && (
                        <Button
                          variant="secondary"
                          size="xs"
                          icon={ArrowRight}
                          onClick={() => handleCheckOut(r.id)}
                        >
                          Check-Out
                        </Button>
                      )}
                      {r.status !== 'selesai' && r.status !== 'dibatalkan' && (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleUpdateStatus(r.id, 'dibatalkan')}
                          className="text-rose-600 hover:bg-rose-50"
                        >
                          Batal
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CheckInScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onCheckIn={(id) => handleCheckIn(id)}
        onCheckOut={(id) => handleCheckOut(id)}
        reservations={reservations}
      />
    </AdminLayout>
  );
};

export default ManageReservationsPage;
