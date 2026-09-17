import React, { useState, useEffect, FormEvent } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { Store, Save, Phone, User, Building, ShieldCheck } from 'lucide-react';

const SpaceProfilePage: React.FC = () => {
  const [formData, setFormData] = useState({
    nama_coworking: '',
    nama_pemilik: '',
    telp: ''
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const { showSuccess, showError } = useNotification();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/profile');
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        setFormData({
          nama_coworking: res.data.data.nama_coworking || '',
          nama_pemilik: res.data.data.nama_pemilik || '',
          telp: res.data.data.telp || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch admin space profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/admin/profile', {
        nama_coworking: formData.nama_coworking,
        nama_pemilik: formData.nama_pemilik,
        telp: formData.telp
      });
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        showSuccess('Profil Coworking Space berhasil diperbarui');
      }
    } catch (err: any) {
      showError(err.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-6">
        <div className="pb-4 border-b border-slate-200">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F382C] block">
            PENGATURAN LOKASI
          </span>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-[#0F382C]" /> Profil Lokasi Coworking Space
          </h1>
          <p className="text-xs text-slate-500">
            Perbarui nama coworking space, penanggung jawab/pemilik, dan kontak operasional
          </p>
        </div>

        {loading ? (
          <div className="h-64 bg-slate-200/60 rounded-2xl animate-pulse"></div>
        ) : (
          <Card className="p-6 sm:p-8 shadow-2xs border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Lokasi Coworking / Branding"
                required
                icon={Store}
                placeholder="e.g. Moklet Hub Coworking Space"
                value={formData.nama_coworking}
                onChange={(e) => setFormData({ ...formData, nama_coworking: e.target.value })}
              />

              <Input
                label="Nama Pemilik / Penanggung Jawab"
                required
                icon={User}
                placeholder="e.g. Ahmad Bidin"
                value={formData.nama_pemilik}
                onChange={(e) => setFormData({ ...formData, nama_pemilik: e.target.value })}
              />

              <Input
                label="Nomor Telepon Kontak Resmi"
                type="tel"
                required
                icon={Phone}
                placeholder="e.g. 081298765432"
                value={formData.telp}
                onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
              />

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button type="submit" variant="primary" icon={Save} loading={saving}>
                  Simpan Perubahan Profil
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default SpaceProfilePage;
