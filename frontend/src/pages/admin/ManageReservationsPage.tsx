import React, { useState, useEffect, FormEvent } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import StatusBadge from '../../components/admin/StatusBadge';
import CheckInScanner from '../../components/admin/CheckInScanner';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
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
      <div className="space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <span className="studio-badge">TRANSACTION CONTROL</span>
            <h1 className="text-3xl font-display font-black uppercase text-zinc-900 tracking-tight mt-1 flex items-center gap-2">
              <i className="fa-solid fa-calendar-check text-red-600 text-2xl"></i> KELOLA RESERVASI &amp; PASS
            </h1>
            <p className="text-xs text-zinc-500 font-medium">Verifikasi kedatangan pelanggan dan update status turnstile pass Studio Eleven</p>
          </div>

          <Button variant="primary" icon="fa-solid fa-qrcode" onClick={() => setIsScannerOpen(true)} className="bg-red-600 hover:bg-red-500 text-white font-display font-bold uppercase tracking-wider shadow-red-glow rounded-2xl py-3 px-5">
            BUKA QR SCANNER PASS &rarr;
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <Input
              placeholder="Cari Berdasarkan Kode Booking, Nama Member, atau Space..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon="fa-solid fa-magnifying-glass"
              className="bg-white border-zinc-200 rounded-2xl"
            />
            <button type="submit" className="px-5 bg-zinc-950 hover:bg-black text-white rounded-2xl text-xs font-display font-bold uppercase tracking-wider cursor-pointer">
              CARI
            </button>
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
            className="rounded-2xl border-zinc-200 font-mono text-xs"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-zinc-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-200 rounded-3xl bg-white shadow-soft">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-300 font-display font-bold uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-5 py-4">KODE BOOKING</th>
                  <th className="px-5 py-4">PELANGGAN / MEMBER</th>
                  <th className="px-5 py-4">SPACE RUANGAN</th>
                  <th className="px-5 py-4">TANGGAL &amp; JAM</th>
                  <th className="px-5 py-4">TOTAL BAYAR</th>
                  <th className="px-5 py-4">STATUS</th>
                  <th className="px-5 py-4 text-right">AKSI OPERASIONAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {filteredReservations.map((r: any) => (
                  <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-red-600">{r.kode_booking || r.kode_reservasi}</td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-zinc-900 block">{r.member?.nama_member || r.nama_pemesan || `Member #${r.id_member}`}</span>
                      <span className="text-[10px] font-mono text-zinc-400">{r.member?.telp || r.no_hp || '-'}</span>
                    </td>
                    <td className="px-5 py-4 font-display font-bold uppercase text-zinc-800">{r.space?.nama_space || r.nama_ruangan || `Space #${r.id_space}`}</td>
                    <td className="px-5 py-4">
                      {r.tanggal_reservasi} <br />
                      <span className="text-zinc-500 font-mono text-[11px]">{r.jam_mulai} - {r.jam_selesai || `${parseInt(r.jam_mulai)+r.durasi_jam}:00`} ({r.durasi_jam} jam)</span>
                    </td>
                    <td className="px-5 py-4 font-display font-black text-zinc-900">
                      Rp {r.total_bayar?.toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-4 text-right space-x-1.5">
                      {r.status === 'belum_dikonfirm' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(r.id, 'disetujui')}
                          className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white rounded-xl font-display font-bold text-[11px] uppercase tracking-wider cursor-pointer"
                        >
                          SETUJUI
                        </button>
                      )}
                      {(r.status === 'disetujui' || r.status === 'belum_dikonfirm') && (
                        <button
                          type="button"
                          onClick={() => handleCheckIn(r.id)}
                          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-display font-bold text-[11px] uppercase tracking-wider cursor-pointer shadow-red-glow"
                        >
                          CHECK-IN
                        </button>
                      )}
                      {r.status === 'aktif' && (
                        <button
                          type="button"
                          onClick={() => handleCheckOut(r.id)}
                          className="px-3.5 py-1.5 bg-zinc-950 hover:bg-black text-white rounded-xl font-display font-bold text-[11px] uppercase tracking-wider cursor-pointer"
                        >
                          CHECK-OUT
                        </button>
                      )}
                      {r.status !== 'selesai' && r.status !== 'dibatalkan' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(r.id, 'dibatalkan')}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-mono text-[11px] font-bold cursor-pointer"
                        >
                          BATAL
                        </button>
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

