import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Building2, Calendar, User, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import StatusBadge from '../admin/StatusBadge';
import { Reservation } from '../../types';

interface ETicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | any | null;
}

const ETicketModal: React.FC<ETicketModalProps> = ({ isOpen, onClose, reservation }) => {
  if (!reservation) return null;

  const handlePrint = () => {
    window.print();
  };

  const bookingCode = reservation.kode_booking || reservation.kode_reservasi || `RES-${reservation.id}`;
  const spaceName = reservation.space?.nama_space || reservation.space_name || reservation.nama_space || reservation.nama_ruangan || 'Workspace';
  const locationName = reservation.space?.nama_coworking || reservation.nama_coworking || 'Moklet Hub Coworking';
  const pemesanName = reservation.member?.nama_member || reservation.nama_pemesan || 'Member';
  const tanggal = reservation.tanggal_reservasi || '';
  const jamMulai = reservation.jam_mulai || '09:00';
  const jamSelesai = reservation.jam_selesai || `${parseInt(jamMulai)+ (reservation.durasi_jam || 1)}:00`;
  const durasi = reservation.durasi_jam || 1;
  const total = reservation.total_bayar || 0;

  const qrPayload = JSON.stringify({
    kode_booking: bookingCode,
    id_reservasi: reservation.id,
    pemesan: pemesanName,
    space: spaceName,
    tanggal: tanggal,
    jam: `${jamMulai} - ${jamSelesai}`
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Digital E-Ticket Coworking Space" maxWidth="max-w-xl">
      <div id="printable-eticket" className="space-y-6">
        {/* E-Ticket Header */}
        <div className="bg-[#0F382C] text-white rounded-2xl p-6 relative overflow-hidden shadow-soft">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight">Smart Space Digital Pass</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-800 text-emerald-100 border border-emerald-700 uppercase">
              • {reservation.status || 'Aktif'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-emerald-200 font-semibold block">
              Kode Reservasi Resmi (Booking Ref)
            </span>
            <p className="text-2xl font-black text-white font-mono tracking-wider">
              {bookingCode}
            </p>
          </div>
        </div>

        {/* QR Code & Location Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-2xl shrink-0">
            {reservation.qrCodeDataUrl ? (
              <img src={reservation.qrCodeDataUrl} alt="QR Code E-Ticket" className="w-40 h-40 object-contain" />
            ) : (
              <QRCodeSVG value={qrPayload} size={160} level="H" includeMargin={true} fgColor="#0F382C" />
            )}
            <span className="text-[10px] font-bold text-slate-500 tracking-wider mt-2 uppercase">
              Scan di Pintu / Resepsionis
            </span>
          </div>

          <div className="space-y-3.5 flex-1 w-full text-xs">
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-[#0F382C] mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nama Pemesan</span>
                <span className="font-bold text-slate-900 text-sm">{pemesanName}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-[#0F382C] mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Ruangan / Meja</span>
                <span className="font-bold text-slate-900">{spaceName}</span>
                <span className="text-slate-500 block">({locationName})</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#0F382C] mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Jadwal Akses</span>
                <span className="font-bold text-slate-900">{tanggal}</span>
                <span className="text-emerald-800 font-semibold block">
                  {jamMulai} - {jamSelesai} ({durasi} Jam)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Status Transaksi:</span>
            <span className="font-bold text-emerald-800 capitalize">{reservation.status || 'Terkonfirmasi'}</span>
          </div>
          {reservation.kode_promo && (
            <div className="flex justify-between text-emerald-800 font-semibold">
              <span>Voucher Diskon:</span>
              <span className="font-mono">{reservation.kode_promo}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-900 font-extrabold text-sm border-t border-slate-200 pt-2">
            <span>Total Biaya:</span>
            <span className="text-[#0F382C]">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Print Button */}
        <div className="flex justify-end gap-3 no-print">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button variant="primary" icon={Printer} onClick={handlePrint}>
            Cetak Digital E-Ticket
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ETicketModal;
