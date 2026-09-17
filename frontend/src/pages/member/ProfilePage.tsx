import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { User, Mail, Phone, Lock, Sparkles, Save, ShieldCheck, Camera, Upload, Store, MapPin, Building } from 'lucide-react';
import { getImageUrl } from '../../utils/image';
import api from '../../api/axios';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, isAdminSpace, isMember } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    email: '',
    telp: '',
    instansi: '',
    alamat: '',
    nama_coworking: '',
    nama_pemilik: '',
    password: '',
    confirmPassword: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nama: user.nama || user.nama_member || user.nama_pemilik || '',
        username: user.username || '',
        email: user.email || '',
        telp: user.telp || user.no_hp || user.member?.telp || user.space_owner?.telp || '',
        instansi: user.member?.instansi || '',
        alamat: user.member?.alamat || '',
        nama_coworking: user.space_owner?.nama_coworking || user.spaceOwner?.nama_coworking || '',
        nama_pemilik: user.space_owner?.nama_pemilik || user.spaceOwner?.nama_pemilik || user.nama || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

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
      if (isAdminSpace) {
        const payload = {
          nama_coworking: formData.nama_coworking || formData.nama,
          nama_pemilik: formData.nama_pemilik || formData.nama,
          telp: formData.telp
        };
        const res = await api.put('/admin/profile', payload);
        if (res.data && (res.data.status || res.data.statusCode === 200)) {
          showSuccess('Profil Coworking Space berhasil diperbarui!');
        }
      } else {
        const dataPayload = new FormData();
        dataPayload.append('nama', formData.nama);
        dataPayload.append('telp', formData.telp);
        dataPayload.append('instansi', formData.instansi);
        dataPayload.append('alamat', formData.alamat);
        if (formData.password) {
          dataPayload.append('password', formData.password);
        }
        if (selectedFile) {
          dataPayload.append('foto', selectedFile);
          dataPayload.append('foto_profil', selectedFile);
        }

        await updateProfile(dataPayload);
        showSuccess('Profil berhasil diperbarui!');
      }

      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      showError(err.message || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const rawAvatar = previewUrl || user?.foto_profil || user?.foto;
  const avatarUrl = getImageUrl(rawAvatar, 'members');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Header Banner */}
        <div className="bg-[#0F382C] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Container with Upload Overlay */}
            <div className="relative group shrink-0">
              {avatarUrl && !imgError ? (
                <img
                  src={avatarUrl}
                  alt={user?.nama || 'Avatar'}
                  onError={() => setImgError(true)}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-emerald-400/30 bg-slate-800"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-emerald-800 text-white font-black text-3xl flex items-center justify-center shadow-lg border-2 border-emerald-400/30">
                  {(user?.nama || user?.username || 'U').charAt(0).toUpperCase()}
                </div>
              )}

              {isMember && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white text-[#0F382C] flex items-center justify-center cursor-pointer shadow-md transition-transform hover:scale-110 border border-slate-200"
                  title="Ganti foto profil"
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
              )}
            </div>

            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {user?.nama || user?.nama_member || user?.nama_pemilik || user?.username}
                </h1>
                <Badge variant="emerald" size="md">
                  <span className="uppercase font-mono text-[11px] font-bold">
                    {user?.role === 'admin_space' ? 'ADMIN PENGELOLA SPACE' : 'MEMBER RESMI'}
                  </span>
                </Badge>
              </div>

              <p className="text-sm text-emerald-100 flex items-center justify-center sm:justify-start gap-2 font-medium">
                <Mail className="w-4 h-4 text-emerald-300" /> {user?.username}
              </p>

              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
                <span className="bg-white/10 px-3 py-1.5 rounded-xl font-medium backdrop-blur-md text-emerald-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  Akun Terverifikasi
                </span>
                {user?.member?.instansi && (
                  <span className="bg-white/10 px-3 py-1.5 rounded-xl font-medium backdrop-blur-md text-emerald-100 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-emerald-300" />
                    {user.member.instansi}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Card */}
        <Card className="p-6 sm:p-8 shadow-soft-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Data Identitas */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#0F382C]" />
                  {isAdminSpace ? 'Informasi Coworking Space & Pengelola' : 'Informasi Pribadi Member'}
                </h2>
                <p className="text-xs text-slate-500">Perbarui identitas profil dan kontak resmi Anda.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isAdminSpace ? (
                  <>
                    <Input
                      label="Nama Coworking Space"
                      name="nama_coworking"
                      required
                      icon={Store}
                      value={formData.nama_coworking}
                      onChange={handleChange}
                      placeholder="e.g. Moklet Hub Coworking"
                    />

                    <Input
                      label="Nama Pemilik / Penanggung Jawab"
                      name="nama_pemilik"
                      required
                      icon={User}
                      value={formData.nama_pemilik}
                      onChange={handleChange}
                      placeholder="e.g. Ahmad Bidin"
                    />

                    <Input
                      label="Nomor Telepon Kontak"
                      name="telp"
                      required
                      icon={Phone}
                      value={formData.telp}
                      onChange={handleChange}
                      placeholder="081298765432"
                    />
                  </>
                ) : (
                  <>
                    <Input
                      label="Nama Lengkap Pelanggan"
                      name="nama"
                      required
                      icon={User}
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                    />

                    <Input
                      label="Username Login"
                      name="username"
                      disabled
                      icon={Mail}
                      value={formData.username}
                      helperText="Username digunakan sebagai identitas login utama"
                      className="bg-slate-50 cursor-not-allowed"
                    />

                    <Input
                      label="Nomor Telepon / WhatsApp"
                      name="telp"
                      icon={Phone}
                      value={formData.telp}
                      onChange={handleChange}
                      placeholder="Contoh: 081234567890"
                    />

                    <Input
                      label="Instansi / Perusahaan"
                      name="instansi"
                      icon={Building}
                      value={formData.instansi}
                      onChange={handleChange}
                      placeholder="e.g. SMK Telkom Malang"
                    />

                    <div className="sm:col-span-2">
                      <Input
                        label="Alamat Lengkap Domisili"
                        name="alamat"
                        icon={MapPin}
                        value={formData.alamat}
                        onChange={handleChange}
                        placeholder="e.g. Jl. Danau Ranau No. 1, Sawojajar, Malang"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Section 2: Kata Sandi (Member only) */}
            {isMember && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#0F382C]" /> Ganti Kata Sandi
                  </h2>
                  <p className="text-xs text-slate-500">Kosongkan kolom ini jika Anda tidak ingin mengganti kata sandi.</p>
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
            )}

            {/* Submit Button */}
            <div className="pt-4 flex justify-end border-t border-slate-100">
              <Button type="submit" variant="primary" loading={loading} icon={Save} className="px-8">
                Simpan Perubahan
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
