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
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Header Banner */}
        <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-10 shadow-studio relative overflow-hidden border border-zinc-800">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            
            {/* Avatar Container with Upload Overlay */}
            <div className="relative group">
              {avatarUrl && !imgError ? (
                <img
                  src={avatarUrl}
                  alt={user?.nama || 'User Avatar'}
                  onError={() => setImgError(true)}
                  className="w-24 h-24 rounded-2xl object-cover shadow-studio border-2 border-red-500/50"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-red-600 text-white font-display font-black text-4xl flex items-center justify-center shadow-red-glow border-2 border-red-400">
                  {user?.nama?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center cursor-pointer shadow-red-glow transition-transform hover:scale-110 border-2 border-zinc-950"
                title="Pilih foto dari perangkat"
              >
                <i className="fa-solid fa-camera text-xs"></i>
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
                <h1 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-white">{user?.nama}</h1>
                <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 bg-red-950 text-red-400 border border-red-800 rounded-full flex items-center gap-1.5">
                  <i className="fa-solid fa-crown text-red-500 text-xs"></i>
                  {memberTier.toUpperCase()} MEMBER PASS
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400 flex items-center justify-center sm:justify-start gap-2">
                <i className="fa-solid fa-envelope text-red-500 text-xs"></i> {user?.email}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
                <span className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl font-mono font-bold flex items-center gap-1.5 text-white">
                  <i className="fa-solid fa-sparkles text-red-500 text-xs"></i>
                  {user?.member?.poin || 0} REWARD POINTS
                </span>
                <span className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl font-mono text-zinc-400 flex items-center gap-1.5">
                  <i className="fa-solid fa-shield-halved text-red-500 text-xs"></i>
                  VERIFIED ACCOUNT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Card */}
        <Card className="p-6 sm:p-8 shadow-soft rounded-3xl border border-zinc-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Personal Info */}
            <div className="space-y-4">
              <div className="border-b border-zinc-200 pb-3">
                <h2 className="text-lg font-display font-extrabold text-zinc-900 uppercase flex items-center gap-2">
                  <i className="fa-solid fa-user text-red-600 text-base"></i> INFORMASI PROFIL MEMBER
                </h2>
                <p className="text-xs text-zinc-500">Perbarui identitas dan kontak aktif akun Anda.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* File Upload Field */}
                <div className="sm:col-span-2 flex flex-col gap-1.5 bg-zinc-950 p-5 rounded-2xl border border-zinc-800 text-white">
                  <label className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <i className="fa-solid fa-upload text-red-500 text-xs"></i> FOTO PROFIL (UNGGAH FILE BARU)
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer"
                    />
                    {selectedFile && (
                      <span className="text-xs font-mono text-red-400 whitespace-nowrap">
                        ✓ {selectedFile.name}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-zinc-500">FORMAT: JPG, PNG, WEBP, GIF (MAX 5MB)</p>
                </div>

                <Input
                  label="Nama Lengkap"
                  name="nama"
                  required
                  icon="fa-solid fa-user"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                />

                <Input
                  label="Alamat Email"
                  name="email"
                  disabled
                  icon="fa-solid fa-envelope"
                  value={formData.email}
                  helperText="Alamat email tidak dapat diubah (digunakan untuk login)"
                  className="bg-zinc-100 text-zinc-500 cursor-not-allowed"
                />

                <Input
                  label="Nomor WhatsApp / HP"
                  name="no_hp"
                  icon="fa-solid fa-phone"
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
                      { value: 'reguler', label: 'Reguler Member Pass' },
                      { value: 'vip', label: 'VIP Priority Pass (+ Diskon Poin)' },
                      { value: 'corporate', label: 'Corporate Team Pass' }
                    ]}
                  />
                )}
              </div>
            </div>

            {/* Section 2: Security & Password */}
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <div className="border-b border-zinc-200 pb-3">
                <h2 className="text-lg font-display font-extrabold text-zinc-900 uppercase flex items-center gap-2">
                  <i className="fa-solid fa-lock text-red-600 text-base"></i> KEAMANAN &amp; KATA SANDI
                </h2>
                <p className="text-xs text-zinc-500">Kosongkan jika Anda tidak ingin memperbarui password saat ini.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Kata Sandi Baru"
                  type="password"
                  name="password"
                  icon="fa-solid fa-lock"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  helperText="Minimal 6 karakter"
                />

                <Input
                  label="Konfirmasi Kata Sandi Baru"
                  type="password"
                  name="confirmPassword"
                  icon="fa-solid fa-lock"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="primary" loading={loading} icon="fa-solid fa-floppy-disk" className="px-8 py-3 text-sm font-display font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 shadow-red-glow rounded-2xl">
                SIMPAN PROFIL MEMBER &rarr;
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

