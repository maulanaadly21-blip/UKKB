import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, Lock, Phone, Store, ArrowRight } from 'lucide-react';
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
      const payload = {
        ...formData,
        nama: formData.nama_pemilik || formData.username,
        email: formData.username,
        no_hp: formData.telp
      };
      await registerAdminSpace(payload);
      showSuccess(`Pendaftaran Admin Space berhasil! Selamat datang di Panel Pengelola.`);
      navigate('/admin/dashboard');
    } catch (err: any) {
      showError(err.message || 'Pendaftaran Admin Space gagal. Periksa kembali data.');
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
              alt="SmartSpace Logo" 
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform duration-200" 
            />
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daftarkan Coworking Space Anda</h2>
          <p className="text-xs text-slate-500">
            Daftar pengelola lokasi coworking space (UKK Paket B)
          </p>
        </div>

        <Card className="p-8 shadow-soft-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username Admin Space"
              required
              name="username"
              autoComplete="username"
              placeholder="e.g. admin_space1"
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
              placeholder="Minimal 6 karakter (e.g. Admin123!)"
              icon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <Input
              label="Nama Coworking Space / Branding"
              required
              name="nama_coworking"
              placeholder="e.g. Moklet Hub Coworking"
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
              label="Nomor Kontak / Telepon Pengelola"
              type="tel"
              required
              name="telp"
              autoComplete="tel"
              placeholder="e.g. 081298765432"
              icon={Phone}
              value={formData.telp}
              onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
            />

            <Button type="submit" variant="secondary" fullWidth loading={loading} icon={ArrowRight}>
              Daftar & Buka Panel Admin Space
            </Button>
          </form>
        </Card>

        <div className="text-center text-xs text-slate-500">
          Sudah terdaftar sebagai pengelola?{' '}
          <Link to="/login" className="font-bold text-slate-900 hover:underline">
            Masuk Sesi Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdminSpace;
