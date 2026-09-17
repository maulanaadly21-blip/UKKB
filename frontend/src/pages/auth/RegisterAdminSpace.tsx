import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
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
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-between p-4 md:p-8 font-sans relative overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center font-display font-black text-white text-xl shadow-red-glow group-hover:scale-105 transition-transform">
            S11
          </div>
          <div>
            <div className="font-display font-extrabold text-white tracking-wider text-base leading-none">
              STUDIO ELEVEN
            </div>
            <div className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Admin Space Portal</div>
          </div>
        </Link>
        <Link to="/login" className="text-xs font-display font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">
          Admin Login &rarr;
        </Link>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-md w-full mx-auto my-8 z-10">
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono tracking-wider text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            VENUE OPERATOR ONBOARDING
          </div>
          <h1 className="text-3xl font-display font-black tracking-tight text-white uppercase">
            Daftar <span className="text-red-500">Admin Space</span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto font-medium">
            Kelola jadwal reservasi room, monitor heatmap occupancy, dan atur promo diskon secara digital.
          </p>
        </div>

        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-6 md:p-8 rounded-3xl shadow-studio space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username Admin Space"
              required
              name="username"
              autoComplete="username"
              placeholder="e.g. admin_space1"
              icon="fa-solid fa-user"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 focus:border-red-500"
            />

            <Input
              label="Nama Coworking Space / Branding"
              required
              name="nama_coworking"
              placeholder="e.g. Moklet Hub Coworking"
              icon="fa-solid fa-building"
              value={formData.nama_coworking}
              onChange={(e) => setFormData({ ...formData, nama_coworking: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 focus:border-red-500"
            />

            <Input
              label="Nama Pemilik / Penanggung Jawab"
              required
              name="nama_pemilik"
              placeholder="e.g. Ahmad Bidin"
              icon="fa-solid fa-shield-halved"
              value={formData.nama_pemilik}
              onChange={(e) => setFormData({ ...formData, nama_pemilik: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 focus:border-red-500"
            />

            <Input
              label="Nomor Kontak WhatsApp / Telepon"
              type="tel"
              required
              name="telp"
              autoComplete="tel"
              placeholder="e.g. 081298765432"
              icon="fa-solid fa-phone"
              value={formData.telp}
              onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 focus:border-red-500"
            />

            <Input
              label="Kata Sandi (Password Admin)"
              type="password"
              required
              name="password"
              autoComplete="new-password"
              placeholder="Minimal 6 karakter"
              icon="fa-solid fa-lock"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 focus:border-red-500"
            />

            <Button type="submit" variant="primary" fullWidth loading={loading} icon="fa-solid fa-arrow-right" className="py-3 text-sm font-display font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 shadow-red-glow rounded-2xl">
              Daftar &amp; Buka Panel Admin Space &rarr;
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-zinc-500 font-medium">
            Sudah terdaftar sebagai pengelola?{' '}
            <Link to="/login" className="font-bold text-red-400 hover:text-red-300 underline underline-offset-4">
              Masuk Sesi Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto text-center z-10 text-[11px] text-zinc-500 font-mono">
        STUDIO ELEVEN &copy; 2026. ADMIN SPACE PROTOCOL.
      </div>
    </div>
  );
};

export default RegisterAdminSpace;
