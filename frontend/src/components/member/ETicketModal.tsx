import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Building2, Calendar, User } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Reservation } from '../../types';

interface ETicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

const ETicketModal: React.FC<ETicketModalProps> = ({ isOpen, onClose, reservation }) => {
  if (!reservation) return null;

  const handlePrint = () => {
    window.print();
  };

  const qrPayload = JSON.stringify({
    code: reservation.kode_reservasi || reservation.kode_booking,
    pemesan: reservation.nama_pemesan,
    space: reservation.nama_ruangan || reservation.nama_space,
    date: reservation.tanggal_reservasi,
    time: `${reservation.jam_mulai} - ${reservation.jam_selesai}`
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Digital E-Ticket Coworking Space" maxWidth="max-w-xl">
      <div id="printable-eticket" className="space-y-6">
        {/* E-Ticket Ticket Header */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-soft">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight">SmartSpace E-Pass</span>
            </div>
            <Badge variant="emerald" size="sm">
              STATUS: {reservation.status?.toUpperCase() || 'DIKONFIRMASI'}
            </Badge>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold block">
              Kode Pemesanan Resmi (Booking Ref)
            </span>
            <p className="text-2xl font-extrabold text-emerald-400 font-mono tracking-wider">
              {reservation.kode_reservasi || reservation.kode_booking}
            </p>
          </div>
        </div>

        {/* QR Code & Location Section */}
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-2xl shrink-0">
            {reservation.qrCodeDataUrl ? (
              <img src={reservation.qrCodeDataUrl} alt="QR Code E-Ticket" className="w-44 h-44 object-contain" />
            ) : (
              <QRCodeSVG value={qrPayload} size={170} level="H" includeMargin={true} fgColor="#0F766E" />
            )}
            <span className="text-[10px] font-bold text-slate-400 tracking-wider mt-2 uppercase">
              Scan di Meja Resepsionis
            </span>
          </div>

          <div className="space-y-3.5 flex-1 w-full text-sm">
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nama Pemesan</span>
                <span className="font-bold text-slate-900">{reservation.nama_pemesan || 'Member'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Ruangan / Workstation</span>
                <span className="font-bold text-slate-900">{reservation.nama_ruangan || reservation.nama_space}</span>
                <span className="text-xs text-slate-500 block">({reservation.nama_coworking || 'Horizon Workspace'})</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tanggal & Jam Akses</span>
                <span className="font-bold text-slate-900">{reservation.tanggal_reservasi}</span>
                <span className="text-xs text-emerald-700 font-semibold block">
                  {reservation.jam_mulai} - {reservation.jam_selesai} ({reservation.durasi_jam} Jam)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Total Harga Awal:</span>
            <span className="font-semibold">Rp {(reservation.total_harga_awal || 0).toLocaleString('id-ID')}</span>
          </div>
          {(reservation.potongan_diskon || 0) > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Potongan Promo ({reservation.kode_promo || 'Voucher'}):</span>
              <span>- Rp {(reservation.potongan_diskon || 0).toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-900 font-extrabold text-sm border-t border-slate-200 pt-2">
            <span>Total Dibayar:</span>
            <span className="text-emerald-700">Rp {(reservation.total_bayar || 0).toLocaleString('id-ID')}</span>
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
