import React, { useState, useEffect, FormEvent } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { Discount } from '../../types';

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any, id?: number) => void;
  discount?: Discount | any | null;
  loading?: boolean;
}

const DiscountModal: React.FC<DiscountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  discount = null,
  loading = false
}) => {
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    nama_diskon: '',
    persentase_diskon: '20',
    tanggal_awal: today,
    tanggal_akhir: nextMonth
  });

  useEffect(() => {
    if (discount) {
      setFormData({
        nama_diskon: discount.nama_diskon || discount.kode_promo || '',
        persentase_diskon: String(discount.persentase_diskon || discount.persen_diskon || 20),
        tanggal_awal: discount.tanggal_awal ? discount.tanggal_awal.split('T')[0] : (discount.tanggal_mulai || today),
        tanggal_akhir: discount.tanggal_akhir ? discount.tanggal_akhir.split('T')[0] : (discount.tanggal_berakhir || nextMonth)
      });
    } else {
      setFormData({
        nama_diskon: '',
        persentase_diskon: '20',
        tanggal_awal: today,
        tanggal_akhir: nextMonth
      });
    }
  }, [discount, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      nama_diskon: formData.nama_diskon.toUpperCase().trim(),
      persentase_diskon: parseFloat(formData.persentase_diskon),
      tanggal_awal: `${formData.tanggal_awal}T00:00:00Z`,
      tanggal_akhir: `${formData.tanggal_akhir}T23:59:59Z`
    };
    onSave(payload, discount?.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={discount ? 'Edit Kode Promo / Diskon' : 'Tambah Kode Promo Baru'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama / Kode Diskon Promo (Capital)"
          required
          placeholder="e.g. PROMOAGUSTUS, UKKPROMO50"
          value={formData.nama_diskon}
          onChange={(e) => setFormData({ ...formData, nama_diskon: e.target.value.toUpperCase() })}
        />

        <Input
          label="Persentase Diskon (%)"
          type="number"
          min="1"
          max="100"
          required
          placeholder="20"
          value={formData.persentase_diskon}
          onChange={(e) => setFormData({ ...formData, persentase_diskon: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Tanggal Awal Berlaku"
            type="date"
            required
            value={formData.tanggal_awal}
            onChange={(e) => setFormData({ ...formData, tanggal_awal: e.target.value })}
          />

          <Input
            label="Tanggal Akhir Berlaku"
            type="date"
            required
            value={formData.tanggal_akhir}
            onChange={(e) => setFormData({ ...formData, tanggal_akhir: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} type="button">
            Batal
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Simpan Kode Diskon
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DiscountModal;
