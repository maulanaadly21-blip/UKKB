import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
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
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-between p-4 md:p-8 font-sans relative overflow-hidden text-white">
      {/* Dynamic Background Studio Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

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
            <div className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Member Registration</div>
          </div>
        </Link>
        <Link to="/login" className="text-xs font-display font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">
          Log In &rarr;
        </Link>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-md w-full mx-auto my-8 z-10">
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono tracking-wider text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            NEW MEMBER CREATIVE PASS
          </div>
          <h1 className="text-3xl font-display font-black tracking-tight text-white uppercase">
            Bergabung <span className="text-red-500">Besok</span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto font-medium">
            Akses ke 250+ ruang kerja, lab kreatif, audio studio, dan konektivitas Gigabit tanpa hambatan.
          </p>
        </div>

        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-6 md:p-8 rounded-3xl shadow-studio space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username Akun"
              required
              name="username"
              autoComplete="username"
              placeholder="e.g. johndoe"
              icon="fa-solid fa-user"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 focus:border-red-500"
            />

            <Input
              label="Nama Lengkap"
              required
              name="nama_member"
              autoComplete="name"
              placeholder="e.g. John Doe"
              icon="fa-solid fa-user"
              value={formData.nama_member}
              onChange={(e) => setFormData({ ...formData, nama_member: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 focus:border-red-500"
            />

            <Input
              label="Instansi / Kampus / Perusahaan"
              required
              name="instansi"
              placeholder="e.g. SMK Telkom Malang / Startup X"
              icon="fa-solid fa-building"
              value={formData.instansi}
              onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 focus:border-red-500"
            />

            <Input
              label="Alamat Domisili"
              required
              name="alamat"
              placeholder="e.g. Jl. Danau Ranau No. 1, Malang"
              icon="fa-solid fa-location-dot"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 focus:border-red-500"
            />

            <Input
              label="Nomor Telepon / WhatsApp"
              type="tel"
              required
              name="telp"
              autoComplete="tel"
              placeholder="081234567890"
              icon="fa-solid fa-phone"
              value={formData.telp}
              onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 focus:border-red-500"
            />

            <Input
              label="Kata Sandi (Password)"
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

            <Button type="submit" variant="primary" fullWidth loading={loading} icon="fa-solid fa-user-plus" className="py-3 text-sm font-display font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 shadow-red-glow rounded-2xl">
              Buat Akun Member &rarr;
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-zinc-500 font-medium">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="font-bold text-red-400 hover:text-red-300 underline underline-offset-4">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>

      {/* Minimal Footer Info */}
      <div className="max-w-md w-full mx-auto text-center z-10 text-[11px] text-zinc-500 font-mono">
        STUDIO ELEVEN &copy; 2026. CREATIVE WORKSPACE SYSTEM.
      </div>
    </div>
  );
};

export default RegisterMember;
