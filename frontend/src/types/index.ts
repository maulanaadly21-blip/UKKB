export interface MemberData {
  id: number;
  id_user?: number;
  nama_member: string;
  instansi?: string;
  alamat?: string;
  telp?: string;
  foto?: string;
  poin?: number;
  tipe_membership?: 'reguler' | 'vip';
}

export interface SpaceOwnerData {
  id: number;
  id_user?: number;
  nama_coworking: string;
  nama_pemilik: string;
  telp?: string;
}

export interface User {
  id: number;
  username: string;
  role: 'member' | 'admin_space' | 'app_maker';
  nama?: string;
  email?: string;
  foto_profil?: string;
  telp?: string;
  no_hp?: string;
  member?: MemberData | null;
  space_owner?: SpaceOwnerData | null;
  spaceOwner?: SpaceOwnerData | null;
}

export interface Space {
  id: number;
  nama_space: string;
  nama_ruangan?: string;
  harga_per_jam: number;
  tipe: 'desk' | 'meeting_room' | 'private_office' | string;
  kapasitas: number;
  deskripsi?: string;
  fasilitas?: string[] | string;
  foto?: string;
  foto_url?: string;
  foto_ruangan?: string;
  nama_coworking?: string;
  kota?: string;
  status?: string;
  liveStatus?: string;
  rating?: number;
  review_count?: number;
  lokasi?: string;
}

export interface Discount {
  id: number;
  nama_diskon: string;
  persentase_diskon: number;
  tanggal_awal: string;
  tanggal_akhir: string;
  is_active?: boolean;
}

export type PromoDiskon = Discount;

export interface Reservation {
  id: number;
  kode_booking?: string;
  kode_reservasi?: string;
  id_member?: number;
  id_space?: number;
  nama_pemesan?: string;
  nama_ruangan?: string;
  nama_space?: string;
  nama_coworking?: string;
  tanggal_reservasi: string;
  jam_mulai: string;
  jam_selesai: string;
  durasi_jam: number;
  harga_per_jam?: number;
  total_harga_awal?: number;
  potongan_diskon?: number;
  total_bayar: number;
  status: 'belum_dikonfirm' | 'aktif' | 'selesai' | 'dibatalkan' | string;
  kode_promo?: string;
  qrCodeDataUrl?: string;
  space?: Space;
  member?: MemberData;
  catatan?: string;
}

export interface ApiResponse<T = any> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

export interface Amenity {
  id: string;
  label: string;
  icon?: string;
}
