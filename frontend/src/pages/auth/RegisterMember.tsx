import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, Lock, Phone, Building, MapPin, UserPlus, Upload, Key } from 'lucide-react';
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
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { registerMember, appKey } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (fotoFile) {
        const data = new FormData();
        data.append('username', formData.username.trim());
        data.append('password', formData.password);
        data.append('nama_member', formData.nama_member);
        data.append('instansi', formData.instansi);
        data.append('alamat', formData.alamat);
        data.append('telp', formData.telp);
        data.append('foto', fotoFile);
        await registerMember(data);
      } else {
        await registerMember({
          username: formData.username.trim(),
          password: formData.password,
          nama_member: formData.nama_member,
          instansi: formData.instansi,
          alamat: formData.alamat,
          telp: formData.telp
        });
      }

      showSuccess(`Pendaftaran member berhasil! Selamat datang, ${formData.nama_member}`);
      navigate('/');
    } catch (err: any) {
      showError(err.message || 'Gagal mendaftar member. Pastikan data terisi lengkap.');
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
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daftar Akun Member Baru</h2>
          <p className="text-xs text-slate-500">
            Akses pemesanan workstation dan meeting room coworking space
          </p>
        </div>

        <Card className="p-8 shadow-soft-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username (Login)"
              required
              name="username"
              autoComplete="username"
              placeholder="e.g. budiraharjo"
              icon={User}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />

            <Input
              label="Nama Lengkap"
              required
              name="nama_member"
              autoComplete="name"
              placeholder="e.g. Budi Raharjo"
              icon={User}
              value={formData.nama_member}
              onChange={(e) => setFormData({ ...formData, nama_member: e.target.value })}
            />

            <Input
              label="Instansi / Perusahaan"
              required
              name="instansi"
              placeholder="e.g. SMK Telkom Malang / PT Maju"
              icon={Building}
              value={formData.instansi}
              onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
            />

            <Input
              label="Alamat Domisili"
              required
              name="alamat"
              placeholder="e.g. Jl. Danau Ranau No. 1, Malang"
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

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Foto Profil (Opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-[#0F382C] hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>

            <Button type="submit" variant="primary" fullWidth loading={loading} icon={UserPlus}>
              Daftar Sebagai Member
            </Button>
          </form>
        </Card>

        <div className="text-center text-xs text-slate-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-bold text-[#0F382C] hover:underline">
            Masuk Sesi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterMember;
