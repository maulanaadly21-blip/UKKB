import React, { useState, useEffect, FormEvent } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';

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
          nama_coworking: res.data.nama_coworking || res.data.data?.nama_coworking || '',
          nama_pemilik: res.data.nama_pemilik || res.data.data?.nama_pemilik || '',
          telp: res.data.telp || res.data.data?.telp || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
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
      <div className="max-w-3xl space-y-8 pb-12">
        <div className="pb-6 border-b border-zinc-200">
          <span className="studio-badge">OPERATOR PROFILE</span>
          <h1 className="text-3xl font-display font-black uppercase text-zinc-900 tracking-tight mt-1 flex items-center gap-2">
            <i className="fa-solid fa-store text-red-600 text-2xl"></i> PROFIL LOKASI COWORKING SPACE
          </h1>
          <p className="text-xs text-zinc-500 font-medium">Update data legalitas branding lokasi dan kontak penanggung jawab Studio Eleven</p>
        </div>

        {loading ? (
          <div className="h-64 bg-zinc-100 rounded-3xl animate-pulse"></div>
        ) : (
          <Card className="p-8 shadow-soft rounded-3xl border border-zinc-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Nama Branding / Coworking Space"
                required
                icon="fa-solid fa-store"
                placeholder="e.g. Studio Eleven SCBD Flagship"
                value={formData.nama_coworking}
                onChange={(e) => setFormData({ ...formData, nama_coworking: e.target.value })}
                className="bg-white border-zinc-200 focus:border-red-500"
              />

              <Input
                label="Nama Pemilik / Penanggung Jawab Venue"
                required
                icon="fa-solid fa-user"
                placeholder="e.g. Ahmad Bidin, S.Kom"
                value={formData.nama_pemilik}
                onChange={(e) => setFormData({ ...formData, nama_pemilik: e.target.value })}
                className="bg-white border-zinc-200 focus:border-red-500"
              />

              <Input
                label="Nomor Telepon Kontak Pengelola"
                required
                icon="fa-solid fa-phone"
                placeholder="e.g. 081298765432"
                value={formData.telp}
                onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
                className="bg-white border-zinc-200 focus:border-red-500"
              />

              <div className="pt-6 border-t border-zinc-200 flex justify-end">
                <Button type="submit" variant="primary" icon="fa-solid fa-floppy-disk" loading={saving} className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-display font-bold uppercase tracking-wider rounded-2xl shadow-red-glow">
                  SIMPAN PROFIL LOKASI &rarr;
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

