import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';
import RoomModal from '../../components/admin/RoomModal';
import Badge from '../../components/common/Badge';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { Plus, Edit2, Trash2, Layers, Users } from 'lucide-react';
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
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-emerald-700" /> Kelola Space Ruangan & Meja
            </h1>
            <p className="text-xs text-slate-500">Manajemen Personal Desk, Meeting Room, & Private Office (UKK Paket B)</p>
          </div>

          <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
            Tambah Space Baru
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 bg-slate-200/60 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spaces.map((space) => (
              <div
                key={space.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-soft flex items-start gap-4 justify-between"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  <img 
                    src={space.foto_url || (space.foto ? (space.foto.startsWith('http') ? space.foto : `http://localhost:5001/uploads/spaces/${space.foto}`) : '/placeholder-space.jpg')} 
                    alt={space.nama_space} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="emerald" size="xs">
                      {space.tipe?.toUpperCase() || 'DESK'}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 line-clamp-1">{space.nama_space || space.nama_ruangan}</h3>
                  <p className="text-xs font-bold text-emerald-800">
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
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSpace(space.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
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
