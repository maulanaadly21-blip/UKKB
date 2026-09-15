import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, Lock, LogIn } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
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

  const handleDemoAdmin = () => {
    setUsername('admin@horizonhub.id');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <img 
              src="/logo-transparent.png" 
              alt="SmartSpace Logo" 
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform duration-200" 
            />
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Masuk ke Smart Space</h2>
          <p className="text-xs text-slate-500">
            Sistem Reservasi Coworking Space & Workstation (UKK Paket B)
          </p>
        </div>

        {/* Card */}
        <Card className="p-8 shadow-soft-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username atau Email"
              type="text"
              required
              name="username"
              autoComplete="username"
              placeholder="member@gmail.com atau admin@horizonhub.id"
              icon={User}
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
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" variant="primary" fullWidth loading={loading} icon={LogIn}>
              Masuk Sesi
            </Button>
          </form>

          {/* Quick Demo Account Fillers */}
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block text-center tracking-widest">
              Contoh Kredensial Login (PDF UKK)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoMember}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 transition-colors cursor-pointer"
              >
                👤 Demo Member
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
              >
                🏢 Demo Admin Space
              </button>
            </div>
          </div>
        </Card>

        {/* Register Links */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p>
            Belum punya akun?{' '}
            <Link to="/register/member" className="font-bold text-emerald-700 hover:underline">
              Daftar Member Baru
            </Link>
          </p>
          <p>
            Pemilik Coworking Space?{' '}
            <Link to="/register/admin-space" className="font-bold text-slate-800 hover:underline">
              Daftarkan Lokasi Space Anda
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
