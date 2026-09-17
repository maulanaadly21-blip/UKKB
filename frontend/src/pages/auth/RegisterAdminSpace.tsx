import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, Lock, Phone, Store, ArrowRight, ShieldCheck } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const RegisterAdminSpace: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama_coworking: '',
    nama_pemilik: '',
    telp: ''
  });
  const [loading, setLoading] = useState(false);
  const { registerAdminSpace } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerAdminSpace({
        username: formData.username.trim(),
        password: formData.password,
        nama_coworking: formData.nama_coworking,
        nama_pemilik: formData.nama_pemilik,
        telp: formData.telp
      });
      showSuccess('Pendaftaran Pengelola Coworking Space berhasil! Selamat datang di Panel Admin.');
      navigate('/admin/dashboard');
    } catch (err: any) {
      showError(err.message || 'Pendaftaran Admin Space gagal. Periksa kembali kelengkapan data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <img 
              src="/logo-transparent.png" 
              alt="Logo" 
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform duration-200" 
            />
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daftar Admin Pengelola Space</h2>
          <p className="text-xs text-slate-500">
            Kelola lokasi coworking, meja kerja, meeting room, dan laporan transaksi
          </p>
        </div>

        <Card className="p-8 shadow-soft-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username Admin"
              required
              name="username"
              autoComplete="username"
              placeholder="e.g. admin_moklet"
              icon={User}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />

            <Input
              label="Kata Sandi (Password)"
              type="password"
              required
              name="password"
              autoComplete="new-password"
              placeholder="Minimal 6 karakter"
              icon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <Input
              label="Nama Coworking Space / Branding"
              required
              name="nama_coworking"
              placeholder="e.g. Moklet Hub Coworking Space"
              icon={Store}
              value={formData.nama_coworking}
              onChange={(e) => setFormData({ ...formData, nama_coworking: e.target.value })}
            />

            <Input
              label="Nama Pemilik / Penanggung Jawab"
              required
              name="nama_pemilik"
              placeholder="e.g. Ahmad Bidin"
              icon={User}
              value={formData.nama_pemilik}
              onChange={(e) => setFormData({ ...formData, nama_pemilik: e.target.value })}
            />

            <Input
              label="Nomor Telepon Kontak Resmi"
              type="tel"
              required
              name="telp"
              autoComplete="tel"
              placeholder="081298765432"
              icon={Phone}
              value={formData.telp}
              onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
            />

            <Button type="submit" variant="primary" fullWidth loading={loading} icon={ArrowRight}>
              Daftar & Buka Panel Admin
            </Button>
          </form>
        </Card>

        <div className="text-center text-xs text-slate-500">
          Sudah punya akun pengelola?{' '}
          <Link to="/login" className="font-bold text-[#0F382C] hover:underline">
            Masuk Sesi Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdminSpace;
