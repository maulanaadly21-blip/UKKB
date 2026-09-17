import React, { useState, useEffect, FormEvent } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
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

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/members', { params: { search } });
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
    fetchMembers();
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
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
        const payload: any = { ...formData };
        if (!payload.password) delete payload.password;
        await api.put(`/admin/members/${editingMember.id}`, payload);
        showSuccess('Data member berhasil diperbarui');
      } else {
        await api.post('/admin/members', formData);
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
    if (!window.confirm('Apakah Anda yakin ingin menghapus member ini?')) return;
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
      <div className="space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <span className="studio-badge">MEMBER MANAGEMENT</span>
            <h1 className="text-3xl font-display font-black uppercase text-zinc-900 tracking-tight mt-1 flex items-center gap-2">
              <i className="fa-solid fa-users text-red-600 text-2xl"></i> DATA MEMBER &amp; PELANGGAN
            </h1>
            <p className="text-xs text-zinc-500 font-medium">Manajemen profil akun member Studio Eleven</p>
          </div>

          <Button variant="primary" icon="fa-solid fa-plus" onClick={handleOpenAdd} className="bg-red-600 hover:bg-red-500 text-white font-display font-bold uppercase tracking-wider shadow-red-glow rounded-2xl py-3 px-5">
            TAMBAH MEMBER BARU &rarr;
          </Button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            placeholder="Cari berdasarkan nama, instansi, atau nomor telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="fa-solid fa-magnifying-glass"
            className="bg-white border-zinc-200 rounded-2xl"
          />
          <button type="submit" className="px-5 bg-zinc-950 hover:bg-black text-white rounded-2xl text-xs font-display font-bold uppercase tracking-wider cursor-pointer">
            CARI
          </button>
        </form>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-zinc-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-200 rounded-3xl bg-white shadow-soft">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-300 font-display font-bold uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-5 py-4">MEMBER</th>
                  <th className="px-5 py-4">INSTANSI / ORGANISASI</th>
                  <th className="px-5 py-4">ALAMAT DOMISILI</th>
                  <th className="px-5 py-4">NO. TELEPON</th>
                  <th className="px-5 py-4 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {members.map((m: any) => (
                  <tr key={m.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white font-display font-black text-sm flex items-center justify-center overflow-hidden shrink-0 border border-zinc-800">
                          {m.foto ? (
                            <img src={m.foto.startsWith('http') ? m.foto : `http://localhost:5001/uploads/members/${m.foto}`} alt={m.nama_member} className="w-full h-full object-cover" />
                          ) : (
                            m.nama_member?.charAt(0) || 'M'
                          )}
                        </div>
                        <div>
                          <span className="font-display font-bold text-zinc-900 block text-sm uppercase">{m.nama_member}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">ID #{m.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-zinc-700">{m.instansi}</td>
                    <td className="px-5 py-4 text-zinc-600 max-w-xs truncate">{m.alamat}</td>
                    <td className="px-5 py-4 font-mono font-bold text-zinc-800">{m.telp}</td>
                    <td className="px-5 py-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                      >
                        <i className="fa-solid fa-pen-to-square text-sm"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteMember(m.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMember ? 'EDIT DATA MEMBER' : 'TAMBAH DATA MEMBER BARU'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveMember} className="space-y-4">
          {!editingMember && (
            <Input
              label="Username Login Member"
              required
              placeholder="e.g. user_budi"
              icon="fa-solid fa-user"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          )}

          <Input
            label="Nama Lengkap Member"
            required
            placeholder="e.g. Budi Raharjo"
            icon="fa-solid fa-user"
            value={formData.nama_member}
            onChange={(e) => setFormData({ ...formData, nama_member: e.target.value })}
          />

          <Input
            label="Instansi / Organisasi"
            required
            placeholder="e.g. SMK Telkom Malang"
            icon="fa-solid fa-building"
            value={formData.instansi}
            onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
          />

          <Input
            label="Alamat Lengkap"
            required
            placeholder="e.g. Jl. Danau Ranau No. 1, Malang"
            icon="fa-solid fa-location-dot"
            value={formData.alamat}
            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
          />

          <Input
            label="Nomor Telepon"
            type="tel"
            required
            placeholder="e.g. 085712345678"
            icon="fa-solid fa-phone"
            value={formData.telp}
            onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
          />

          <Input
            label={editingMember ? "Password Baru (Opsional)" : "Password Member"}
            type="password"
            required={!editingMember}
            placeholder="Secret123!"
            icon="fa-solid fa-lock"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer">
              BATAL
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-display font-bold uppercase tracking-wider cursor-pointer shadow-red-glow">
              SIMPAN MEMBER &rarr;
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default ManageMembersPage;

