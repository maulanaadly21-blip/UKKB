import React, { useState, useEffect, useRef, FormEvent, ChangeEvent, DragEvent } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import api from '../../api/axios';
import { Upload, Trash2, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import { Space } from '../../types';
import { getImageUrl } from '../../utils/image';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any, id?: number) => void;
  room?: Space | any | null;
  loading?: boolean;
}

const RoomModal: React.FC<RoomModalProps> = ({ isOpen, onClose, onSave, room = null, loading = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  const [formData, setFormData] = useState({
    nama_space: '',
    harga_per_jam: '25000',
    tipe: 'desk',
    kapasitas: '1',
    deskripsi: 'WiFi 100Mbps, stopkontak, coffee',
    foto: ''
  });

  useEffect(() => {
    if (room) {
      setFormData({
        nama_space: room.nama_space || room.nama_ruangan || '',
        harga_per_jam: String(room.harga_per_jam || 25000),
        tipe: room.tipe || 'desk',
        kapasitas: String(room.kapasitas || 1),
        deskripsi: room.deskripsi || (Array.isArray(room.fasilitas) ? room.fasilitas.join(', ') : ''),
        foto: room.foto || ''
      });
    } else {
      setFormData({
        nama_space: '',
        harga_per_jam: '25000',
        tipe: 'desk',
        kapasitas: '1',
        deskripsi: 'WiFi 100Mbps, stopkontak, coffee',
        foto: ''
      });
    }
    setUploadError('');
    setUploading(false);
    setShowManualInput(false);
  }, [room, isOpen]);

  const getPreviewUrl = () => {
    if (!formData.foto) return null;
    return getImageUrl(formData.foto, 'spaces');
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('File harus berupa berkas gambar (JPG, PNG, WEBP, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran gambar maksimal 5MB');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await api.post('/upload/spaces', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data && (res.data.status || res.data.statusCode === 201)) {
        const uploadedFilename = res.data.data.filename || res.data.data.url;
        setFormData((prev) => ({ ...prev, foto: uploadedFilename }));
      } else {
        setUploadError(res.data?.message || 'Gagal mengunggah foto ruangan');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(err.response?.data?.message || 'Gagal mengunggah foto ke server');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, foto: '' }));
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      nama_space: formData.nama_space,
      harga_per_jam: parseFloat(formData.harga_per_jam),
      tipe: formData.tipe,
      kapasitas: parseInt(formData.kapasitas, 10),
      deskripsi: formData.deskripsi,
      foto: formData.foto
    };
    onSave(payload, room?.id);
  };

  const previewUrl = getPreviewUrl();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={room ? 'Edit Space Ruangan / Meja' : 'Tambah Space Baru'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Space / Ruangan / Meja"
          required
          placeholder="e.g. Personal Desk Alpha 01"
          value={formData.nama_space}
          onChange={(e) => setFormData({ ...formData, nama_space: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Tipe Space"
            value={formData.tipe}
            onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
            options={[
              { value: 'desk', label: 'Personal Desk (meja)' },
              { value: 'meeting_room', label: 'Meeting Room (ruang rapat)' },
              { value: 'private_office', label: 'Private Office (kantor privat)' }
            ]}
          />

          <Input
            label="Kapasitas (Orang)"
            type="number"
            min="1"
            required
            value={formData.kapasitas}
            onChange={(e) => setFormData({ ...formData, kapasitas: e.target.value })}
          />
        </div>

        <Input
          label="Tarif Harga per Jam (IDR)"
          type="number"
          step="1000"
          required
          placeholder="25000"
          value={formData.harga_per_jam}
          onChange={(e) => setFormData({ ...formData, harga_per_jam: e.target.value })}
        />

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
            Deskripsi Fasilitas Spesifikasi Space
          </label>
          <textarea
            rows={3}
            required
            placeholder="e.g. WiFi 100Mbps, stopkontak, monitor 24 inch, free flow kopi/teh"
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:border-emerald-600 focus:outline-none"
            value={formData.deskripsi}
            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
          ></textarea>
        </div>

        {/* File Upload Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Foto Ruangan / Space (Unggah Berkas)
            </label>
            <button
              type="button"
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-[11px] text-emerald-800 hover:underline font-semibold cursor-pointer"
            >
              {showManualInput ? 'Sembunyikan Opsi Teks' : 'Opsi Manual (Ketik Nama File)'}
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {previewUrl ? (
            <div className="relative group border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 shadow-xs">
              <img
                src={previewUrl}
                alt="Preview Space"
                className="w-full h-44 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = '/placeholder-space.jpg';
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-3">
                <div className="flex items-center gap-2 text-white text-xs font-medium truncate max-w-[65%]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate font-mono">{formData.foto}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-white/90 hover:bg-white text-slate-800 text-xs font-bold px-2.5 py-1.5 rounded-lg backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${uploading ? 'animate-spin' : ''}`} />
                    Ganti
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={uploading}
                    className="bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold p-1.5 rounded-lg backdrop-blur-md transition-all cursor-pointer"
                    title="Hapus foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {uploading && (
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                  <span className="text-xs font-bold">Mengunggah gambar baru...</span>
                </div>
              )}
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2.5 ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/20'
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  <p className="text-xs font-bold text-slate-700">Mengunggah file foto ke server...</p>
                </>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Pilih file foto atau seret & lepas di sini
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Format didukung: JPG, PNG, WEBP, GIF (Maks 5MB)
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    Cari File Gambar
                  </button>
                </>
              )}
            </div>
          )}

          {uploadError && (
            <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2">
              ⚠️ {uploadError}
            </p>
          )}

          {showManualInput && (
            <div className="pt-2">
              <Input
                label="Nama File / URL Foto (Manual)"
                placeholder="e.g. desk_alpha_01.jpg"
                value={formData.foto}
                onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} type="button">
            Batal
          </Button>
          <Button variant="primary" type="submit" loading={loading || uploading}>
            Simpan Space
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RoomModal;
