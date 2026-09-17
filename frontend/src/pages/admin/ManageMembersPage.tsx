import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { getImageUrl } from '../../utils/image';
import { Users, Plus, Search, Edit2, Trash2, User, Building, MapPin, Phone, Lock, Upload } from 'lucide-react';
import { MemberData } from '../../types';

const ManageMembersPage: React.FC = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<MemberData | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama_member: '',
    instansi: '',
    alamat: '',
    telp: '',
    foto: ''
  });
  const [memberFotoFile, setMemberFotoFile] = useState<File | null>(null);

  const fetchMembers = async (query = search) => {
    setLoading(true);
    try {
      const params: any = {};
      if (query.trim()) params.search = query.trim();
      const res = await api.get('/admin/members', { params });
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        setMembers(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchMembers(search);
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setMemberFotoFile(null);
    setFormData({
      username: '',
      password: '',
      nama_member: '',
      instansi: '',
      alamat: '',
      telp: '',
      foto: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (m: MemberData | any) => {
    setEditingMember(m);
    setMemberFotoFile(null);
    setFormData({
      username: m.username || '',
      password: '',
      nama_member: m.nama_member || '',
      instansi: m.instansi || '',
      alamat: m.alamat || '',
      telp: m.telp || '',
      foto: m.foto || ''
    });
    setModalOpen(true);
  };

  const handleSaveMember = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingMember) {
        if (memberFotoFile) {
          const data = new FormData();
          data.append('nama_member', formData.nama_member);
          data.append('instansi', formData.instansi);
          data.append('alamat', formData.alamat);
          data.append('telp', formData.telp);
          if (formData.password) data.append('password', formData.password);
          data.append('foto', memberFotoFile);
          await api.put(`/admin/members/${editingMember.id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          const payload: any = {
            nama_member: formData.nama_member,
            instansi: formData.instansi,
            alamat: formData.alamat,
            telp: formData.telp
          };
          if (formData.password) payload.password = formData.password;
          await api.put(`/admin/members/${editingMember.id}`, payload);
        }
        showSuccess('Data member berhasil diperbarui');
      } else {
        if (memberFotoFile) {
          const data = new FormData();
          data.append('username', formData.username);
          data.append('password', formData.password);
          data.append('nama_member', formData.nama_member);
          data.append('instansi', formData.instansi);
          data.append('alamat', formData.alamat);
          data.append('telp', formData.telp);
          data.append('foto', memberFotoFile);
          await api.post('/admin/members', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          await api.post('/admin/members', formData);
        }
        showSuccess('Data member baru berhasil ditambahkan');
      }
      setModalOpen(false);
      fetchMembers();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Gagal menyimpan data member');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus akun member ini?')) return;
    try {
      await api.delete(`/admin/members/${id}`);
      showSuccess('Data member berhasil dihapus');
      fetchMembers();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Gagal menghapus member');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F382C] block">
              PELANGGAN & MEMBER
            </span>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-[#0F382C]" /> Kelola Data Pelanggan / Member
            </h1>
            <p className="text-xs text-slate-500">
              CRUD akun member, instansi, alamat, dan kontak pelanggan coworking
            </p>
          </div>

          <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
            Tambah Member Baru
          </Button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            placeholder="Cari berdasarkan nama pelanggan, instansi, atau nomor telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
          <Button type="submit" variant="outline">
            Cari
          </Button>
        </form>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-200/60 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama Member</th>
                  <th className="px-4 py-3">Instansi / Perusahaan</th>
                  <th className="px-4 py-3">Alamat Domisili</th>
                  <th className="px-4 py-3">Nomor Telepon</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      Belum ada data member terdaftar.
                    </td>
                  </tr>
                ) : (
                  members.map((m: any) => {
                    const avatar = getImageUrl(m.foto, 'members');
                    return (
                      <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#E6F4F1] text-[#0F382C] font-bold flex items-center justify-center overflow-hidden shrink-0 border border-emerald-200">
                              {avatar ? (
                                <img src={avatar} alt={m.nama_member} className="w-full h-full object-cover" />
                              ) : (
                                m.nama_member?.charAt(0)?.toUpperCase() || 'M'
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{m.nama_member}</span>
                              <span className="text-[10px] text-slate-400 font-mono">ID #{m.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-700">{m.instansi || '-'}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{m.alamat || '-'}</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">{m.telp || '-'}</td>
                        <td className="px-4 py-3 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEdit(m)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="Edit Member"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(m.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Hapus Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMember ? 'Edit Data Member' : 'Tambah Data Member Baru'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveMember} className="space-y-4">
          {!editingMember && (
            <Input
              label="Username Login Member"
              required
              placeholder="e.g. user_budi"
              icon={User}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          )}

          <Input
            label="Nama Lengkap Member"
            required
            placeholder="e.g. Budi Raharjo"
            icon={User}
            value={formData.nama_member}
            onChange={(e) => setFormData({ ...formData, nama_member: e.target.value })}
          />

          <Input
            label="Instansi / Organisasi"
            required
            placeholder="e.g. SMK Telkom Malang"
            icon={Building}
            value={formData.instansi}
            onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
          />

          <Input
            label="Alamat Lengkap"
            required
            placeholder="e.g. Jl. Danau Ranau No. 1, Malang"
            icon={MapPin}
            value={formData.alamat}
            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
          />

          <Input
            label="Nomor Telepon"
            type="tel"
            required
            placeholder="e.g. 085712345678"
            icon={Phone}
            value={formData.telp}
            onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
          />

          <Input
            label={editingMember ? 'Password Baru (Opsional)' : 'Password Member'}
            type="password"
            required={!editingMember}
            placeholder="Secret123!"
            icon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Foto Member (Opsional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                  setMemberFotoFile(e.target.files[0]);
                }
              }}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-[#0F382C] hover:file:bg-emerald-100 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setModalOpen(false)} type="button">
              Batal
            </Button>
            <Button variant="primary" type="submit" loading={saving}>
              Simpan Member
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default ManageMembersPage;
