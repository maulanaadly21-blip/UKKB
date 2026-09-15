import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, Lock, Phone, Building, MapPin, UserPlus } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const RegisterMember: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama_member: '',
    instansi: '',
    alamat: '',
    telp: ''
  });
  const [loading, setLoading] = useState(false);
  const { registerMember } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        nama: formData.nama_member || formData.username,
        email: formData.username,
        no_hp: formData.telp
      };
      await registerMember(payload);
      showSuccess(`Pendaftaran member berhasil! Selamat bergabung, ${formData.nama_member}`);
      navigate('/');
    } catch (err: any) {
      showError(err.message || 'Gagal mendaftar member. Periksa kembali isian form.');
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
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daftar Member Baru</h2>
          <p className="text-xs text-slate-500">
            Dapatkan akses reservasi coworking space & workstation (UKK Paket B)
          </p>
        </div>

        <Card className="p-8 shadow-soft-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              required
              name="username"
              autoComplete="username"
              placeholder="e.g. johndoe"
              icon={User}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />

            <Input
              label="Nama Lengkap (Pelanggan)"
              required
              name="nama_member"
              autoComplete="name"
              placeholder="e.g. John Doe"
              icon={User}
              value={formData.nama_member}
              onChange={(e) => setFormData({ ...formData, nama_member: e.target.value })}
            />

            <Input
              label="Instansi / Kampus / Perusahaan"
              required
              name="instansi"
              placeholder="e.g. Universitas Indonesia / PT Maju"
              icon={Building}
              value={formData.instansi}
              onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
            />

            <Input
              label="Alamat Domisili"
              required
              name="alamat"
              placeholder="e.g. Jl. Sudirman No. 123, Jakarta"
              icon={MapPin}
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
            />

            <Input
              label="Nomor Telepon / WhatsApp"
              type="tel"
              required
              name="telp"
              autoComplete="tel"
              placeholder="081234567890"
              icon={Phone}
              value={formData.telp}
              onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
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

            <Button type="submit" variant="primary" fullWidth loading={loading} icon={UserPlus}>
              Daftar Sekarang
            </Button>
          </form>
        </Card>

        <div className="text-center text-xs text-slate-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            Masuk Sesi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterMember;
