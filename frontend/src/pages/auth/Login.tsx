import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ username, password });
      const userObj = res.user || res.data?.user || res.data;
      const userName = userObj?.nama || userObj?.nama_member || userObj?.nama_pemilik || userObj?.username || 'Pengguna';
      showSuccess(`Selamat datang kembali, ${userName}!`);
      
      if (userObj?.role === 'admin_space' || userObj?.spaceOwner) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      showError(err.message || 'Login gagal. Periksa username dan password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMember = () => {
    setUsername('member@gmail.com');
    setPassword('member123');
  };

  const handleDemoPostman = () => {
    setUsername('adlydah');
    setPassword('Aseknyo');
  };

  const handleDemoAdmin = () => {
    setUsername('admin@horizonhub.id');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-2">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-display font-extrabold text-xl tracking-wider border border-zinc-800 shadow-md group-hover:scale-105 transition-transform duration-200">
              S<span className="text-red-500">11</span>
            </div>
          </Link>
          <h2 className="text-2xl font-display font-black uppercase text-zinc-900 tracking-tight">Masuk Studio Eleven</h2>
          <p className="text-xs text-zinc-500 font-medium">
            Sistem Reservasi Coworking & Architectural Workstation
          </p>
        </div>

        {/* Card */}
        <Card className="p-8 shadow-soft border border-zinc-200/80 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username atau Email"
              type="text"
              required
              name="username"
              autoComplete="username"
              placeholder="adlydah / member@gmail.com"
              icon="fa-solid fa-user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              label="Kata Sandi (Password)"
              type="password"
              required
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              icon="fa-solid fa-lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-red-glow transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <i className="fa-solid fa-right-to-bracket text-sm"></i>
              <span>{loading ? 'Memproses Sesi...' : 'Masuk Sesi Studio'}</span>
            </button>
          </form>

          {/* Quick Demo Account Fillers */}
          <div className="mt-6 pt-6 border-t border-zinc-100 space-y-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block text-center tracking-widest font-display">
              PILIH AKUN LOGIN TERSEDIA
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleDemoPostman}
                className="px-2.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[11px] font-bold border border-red-200 transition-colors cursor-pointer truncate"
                title="adlydah / Aseknyo"
              >
                🔴 Postman Akun
              </button>
              <button
                type="button"
                onClick={handleDemoMember}
                className="px-2.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-[11px] font-bold border border-zinc-200 transition-colors cursor-pointer truncate"
              >
                👤 Member
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="px-2.5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-[11px] font-bold transition-colors cursor-pointer truncate"
              >
                🏢 Admin
              </button>
            </div>
          </div>
        </Card>

        {/* Register Links */}
        <div className="text-center text-xs text-zinc-500 space-y-1 font-medium">
          <p>
            Belum punya akun?{' '}
            <Link to="/register/member" className="font-bold text-red-600 hover:underline">
              Daftar Member Baru
            </Link>
          </p>
          <p>
            Pemilik Coworking Space?{' '}
            <Link to="/register/admin-space" className="font-bold text-zinc-900 hover:underline">
              Daftarkan Lokasi Space Anda
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
