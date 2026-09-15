import React, { useState, FormEvent } from 'react';
import { QrCode, Search, CheckCircle, ArrowRight } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import StatusBadge from './StatusBadge';
import { Reservation } from '../../types';

interface CheckInScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckIn: (id: number) => void;
  onCheckOut: (id: number) => void;
  reservations?: Reservation[];
}

const CheckInScanner: React.FC<CheckInScannerProps> = ({
  isOpen,
  onClose,
  onCheckIn,
  onCheckOut,
  reservations = []
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Reservation | null>(null);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    const found = reservations.find(
      (r) =>
        (r.kode_reservasi && r.kode_reservasi.toLowerCase() === searchCode.trim().toLowerCase()) ||
        (r.kode_booking && r.kode_booking.toLowerCase() === searchCode.trim().toLowerCase())
    );
    setSelectedBooking(found || null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Panel Quick Check-In & Scanner E-Ticket" maxWidth="max-w-lg">
      <div className="space-y-5">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Ketik / Scan Kode Pemesanan (e.g. RES-20260903-...)"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            icon={QrCode}
          />
          <Button type="submit" variant="primary" icon={Search}>
            Cari
          </Button>
        </form>

        {selectedBooking ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Kode Reservasi</span>
                <span className="text-base font-extrabold text-emerald-800 font-mono">
                  {selectedBooking.kode_reservasi || selectedBooking.kode_booking}
                </span>
              </div>
              <StatusBadge status={selectedBooking.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Pemesan:</span>
                <span className="font-bold text-slate-900">{selectedBooking.nama_pemesan}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Ruangan:</span>
                <span className="font-bold text-slate-900">{selectedBooking.nama_ruangan || selectedBooking.nama_space}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Tanggal:</span>
                <span className="font-bold text-slate-900">{selectedBooking.tanggal_reservasi}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Jam Pemesanan:</span>
                <span className="font-bold text-slate-900">
                  {selectedBooking.jam_mulai} - {selectedBooking.jam_selesai}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              {(selectedBooking.status === 'dikonfirmasi' || selectedBooking.status === 'belum_dikonfirm') && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={CheckCircle}
                  onClick={() => {
                    onCheckIn(selectedBooking.id);
                    setSelectedBooking(null);
                    onClose();
                  }}
                >
                  {"Proses Check-In (Status -> Aktif)"}
                </Button>
              )}
              {selectedBooking.status === 'aktif' && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ArrowRight}
                  onClick={() => {
                    onCheckOut(selectedBooking.id);
                    setSelectedBooking(null);
                    onClose();
                  }}
                >
                  {"Proses Check-Out (Status -> Selesai)"}
                </Button>
              )}
            </div>
          </div>
        ) : searchCode ? (
          <div className="text-center py-6 text-slate-500 text-xs font-medium">
            Pemesanan dengan kode "<span className="font-bold text-slate-800">{searchCode}</span>" tidak ditemukan.
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            Masukkan atau scan kode barcode pada E-Ticket digital pelanggan untuk memverifikasi kedatangan.
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CheckInScanner;
