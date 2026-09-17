import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';
import RoomModal from '../../components/admin/RoomModal';
import Badge from '../../components/common/Badge';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
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
        setSpaces(res.data.data);
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
        showSuccess('Space berhasil diperbarui');
      } else {
        await api.post('/admin/spaces', payload);
        showSuccess('Space baru berhasil ditambahkan');
      }
      setModalOpen(false);
      fetchSpaces();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Gagal menyimpan space');
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
      <div className="space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <span className="studio-badge">SPACE MANAGEMENT</span>
            <h1 className="text-3xl font-display font-black uppercase text-zinc-900 tracking-tight mt-1 flex items-center gap-2">
              <i className="fa-solid fa-layer-group text-red-600 text-2xl"></i> KELOLA SPACES &amp; RUANGAN
            </h1>
            <p className="text-xs text-zinc-500 font-medium">Manajemen katalog Workstation, Podcast Pods, Boardrooms, &amp; Studio Suites</p>
          </div>

          <Button variant="primary" icon="fa-solid fa-plus" onClick={handleOpenAdd} className="bg-red-600 hover:bg-red-500 text-white font-display font-bold uppercase tracking-wider shadow-red-glow rounded-2xl py-3 px-5">
            TAMBAH SPACE BARU &rarr;
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-zinc-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spaces.map((space) => (
              <div
                key={space.id}
                className="bg-white border border-zinc-200/90 hover:border-zinc-300 rounded-3xl p-6 shadow-soft hover:shadow-studio transition-all duration-300 flex items-start gap-5 justify-between"
              >
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                  <img 
                    src={space.foto_url || (space.foto ? (space.foto.startsWith('http') ? space.foto : `http://localhost:5001/uploads/spaces/${space.foto}`) : '/placeholder-space.jpg')} 
                    alt={space.nama_space} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-zinc-950 text-white rounded-lg inline-block">
                    {space.tipe?.toUpperCase() || 'DESK'}
                  </span>

                  <h3 className="text-base font-display font-extrabold text-zinc-900 uppercase line-clamp-1">{space.nama_space || space.nama_ruangan}</h3>
                  <div className="text-sm font-display font-black text-red-600">
                    Rp {space.harga_per_jam?.toLocaleString('id-ID')} <span className="text-[10px] font-mono font-normal text-zinc-400 uppercase">/ JAM</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-users text-red-500 text-xs"></i> {space.kapasitas} KAPASITAS
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(space)}
                    className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <i className="fa-solid fa-pen-to-square text-sm"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteSpace(space.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <i className="fa-solid fa-trash-can text-sm"></i>
                  </button>
                </div>
              </div>
            ))}
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

