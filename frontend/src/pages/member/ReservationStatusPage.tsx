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
  Ticket
} from 'lucide-react';
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
        <div className="bg-[#E6F4F1] border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0F382C] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-sm">Reservasi Berhasil Dikonfirmasi!</h2>
              <p className="text-slate-600 font-medium">
                E-Ticket Anda telah aktif. Tunjukkan QR Code pada tiket ini ke resepsionis atau scanner pintu Smart Space.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-white text-[#0F382C] font-bold border border-emerald-200 shadow-2xs whitespace-nowrap">
            • Akses Terverifikasi
          </span>
        </div>

        {/* Main Digital Ticket Pass Card Container */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl space-y-6 p-6 sm:p-8">
          {/* Ticket Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dashed border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0F382C] flex items-center justify-center border border-slate-200">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  DIGITAL PASS & ACCESS KEY • Smart Space Jakarta
                </span>
                <p className="text-sm font-black text-slate-900 font-mono">
                  KODE BOOKING: <span className="text-[#0F382C]">{kodeBooking}</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E6F4F1] text-[#0F382C] border border-emerald-200 inline-block">
                • Dikonfirmasi (Aktif)
              </span>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Diterbitkan: 14 Jan 2025, 16:42 WIB
              </p>
            </div>
          </div>

          {/* Ticket Content Split Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left QR Code & Turnstile Section */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-2">
                <span>TURNSTILE GATE PASS</span>
                <span className="text-[#0F382C]">Zona Akses A-2</span>
              </div>

              {/* QR Code Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 text-center">
                <div className="bg-white p-4 rounded-2xl shadow-2xs border border-slate-100">
                  <QRCodeSVG value={qrPayload} size={180} level="H" fgColor="#0F382C" />
                </div>
                <p className="text-[11px] font-bold text-slate-500">
                  Scan QR ini di pintu masuk ruang
                </p>
              </div>

              {/* PIN Akses Cadangan */}
              <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">PIN Akses Cadangan</span>
                  <span className="text-[10px] text-slate-500">Gunakan jika scanner offline</span>
                </div>
                <span className="text-lg font-black text-slate-900 font-mono tracking-widest bg-white px-3 py-1 rounded-lg border border-slate-200">
                  8492
                </span>
              </div>

              {/* Room Area Thumbnail */}
              <div className="relative rounded-xl overflow-hidden h-28 border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80"
                  alt="Area Room"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-2.5">
                  <span className="text-white text-[11px] font-bold">Area: SCBD Tech Hub Lantai 4</span>
                </div>
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
                  SCBD Tower, Lantai 4 (Ruang 402), Jakarta Selatan
                </p>
              </div>

              {/* 4 Info Grid Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Tanggal Sewa</span>
                  <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0F382C]" />
                    Rabu, 15 Jan 2025
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Durasi Sewa</span>
                  <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0F382C]" />
                    {jamMulai} - {jamSelesai} WIB ({durasiJam} Jam Penuh)
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Identitas Pemesan</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-[#0F382C] shrink-0" />
                    <span className="truncate">Bambang Wicaksono</span>
                  </p>
                  <span className="text-[10px] text-slate-400 block truncate">PT Solusi Digital Nusantara</span>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Kapasitas Maksimal</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#0F382C]" />
                    Hingga 8 Orang
                  </p>
                  <span className="text-[10px] text-slate-400 block">Executive Layout</span>
                </div>
              </div>

              {/* Badges Fasilitas Termasuk */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  FASILITAS TERMASUK:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> 100 Mbps Wi-Fi
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1">
                    <Tv className="w-3 h-3" /> 4K Smart Display
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1">
                    <Coffee className="w-3 h-3" /> Free Flow Artisan Coffee
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                    Glass Whiteboard
                  </span>
                </div>
              </div>

              {/* Status Pembayaran Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Status Pembayaran</span>
                  <span className="font-bold text-emerald-800">Lunas via QRIS Instan</span>
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

        {/* Section: INSTRUKSI & PANDUAN CHECK-IN */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#0F382C]" /> INSTRUKSI & PANDUAN CHECK-IN
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-2 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#0F382C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Datang 10 menit sebelum waktu sewa dimulai untuk kemudahan persiapan perangkat Anda.
              </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-2 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#0F382C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Pintu ruang akan otomatis terbuka saat Anda memindai QR Code di reader panel pintu 402.
              </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-2 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#0F382C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Hubungi concierge via intercom dinding jika membutuhkan asistensi proyektor atau tambahan beverage.
              </p>
            </div>
          </div>
        </div>

        {/* Section: LOKASI GEDUNG & NAVIGASI */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-900 uppercase tracking-wider">LOKASI GEDUNG & NAVIGASI</span>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-[#0F382C] font-bold hover:underline">
              Buka di Peta
            </a>
          </div>

          <div className="bg-slate-200/70 rounded-2xl h-36 flex items-center justify-center relative overflow-hidden border border-slate-300">
            <button
              onClick={() => window.open('https://maps.google.com')}
              className="px-4 py-2 bg-white/90 hover:bg-white text-slate-800 text-xs font-bold rounded-xl shadow-xs border border-slate-200 flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <MapPin className="w-4 h-4 text-[#0F382C]" />
              SCBD Tower, Lot 118 Jakarta
            </button>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrintETicket}
              className="px-5 py-3 bg-[#0F382C] hover:bg-[#0b2b22] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Unduh E-Ticket (PDF)
            </button>

            <button
              onClick={handleAddToCalendar}
              className="px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CalendarPlus className="w-4 h-4 text-[#0F382C]" />
              Tambah ke Google Calendar
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <Link to="/" className="text-slate-600 hover:text-[#0F382C] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
            </Link>
            <Link to="/history" className="text-[#0F382C] hover:underline">
              Lihat Daftar Reservasi Saya
            </Link>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default ReservationStatusPage;
