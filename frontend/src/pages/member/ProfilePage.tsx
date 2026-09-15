import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { User, Mail, Phone, Lock, Sparkles, Save, ShieldCheck, Crown, Award, Camera, Upload } from 'lucide-react';
import { getImageUrl } from '../../utils/image';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    no_hp: user?.no_hp || '',
    tipe_membership: user?.member?.tipe_membership || 'reguler',
    password: '',
    confirmPassword: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('Ukuran file maksimal 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImgError(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      showError('Konfirmasi kata sandi baru tidak cocok');
      return;
    }

    setLoading(true);
    try {
      const dataPayload = new FormData();
      dataPayload.append('nama', formData.nama);
      dataPayload.append('no_hp', formData.no_hp);
      dataPayload.append('tipe_membership', formData.tipe_membership);
      if (formData.password) {
        dataPayload.append('password', formData.password);
      }
      if (selectedFile) {
        dataPayload.append('foto_profil', selectedFile);
      }

      await updateProfile(dataPayload);
      showSuccess('Profil & foto berhasil diperbarui!');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      setSelectedFile(null);
      setPreviewUrl(null);
      setImgError(false);
    } catch (err: any) {
      showError(err.message || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const memberTier = user?.member?.tipe_membership || 'reguler';
  const rawAvatar = previewUrl || (user?.foto_profil ? user.foto_profil : null);
  const avatarUrl = getImageUrl(rawAvatar);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            
            {/* Avatar Container with Upload Overlay */}
            <div className="relative group">
              {avatarUrl && !imgError ? (
                <img
                  src={avatarUrl}
                  alt={user?.nama || 'User Avatar'}
                  onError={() => setImgError(true)}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-emerald-400/30"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-emerald-600 text-white font-extrabold text-4xl flex items-center justify-center shadow-lg border-2 border-emerald-400/30">
                  {user?.nama?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110 border-2 border-slate-900"
                title="Pilih foto dari laptop"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{user?.nama}</h1>
                <Badge variant={memberTier === 'vip' ? 'amber' : 'emerald'} size="md">
                  {memberTier === 'vip' ? (
                    <span className="flex items-center gap-1"><Crown className="w-3.5 h-3.5" /> VIP MEMBER</span>
                  ) : (
                    <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {memberTier.toUpperCase()} MEMBER</span>
                  )}
                </Badge>
              </div>
              <p className="text-sm text-slate-300 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4 text-emerald-400" /> {user?.email}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs">
                <span className="bg-white/10 px-3 py-1.5 rounded-xl font-semibold backdrop-blur-md flex items-center gap-1.5 text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {user?.member?.poin || 0} Poin Reward
                </span>
                <span className="bg-white/10 px-3 py-1.5 rounded-xl font-medium backdrop-blur-md text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Akun Terverifikasi
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Card */}
        <Card className="p-6 sm:p-8 shadow-soft-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Personal Info */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" /> Informasi Pribadi Member
                </h2>
                <p className="text-xs text-slate-500">Perbarui identitas dan nomor kontak aktif Anda.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* File Upload Field */}
                <div className="sm:col-span-2 flex flex-col gap-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-emerald-600" /> Foto Profil (Unggah File dari Laptop)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                    {selectedFile && (
                      <span className="text-xs font-medium text-emerald-600 whitespace-nowrap">
                        ✓ {selectedFile.name}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">Format yang didukung: JPG, PNG, WEBP, GIF (Maks. 5MB)</p>
                </div>

                <Input
                  label="Nama Lengkap"
                  name="nama"
                  required
                  icon={User}
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                />

                <Input
                  label="Alamat Email"
                  name="email"
                  disabled
                  icon={Mail}
                  value={formData.email}
                  helperText="Alamat email tidak dapat diubah (digunakan untuk login)"
                  className="bg-slate-50 cursor-not-allowed"
                />

                <Input
                  label="Nomor WhatsApp / HP"
                  name="no_hp"
                  icon={Phone}
                  value={formData.no_hp}
                  onChange={handleChange}
                  placeholder="Contoh: 081234567890"
                />

                {user?.role === 'member' && (
                  <Select
                    label="Tipe Membership"
                    name="tipe_membership"
                    value={formData.tipe_membership}
                    onChange={handleChange}
                    options={[
                      { value: 'reguler', label: 'Reguler Member (Biasa)' },
                      { value: 'vip', label: 'VIP Member (Prioritas + Diskon Poin)' },
                      { value: 'corporate', label: 'Corporate Member (Bisnis)' }
                    ]}
                  />
                )}
              </div>
            </div>

            {/* Section 2: Security & Password */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-600" /> Keamanan Akun & Kata Sandi
                </h2>
                <p className="text-xs text-slate-500">Kosongkan kolom ini jika Anda tidak ingin mengganti kata sandi saat ini.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Kata Sandi Baru"
                  type="password"
                  name="password"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  helperText="Minimal 6 karakter"
                />

                <Input
                  label="Konfirmasi Kata Sandi Baru"
                  type="password"
                  name="confirmPassword"
                  icon={Lock}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="primary" loading={loading} icon={Save} className="px-8">
                Simpan Perubahan Profil
              </Button>
            </div>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
