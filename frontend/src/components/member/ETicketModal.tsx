import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
    <Modal isOpen={isOpen} onClose={onClose} title="Digital E-Ticket Studio Eleven" maxWidth="max-w-xl">
      <div id="printable-eticket" className="space-y-6">
        {/* E-Ticket Ticket Header */}
        <div className="bg-zinc-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-studio border border-zinc-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-display font-extrabold shadow-red-glow">
                S11
              </div>
              <span className="font-display font-extrabold text-base tracking-wider uppercase">STUDIO ELEVEN E-PASS</span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 bg-red-950 text-red-400 border border-red-800 rounded-full">
              {reservation.status?.toUpperCase() || 'DIKONFIRMASI'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-semibold block">
              KODE PEMESANAN RESMI (BOOKING REF)
            </span>
            <p className="text-2xl font-extrabold text-red-500 font-mono tracking-wider">
              {reservation.kode_reservasi || reservation.kode_booking}
            </p>
          </div>
        </div>

        {/* QR Code & Location Section */}
        <div className="bg-white border-2 border-dashed border-zinc-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex flex-col items-center justify-center p-4 bg-zinc-950 border border-zinc-800 rounded-2xl shrink-0">
            {reservation.qrCodeDataUrl ? (
              <img src={reservation.qrCodeDataUrl} alt="QR Code E-Ticket" className="w-44 h-44 object-contain" />
            ) : (
              <QRCodeSVG value={qrPayload} size={170} level="H" includeMargin={true} fgColor="#DC2626" />
            )}
            <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider mt-2 uppercase">
              SCAN TURNSTILE GATE PASS
            </span>
          </div>

          <div className="space-y-3.5 flex-1 w-full text-sm font-medium">
            <div className="flex items-start gap-2.5">
              <i className="fa-solid fa-user text-red-600 text-sm mt-0.5 shrink-0"></i>
              <div>
                <span className="text-[10px] uppercase font-mono text-zinc-400 block">NAMA PEMESAN</span>
                <span className="font-display font-bold uppercase text-zinc-900">{reservation.nama_pemesan || 'Member'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <i className="fa-solid fa-building text-red-600 text-sm mt-0.5 shrink-0"></i>
              <div>
                <span className="text-[10px] uppercase font-mono text-zinc-400 block">RUANGAN / WORKSTATION</span>
                <span className="font-display font-bold uppercase text-zinc-900">{reservation.nama_ruangan || reservation.nama_space}</span>
                <span className="text-xs text-zinc-500 block font-mono">({reservation.nama_coworking || 'Studio Eleven Flagship'})</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <i className="fa-solid fa-calendar-days text-red-600 text-sm mt-0.5 shrink-0"></i>
              <div>
                <span className="text-[10px] uppercase font-mono text-zinc-400 block">TANGGAL &amp; JAM AKSES</span>
                <span className="font-display font-bold text-zinc-900">{reservation.tanggal_reservasi}</span>
                <span className="text-xs text-red-600 font-mono font-bold block">
                  {reservation.jam_mulai} - {reservation.jam_selesai} ({reservation.durasi_jam} Jam)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-2 text-xs">
          <div className="flex justify-between text-zinc-600 font-medium">
            <span>Total Harga Awal:</span>
            <span className="font-bold">Rp {(reservation.total_harga_awal || 0).toLocaleString('id-ID')}</span>
          </div>
          {(reservation.potongan_diskon || 0) > 0 && (
            <div className="flex justify-between text-red-600 font-bold">
              <span>Potongan Promo ({reservation.kode_promo || 'Voucher'}):</span>
              <span>- Rp {(reservation.potongan_diskon || 0).toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex justify-between text-zinc-900 font-display font-black text-sm border-t border-zinc-200 pt-2">
            <span>TOTAL DIBAYAR:</span>
            <span className="text-red-600">Rp {(reservation.total_bayar || 0).toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Print Button */}
        <div className="flex justify-end gap-3 no-print">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-red-glow transition-all cursor-pointer flex items-center gap-2"
          >
            <i className="fa-solid fa-print text-sm"></i>
            Cetak Digital E-Ticket
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ETicketModal;
