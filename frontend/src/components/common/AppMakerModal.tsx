import React, { useState, useEffect, FormEvent } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api, { getAppKey } from '../../api/axios';
import { Key, User, Mail, Lock, ShieldCheck, Check, Sparkles, RefreshCw, BarChart2 } from 'lucide-react';

interface AppMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppMakerModal: React.FC<AppMakerModalProps> = ({ isOpen, onClose }) => {
  const { appKey, updateAppKey, registerAppMaker, loginAppMaker } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [activeTab, setActiveTab] = useState<'current' | 'register' | 'login'>('current');
  const [manualKey, setManualKey] = useState<string>(appKey || getAppKey());
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<any>(null);

  // Register Form
  const [regData, setRegData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  // Login Form
  const [loginData, setLoginData] = useState({
    usernameOrEmail: '',
    password: ''
  });

  const fetchStats = async () => {
    try {
      const res = await api.get('/maker/stats');
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        setStats(res.data.data);
      }
    } catch {
      setStats(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setManualKey(appKey || getAppKey());
      fetchStats();
    }
  }, [isOpen, appKey]);

  const handleSaveManualKey = (e: FormEvent) => {
    e.preventDefault();
    if (!manualKey.trim()) {
      showError('App Key tidak boleh kosong');
      return;
    }
    updateAppKey(manualKey.trim());
    showSuccess(`App Key aktif diubah ke: ${manualKey.trim()}`);
    onClose();
  };

  const handleResetToDefault = () => {
    const defaultKey = 'mk_default_ukk_2026';
    setManualKey(defaultKey);
    updateAppKey(defaultKey);
    showSuccess(`App Key telah dikembalikan ke default: ${defaultKey}`);
  };

  const handleRegisterMaker = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerAppMaker(regData);
      const generatedKey = res.data?.app_key || res.data?.key;
      showSuccess(`Registrasi App Maker berhasil! Key: ${generatedKey}`);
      if (generatedKey) {
        setManualKey(generatedKey);
      }
      setActiveTab('current');
      fetchStats();
    } catch (err: any) {
      showError(err.message || 'Gagal mendaftarkan akun Siswa App Maker');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginMaker = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAppMaker(loginData);
      const userKey = res.data?.app_key || res.data?.key;
      showSuccess(`Login App Maker berhasil! App Key aktif: ${userKey}`);
      if (userKey) {
        setManualKey(userKey);
      }
      setActiveTab('current');
      fetchStats();
    } catch (err: any) {
      showError(err.message || 'Login App Maker gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pengaturan Multi-Tenancy (App Maker UKK)" maxWidth="max-w-lg">
      <div className="space-y-5">
        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'current' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Key Aktif
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Daftar Maker
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Login Maker
          </button>
        </div>

        {activeTab === 'current' && (
          <div className="space-y-4">
            <div className="bg-[#E6F4F1] border border-emerald-200/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F382C]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Isolasi Data Siswa (Multi-Tenancy)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Header <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-[#0F382C]">x-maker-key</code> dikirim otomatis pada setiap request API agar data pengujian UKK terisolasi antar siswa.
              </p>
            </div>

            <form onSubmit={handleSaveManualKey} className="space-y-3">
              <Input
                label="App Key / Maker Key yang Digunakan"
                required
                icon={Key}
                value={manualKey}
                onChange={(e) => setManualKey(e.target.value)}
                placeholder="mk_xxxxxxxxxxxx"
              />

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Gunakan Default
                </button>
                <Button type="submit" variant="primary" size="sm">
                  Terapkan App Key
                </Button>
              </div>
            </form>

            {stats && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-[#0F382C]" /> Statistik Data Key Ini
                </span>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 block">Space</span>
                    <strong className="text-sm font-extrabold text-slate-900">{stats.spaces ?? stats.total_spaces ?? 0}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 block">Member</span>
                    <strong className="text-sm font-extrabold text-slate-900">{stats.members ?? stats.total_members ?? 0}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 block">Reservasi</span>
                    <strong className="text-sm font-extrabold text-slate-900">{stats.reservations ?? stats.total_reservations ?? 0}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleRegisterMaker} className="space-y-3.5">
            <Input
              label="Nama Lengkap Siswa"
              required
              icon={User}
              placeholder="e.g. Budi Santoso"
              value={regData.name}
              onChange={(e) => setRegData({ ...regData, name: e.target.value })}
            />
            <Input
              label="Username Unik"
              required
              icon={User}
              placeholder="e.g. budisantoso"
              value={regData.username}
              onChange={(e) => setRegData({ ...regData, username: e.target.value })}
            />
            <Input
              label="Alamat Email"
              type="email"
              required
              icon={Mail}
              placeholder="e.g. budi@smk.sch.id"
              value={regData.email}
              onChange={(e) => setRegData({ ...regData, email: e.target.value })}
            />
            <Input
              label="Kata Sandi"
              type="password"
              required
              icon={Lock}
              placeholder="Minimal 6 karakter"
              value={regData.password}
              onChange={(e) => setRegData({ ...regData, password: e.target.value })}
            />
            <Button type="submit" variant="primary" fullWidth loading={loading} icon={Sparkles}>
              Daftar & Dapatkan App Key Unik
            </Button>
          </form>
        )}

        {activeTab === 'login' && (
          <form onSubmit={handleLoginMaker} className="space-y-3.5">
            <Input
              label="Username atau Email App Maker"
              required
              icon={User}
              placeholder="budisantoso atau budi@smk.sch.id"
              value={loginData.usernameOrEmail}
              onChange={(e) => setLoginData({ ...loginData, usernameOrEmail: e.target.value })}
            />
            <Input
              label="Kata Sandi"
              type="password"
              required
              icon={Lock}
              placeholder="••••••••"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <Button type="submit" variant="primary" fullWidth loading={loading} icon={Check}>
              Login & Ambil Kembali App Key
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default AppMakerModal;
