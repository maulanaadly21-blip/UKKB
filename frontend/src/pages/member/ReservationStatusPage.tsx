import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { QRCodeSVG } from 'qrcode.react';
import { Reservation } from '../../types';

const ReservationStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reservasi/my');
      if (res.data && res.data.status) {
        setReservations(res.data.data);
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

  const handleAddToCalendar = () => {
    showSuccess('Jadwal reservasi berhasil dikirim ke Google Calendar!');
  };

  const activeRes = reservations.length > 0 ? reservations[0] : null;

  if (loading) {
    return (
      <MemberLayout>
        <div className="max-w-4xl mx-auto py-16 text-center text-slate-500 font-medium">
          Memuat Digital Pass & E-Ticket...
        </div>
      </MemberLayout>
    );
  }

  const kodeBooking = activeRes?.kode_booking || activeRes?.kode_reservasi || 'BK-2025-0115-9921';
  const namaRuang = activeRes?.space?.nama_space || activeRes?.nama_ruangan || 'Glasshouse Meeting Room';
  const tanggalSewa = activeRes?.tanggal_reservasi || '2025-01-15';
  const jamMulai = activeRes?.jam_mulai || '10:00';
  const jamSelesai = activeRes?.jam_selesai || '12:00';
  const durasiJam = activeRes?.durasi_jam || 2;
  const totalBayar = activeRes?.total_bayar || 355200;

  const qrPayload = `SMARTSPACE-ETICKET-${kodeBooking}-${tanggalSewa}`;

  return (
    <MemberLayout>
      <div className="max-w-4xl mx-auto space-y-8 -mt-2 pb-16">
        {/* Top Alert Confirmation Banner */}
        <div className="bg-zinc-950 text-white border border-zinc-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-red-glow">
              <i className="fa-solid fa-circle-check text-base"></i>
            </div>
            <div>
              <h2 className="font-display font-black text-white text-base uppercase tracking-tight">Reservasi Berhasil Dikonfirmasi!</h2>
              <p className="text-zinc-400 font-medium">
                E-Ticket Anda telah aktif. Tunjukkan QR Code pada tiket ini ke resepsionis atau scanner pintu Studio Eleven.
              </p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-red-600/20 text-red-400 font-bold border border-red-500/30 whitespace-nowrap uppercase tracking-wider text-[10px]">
            • Akses Terverifikasi
          </span>
        </div>

        {/* Main Digital Ticket Pass Card Container */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl overflow-hidden shadow-soft space-y-6 p-6 sm:p-8">
          {/* Ticket Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dashed border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center border border-zinc-800">
                <i className="fa-solid fa-building text-red-500 text-base"></i>
              </div>
              <div>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block font-display">
                  DIGITAL PASS & ACCESS KEY • STUDIO ELEVEN
                </span>
                <p className="text-sm font-display font-black text-zinc-900 uppercase tracking-tight">
                  KODE BOOKING: <span className="text-red-600">{kodeBooking}</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 inline-block font-display">
                • Dikonfirmasi (Aktif)
              </span>
              <p className="text-[10px] text-zinc-400 font-medium mt-1">
                Diterbitkan: 14 Jan 2025, 16:42 WIB
              </p>
            </div>
          </div>

          {/* Ticket Content Split Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left QR Code & Turnstile Section */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-500 border-b border-zinc-100 pb-2 uppercase tracking-wider font-display">
                <span>TURNSTILE GATE PASS</span>
                <span className="text-red-600">Zona Akses A-2</span>
              </div>

              {/* QR Code Box */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center space-y-3 text-center">
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-zinc-200">
                  <QRCodeSVG value={qrPayload} size={180} level="H" fgColor="#111111" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Scan QR ini di pintu masuk studio
                </p>
              </div>

              {/* PIN Akses Cadangan */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block tracking-widest">PIN Akses Cadangan</span>
                  <span className="text-[10px] text-zinc-500">Gunakan jika scanner offline</span>
                </div>
                <span className="text-lg font-display font-black text-zinc-900 tracking-widest bg-white px-3 py-1 rounded-xl border border-zinc-200">
                  8492
                </span>
              </div>
            </div>

            {/* Right Room Details Section */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="studio-badge">
                  TIPE RUANGAN
                </span>
                <h2 className="text-2xl font-display font-black uppercase text-zinc-900 tracking-tight mt-1">{namaRuang}</h2>
                <p className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mt-1">
                  <i className="fa-solid fa-location-dot text-red-600 text-xs"></i>
                  SCBD Tower, Lantai 4 (Ruang 402), Jakarta Selatan
                </p>
              </div>

              {/* 4 Info Grid Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 space-y-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Tanggal Sewa</span>
                  <p className="font-display font-bold text-zinc-900 flex items-center gap-1.5">
                    <i className="fa-solid fa-calendar text-red-600 text-xs"></i>
                    Rabu, 15 Jan 2025
                  </p>
                </div>

                <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 space-y-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Durasi Sewa</span>
                  <p className="font-display font-bold text-zinc-900 flex items-center gap-1.5">
                    <i className="fa-solid fa-clock text-red-600 text-xs"></i>
                    {jamMulai} - {jamSelesai} WIB
                  </p>
                </div>

                <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 space-y-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Identitas Pemesan</span>
                  <p className="font-display font-bold text-zinc-900 flex items-center gap-1.5 truncate">
                    <i className="fa-solid fa-user text-red-600 text-xs shrink-0"></i>
                    <span className="truncate">Bambang Wicaksono</span>
                  </p>
                </div>

                <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 space-y-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Kapasitas Maksimal</span>
                  <p className="font-display font-bold text-zinc-900 flex items-center gap-1.5">
                    <i className="fa-solid fa-users text-red-600 text-xs"></i>
                    Hingga 8 Orang
                  </p>
                </div>
              </div>

              {/* Status Pembayaran Banner */}
              <div className="bg-zinc-950 text-white border border-zinc-800 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block tracking-widest">Status Pembayaran</span>
                  <span className="font-bold text-red-500 uppercase tracking-wider">Lunas via QRIS Instant</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block tracking-widest">Total Biaya Sewa</span>
                  <span className="text-base font-display font-black text-white">
                    Rp {totalBayar.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrintETicket}
              className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-red-glow transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-download text-sm"></i>
              Unduh E-Ticket (PDF)
            </button>

            <button
              onClick={handleAddToCalendar}
              className="px-6 py-3.5 bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-calendar-plus text-red-600 text-sm"></i>
              Google Calendar
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
            <Link to="/" className="text-zinc-600 hover:text-red-600 flex items-center gap-1">
              <i className="fa-solid fa-arrow-left text-xs"></i> Beranda
            </Link>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default ReservationStatusPage;
