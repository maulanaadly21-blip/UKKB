import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';
import RoomModal from '../../components/admin/RoomModal';
import Badge from '../../components/common/Badge';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { getImageUrl } from '../../utils/image';
import { Plus, Edit2, Trash2, Layers, Users, Building, Tag } from 'lucide-react';
import { Space } from '../../types';

const ManageSpacesPage: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingRoom, setEditingRoom] = useState<Space | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const { showSuccess, showError } = useNotification();

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/spaces');
      if (res.data && (res.data.status || res.data.statusCode === 200)) {
        setSpaces(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch spaces:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (space: Space) => {
    setEditingRoom(space);
    setModalOpen(true);
  };

  const handleSaveRoom = async (payload: any, id?: number) => {
    setSaving(true);
    try {
      if (id) {
        await api.put(`/admin/spaces/${id}`, payload);
        showSuccess('Data space berhasil diperbarui');
      } else {
        await api.post('/admin/spaces', payload);
        showSuccess('Space ruangan baru berhasil ditambahkan');
      }
      setModalOpen(false);
      fetchSpaces();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Gagal menyimpan data space');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSpace = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus space ini?')) return;
    try {
      await api.delete(`/admin/spaces/${id}`);
      showSuccess('Space berhasil dihapus');
      fetchSpaces();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Gagal menghapus space');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F382C] block">
              KATALOG & INVENTARIS
            </span>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#0F382C]" /> Kelola Ruangan & Meja Kerja
            </h1>
            <p className="text-xs text-slate-500">
              CRUD Personal Desk, Meeting Room, & Private Office beserta foto dan fasilitas
            </p>
          </div>

          <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
            Tambah Space Baru
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 bg-slate-200/60 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : spaces.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl space-y-3">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">Belum ada space yang dibuat</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tambahkan meja kerja atau ruangan meeting pertama untuk mulai menerima reservasi pelanggan.
            </p>
            <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
              Tambah Space Sekarang
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spaces.map((space) => {
              const photoUrl = getImageUrl(space.foto_url || space.foto || space.foto_ruangan, 'spaces') ||
                'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={space.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all flex items-start gap-4 justify-between"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img 
                      src={photoUrl} 
                      alt={space.nama_space} 
                      className="w-full h-full object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="emerald" size="xs">
                        {space.tipe?.toUpperCase() || 'DESK'}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-mono">ID #{space.id}</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 truncate">
                      {space.nama_space || space.nama_ruangan}
                    </h3>
                    <p className="text-xs font-black text-[#0F382C]">
                      Rp {space.harga_per_jam?.toLocaleString('id-ID')} / jam
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Kapasitas: {space.kapasitas} Orang
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(space)}
                      className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      title="Edit Space"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSpace(space.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Hapus Space"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <RoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveRoom}
        room={editingRoom}
        loading={saving}
      />
    </AdminLayout>
  );
};

export default ManageSpacesPage;
