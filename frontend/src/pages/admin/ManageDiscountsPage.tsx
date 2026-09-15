import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';
import DiscountModal from '../../components/admin/DiscountModal';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react';
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
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Tag className="w-6 h-6 text-emerald-700" /> Kelola Kode Promo & Diskon
            </h1>
            <p className="text-xs text-slate-500">Atur kode promo, persentase potongan, dan periode berlaku (UKK Paket B)</p>
          </div>

          <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
            Buat Promo Baru
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-slate-200/60 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-soft">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama / Kode Diskon</th>
                  <th className="px-4 py-3">Persentase Diskon</th>
                  <th className="px-4 py-3">Tanggal Awal</th>
                  <th className="px-4 py-3">Tanggal Akhir</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {discounts.map((d: any) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-emerald-800 text-sm">
                      {d.nama_diskon || d.kode_promo}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {d.persentase_diskon || d.persen_diskon}% OFF
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {d.tanggal_awal ? new Date(d.tanggal_awal).toLocaleDateString('id-ID') : (d.tanggal_mulai || '-')}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {d.tanggal_akhir ? new Date(d.tanggal_akhir).toLocaleDateString('id-ID') : (d.tanggal_berakhir || '-')}
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(d)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDiscount(d.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
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
