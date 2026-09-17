import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';
import DiscountModal from '../../components/admin/DiscountModal';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { Discount } from '../../types';

const ManageDiscountsPage: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const { showSuccess, showError } = useNotification();

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/diskon');
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        setDiscounts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch discounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleOpenAdd = () => {
    setEditingDiscount(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (d: Discount) => {
    setEditingDiscount(d);
    setModalOpen(true);
  };

  const handleSaveDiscount = async (payload: any, id?: number) => {
    setSaving(true);
    try {
      if (id) {
        await api.put(`/admin/diskon/${id}`, payload);
        showSuccess('Kode promo diskon berhasil diperbarui');
      } else {
        await api.post('/admin/diskon', payload);
        showSuccess('Kode promo diskon baru berhasil dibuat');
      }
      setModalOpen(false);
      fetchDiscounts();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Gagal menyimpan promo diskon');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDiscount = async (id: number) => {
    if (!window.confirm('Hapus kode promo diskon ini?')) return;
    try {
      await api.delete(`/admin/diskon/${id}`);
      showSuccess('Kode promo diskon berhasil dihapus');
      fetchDiscounts();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Gagal menghapus kode promo');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12">
        <div className="flex items-center justify-between pb-6 border-b border-zinc-200">
          <div>
            <span className="studio-badge">VOUCHER MANAGEMENT</span>
            <h1 className="text-3xl font-display font-black uppercase text-zinc-900 tracking-tight mt-1 flex items-center gap-2">
              <i className="fa-solid fa-tag text-red-600 text-2xl"></i> KELOLA PROMO &amp; DISKON
            </h1>
            <p className="text-xs text-zinc-500 font-medium">Atur voucher diskon, persentase potongan harga, dan periode aktif Studio Eleven</p>
          </div>

          <Button variant="primary" icon="fa-solid fa-plus" onClick={handleOpenAdd} className="bg-red-600 hover:bg-red-500 text-white font-display font-bold uppercase tracking-wider shadow-red-glow rounded-2xl py-3 px-5">
            BUAT PROMO BARU &rarr;
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-zinc-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-200 rounded-3xl bg-white shadow-soft">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-300 font-display font-bold uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-5 py-4">NAMA / KODE DISKON</th>
                  <th className="px-5 py-4">PERSENTASE DISKON</th>
                  <th className="px-5 py-4">TANGGAL AWAL</th>
                  <th className="px-5 py-4">TANGGAL AKHIR</th>
                  <th className="px-5 py-4 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {discounts.map((d: any) => (
                  <tr key={d.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-red-600 text-sm tracking-wider">
                      {d.nama_diskon || d.kode_promo}
                    </td>
                    <td className="px-5 py-4 font-display font-black text-zinc-900 text-base">
                      {d.persentase_diskon || d.persen_diskon}% OFF
                    </td>
                    <td className="px-5 py-4 font-mono text-zinc-600">
                      {d.tanggal_awal ? new Date(d.tanggal_awal).toLocaleDateString('id-ID') : (d.tanggal_mulai || '-')}
                    </td>
                    <td className="px-5 py-4 font-mono text-zinc-600">
                      {d.tanggal_akhir ? new Date(d.tanggal_akhir).toLocaleDateString('id-ID') : (d.tanggal_berakhir || '-')}
                    </td>
                    <td className="px-5 py-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(d)}
                        className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                      >
                        <i className="fa-solid fa-pen-to-square text-sm"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteDiscount(d.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DiscountModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveDiscount}
        discount={editingDiscount}
        loading={saving}
      />
    </AdminLayout>
  );
};

export default ManageDiscountsPage;

