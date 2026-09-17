import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  CheckCircle2,
  Building2,
  Calendar,
  Clock,
  User,
  Users,
  Wifi,
  Tv,
  Coffee,
  MapPin,
  Download,
  CalendarPlus,
  ArrowLeft,
  Ticket,
  Ban,
  Tag
} from 'lucide-react';
import { Reservation } from '../../types';

const ReservationStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelling, setCancelling] = useState<boolean>(false);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reservasi/my');
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        setReservations(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handlePrintETicket = () => {
    window.print();
  };

  const handleCancelBooking = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan pemesanan ini?')) return;
    setCancelling(true);
    try {
      const res = await api.patch(`/reservasi/${id}/cancel`);
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        showSuccess('Pemesanan berhasil dibatalkan.');
        fetchReservations();
      } else {
        throw new Error(res.data?.message || 'Gagal membatalkan pemesanan');
      }
    } catch (err: any) {
      showError(err.response?.data?.message || err.message || 'Gagal membatalkan pemesanan');
    } finally {
      setCancelling(false);
    }
  };

  const activeRes = reservations.length > 0 ? reservations[selectedIndex] || reservations[0] : null;

  if (loading) {
    return (
      <MemberLayout>
        <div className="max-w-4xl mx-auto py-16 text-center text-slate-500 font-medium">
          Memuat Digital Pass & E-Ticket...
        </div>
      </MemberLayout>
    );
  }

  if (!activeRes) {
    return (
      <MemberLayout>
        <div className="max-w-2xl mx-auto py-16 text-center space-y-4 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Belum Ada Reservasi Aktif</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Anda belum memiliki riwayat reservasi. Silakan pilih meja atau ruangan kerja di katalog kami.
          </p>
          <button
            onClick={() => navigate('/ruang')}
            className="px-6 py-3 bg-[#0F382C] hover:bg-[#0b2b22] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Pesan Ruang Sekarang
          </button>
        </div>
      </MemberLayout>
    );
  }

  const kodeBooking = activeRes?.kode_booking || activeRes?.kode_reservasi || `RES-${activeRes.id}`;
  const namaRuang = activeRes?.space?.nama_space || activeRes?.nama_space || activeRes?.nama_ruangan || 'Workspace';
  const namaLokasi = activeRes?.space?.nama_coworking || activeRes?.nama_coworking || 'Moklet Hub Coworking';
  const tanggalSewa = activeRes?.tanggal_reservasi || '';
  const jamMulai = activeRes?.jam_mulai || '09:00';
  const jamSelesai = activeRes?.jam_selesai || '';
  const durasiJam = activeRes?.durasi_jam || 1;
  const totalBayar = activeRes?.total_bayar || 0;
  const statusRes = activeRes?.status || 'belum_dikonfirm';

  const qrPayload = JSON.stringify({
    kode_booking: kodeBooking,
    id_reservasi: activeRes.id,
    space: namaRuang,
    tanggal: tanggalSewa,
    jam: `${jamMulai} - ${jamSelesai}`
  });

  const canCancel = statusRes === 'belum_dikonfirm' || statusRes === 'disetujui';

  return (
    <MemberLayout>
      <div className="max-w-4xl mx-auto space-y-8 -mt-2 pb-16">
        {/* Ticket Selector Tabs if user has multiple bookings */}
        {reservations.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-print">
            <span className="text-xs font-bold text-slate-500 shrink-0">Daftar Tiket:</span>
            {reservations.map((r, idx) => (
              <button
                key={r.id}
                onClick={() => setSelectedIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedIndex === idx
                    ? 'bg-[#0F382C] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {r.kode_booking || r.kode_reservasi || `#${r.id}`} ({r.tanggal_reservasi})
              </button>
            ))}
          </div>
        )}

        {/* Top Status Banner */}
        <div className="bg-[#E6F4F1] border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0F382C] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-sm">
                {statusRes === 'aktif'
                  ? 'Anda Sedang Menggunakan Ruangan Ini (Aktif)'
                  : statusRes === 'selesai'
                  ? 'Reservasi Telah Selesai Digunakan'
                  : statusRes === 'dibatalkan'
                  ? 'Reservasi Ini Telah Dibatalkan'
                  : 'Reservasi Terkonfirmasi & Siap Digunakan'}
              </h2>
              <p className="text-slate-600 font-medium">
                Tunjukkan QR Code digital pass di bawah ini saat tiba di lokasi coworking space.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white text-[#0F382C] font-bold border border-emerald-200 shadow-2xs whitespace-nowrap uppercase">
              • {statusRes}
            </span>
            {canCancel && (
              <button
                onClick={() => handleCancelBooking(activeRes.id)}
                disabled={cancelling}
                className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                title="Batalkan Reservasi"
              >
                <Ban className="w-3.5 h-3.5" />
                Batalkan
              </button>
            )}
          </div>
        </div>

        {/* Main Digital Ticket Pass Card Container */}
        <div id="printable-eticket" className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl space-y-6 p-6 sm:p-8">
          {/* Ticket Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dashed border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0F382C] flex items-center justify-center border border-slate-200">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  DIGITAL PASS & ACCESS KEY • {namaLokasi}
                </span>
                <p className="text-sm font-black text-slate-900 font-mono">
                  KODE BOOKING: <span className="text-[#0F382C]">{kodeBooking}</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border inline-block uppercase ${
                statusRes === 'aktif' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                statusRes === 'selesai' ? 'bg-slate-100 text-slate-800 border-slate-300' :
                statusRes === 'dibatalkan' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                'bg-[#E6F4F1] text-[#0F382C] border-emerald-200'
              }`}>
                • {statusRes}
              </span>
            </div>
          </div>

          {/* Ticket Content Split Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left QR Code Section */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-2">
                <span>DIGITAL ACCESS PASS</span>
                <span className="text-[#0F382C]">QR Authenticated</span>
              </div>

              {/* QR Code Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 text-center">
                <div className="bg-white p-4 rounded-2xl shadow-2xs border border-slate-200/80">
                  <QRCodeSVG value={qrPayload} size={180} level="H" fgColor="#0F382C" />
                </div>
                <p className="text-[11px] font-bold text-slate-600">
                  Scan QR di reader pintu / resepsionis
                </p>
              </div>
            </div>

            {/* Right Room Details Section */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  TIPE RUANGAN
                </span>
                <h2 className="text-2xl font-black text-slate-900">{namaRuang}</h2>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {namaLokasi} • Akses Lantai 2
                </p>
              </div>

              {/* Info Grid Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Tanggal Sewa</span>
                  <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0F382C]" />
                    {tanggalSewa}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Jadwal Jam</span>
                  <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0F382C]" />
                    {jamMulai} - {jamSelesai || `${parseInt(jamMulai)+durasiJam}:00`} ({durasiJam} Jam)
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Identitas Pemesan</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-[#0F382C] shrink-0" />
                    <span className="truncate">{activeRes?.nama_pemesan || activeRes?.member?.nama_member || 'Member'}</span>
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Kapasitas</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#0F382C]" />
                    {activeRes?.space?.kapasitas || 1} Orang
                  </p>
                </div>
              </div>

              {/* Status & Total Bayar Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Status Pembayaran</span>
                  <span className="font-bold text-emerald-800">Terkonfirmasi</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Biaya Sewa</span>
                  <span className="text-base font-black text-slate-900">
                    Rp {totalBayar.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 no-print">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrintETicket}
              className="px-5 py-3 bg-[#0F382C] hover:bg-[#0b2b22] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Cetak / Simpan E-Ticket (PDF)
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <Link to="/" className="text-slate-600 hover:text-[#0F382C] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
            </Link>
            <Link to="/history" className="text-[#0F382C] hover:underline">
              Lihat Histori Pemesanan Bulanan
            </Link>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default ReservationStatusPage;
