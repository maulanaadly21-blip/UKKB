import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDb, dbRun, dbGet, dbAll } from './db.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface CustomRequest extends Request {
  appKey?: string;
  user?: any;
  file?: any;
  files?: any;
}

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'ukk_coworking_jwt_secret_key_2026_2027';
const DEFAULT_APP_KEY = process.env.DEFAULT_APP_KEY || 'mk_default_ukk_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload Directories Setup
const uploadsDir = path.join(__dirname, '..', 'uploads');
const spacesUploadDir = path.join(uploadsDir, 'spaces');
const membersUploadDir = path.join(uploadsDir, 'members');
const generalUploadDir = path.join(uploadsDir, 'general');

[uploadsDir, spacesUploadDir, membersUploadDir, generalUploadDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Serve Static Upload Files
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const createStorage = (destFolder: string) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, destFolder),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    }
  });

const uploadGeneral = multer({ storage: createStorage(generalUploadDir) });
const uploadSpaces = multer({ storage: createStorage(spacesUploadDir) });
const uploadMembers = multer({ storage: createStorage(membersUploadDir) });

// Response Helpers (PDF Standard Response JSON Format)
const sendSuccess = (res: Response, statusCode = 200, message = 'Berhasil memproses permintaan', data: any = null) => {
  return res.status(statusCode).json({
    status: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const sendError = (res: Response, statusCode = 400, message = 'Terjadi kesalahan', errorName = 'Bad Request') => {
  return res.status(statusCode).json({
    status: false,
    statusCode,
    message,
    error: errorName,
    timestamp: new Date().toISOString()
  });
};

// Multi-Tenancy Middleware
const extractAppKey = (req: CustomRequest, res: Response, next: NextFunction) => {
  req.appKey = (req.headers['x-maker-key'] as string) || (req.headers['x-app-key'] as string) || DEFAULT_APP_KEY;
  next();
};

app.use(extractAppKey);

// JWT Authentication Middleware
const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 401, 'Token autentikasi tidak ditemukan!', 'Unauthorized');
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return sendError(res, 401, 'Token autentikasi tidak valid atau sudah kadaluwarsa!', 'Unauthorized');
    }
    req.user = user;
    next();
  });
};

// Role Access Middleware
const requireRole = (role: string) => (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== role) {
    return sendError(res, 403, `Akses ditolak. Peran '${role}' diperlukan.`, 'Forbidden');
  }
  next();
};

// Helper to format Jam Selesai
const calculateEndTime = (startTime: string, durationHours: number | string) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endHours = (hours + Number(durationHours)) % 24;
  const formattedHours = String(endHours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}`;
};

// ==========================================
// 1. ROOT & HEALTH CHECK SERVICE
// ==========================================

// Endpoint 1: GET /
app.get('/', (req: CustomRequest, res: Response) => {
  return sendSuccess(res, 200, 'Berhasil memproses permintaan', {
    name: 'Coworking Space Backend API - UKK RPL Paket B',
    version: '1.0.0',
    status: 'online',
    swagger_docs: '/docs',
    description: 'Backend service untuk menunjang kelas frontend dalam ujian UKK dengan multi-tenancy App Maker.',
    documentation_links: {
      swagger: `http://localhost:${PORT}/docs`,
      swagger_json: `http://localhost:${PORT}/docs-json`
    }
  });
});

// Endpoint 2: GET /health
app.get('/health', (req: CustomRequest, res: Response) => {
  return sendSuccess(res, 200, 'Berhasil memproses permintaan', {
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 2. MULTI-TENANCY SISWA (APP MAKER)
// ==========================================

// Endpoint 3: POST /api/maker/register
app.post('/api/maker/register', async (req: CustomRequest, res: Response) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return sendError(res, 400, 'Semua field wajib diisi!', 'Bad Request');
    }

    const existing = await dbGet(`SELECT * FROM app_makers WHERE username = ? OR email = ?`, [username, email]);
    if (existing) {
      return sendError(res, 400, 'Username atau Email sudah terdaftar sebagai App Maker!', 'Bad Request');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const appKey = `mk_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;

    const result = await dbRun(
      `INSERT INTO app_makers (name, username, email, password, app_key) VALUES (?, ?, ?, ?, ?)`,
      [name, username, email, hashedPassword, appKey]
    );

    const token = jwt.sign({ id: result.lastID, username, role: 'app_maker', app_key: appKey }, JWT_SECRET, {
      expiresIn: '7d'
    });

    const newMaker = await dbGet(`SELECT id, name, username, email, app_key, created_at, updated_at FROM app_makers WHERE id = ?`, [result.lastID]);

    return sendSuccess(res, 201, 'Registrasi App Maker berhasil! Simpan app_key Anda dengan baik.', {
      ...newMaker,
      access_token: token
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 4: POST /api/maker/login
app.post('/api/maker/login', async (req: CustomRequest, res: Response) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return sendError(res, 400, 'Username/Email dan password wajib diisi!', 'Bad Request');
    }

    const maker = await dbGet(`SELECT * FROM app_makers WHERE username = ? OR email = ?`, [usernameOrEmail, usernameOrEmail]);
    if (!maker) {
      return sendError(res, 401, 'Kredensial login App Maker salah!', 'Unauthorized');
    }

    const isValid = await bcrypt.compare(password, maker.password);
    if (!isValid) {
      return sendError(res, 401, 'Kredensial login App Maker salah!', 'Unauthorized');
    }

    const token = jwt.sign({ id: maker.id, username: maker.username, role: 'app_maker', app_key: maker.app_key }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return sendSuccess(res, 200, 'Login App Maker berhasil!', {
      id: maker.id,
      name: maker.name,
      username: maker.username,
      email: maker.email,
      app_key: maker.app_key,
      access_token: token
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 5: GET /api/maker/me
app.get('/api/maker/me', authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const maker = await dbGet(`SELECT id, name, username, email, app_key, created_at FROM app_makers WHERE id = ?`, [req.user.id]);
    if (!maker) {
      return sendError(res, 404, 'Data App Maker tidak ditemukan!', 'NotFound');
    }
    return sendSuccess(res, 200, 'Berhasil memproses permintaan', maker);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 6: GET /api/maker/stats
app.get('/api/maker/stats', async (req: CustomRequest, res: Response) => {
  try {
    const appKey = req.appKey;
    const membersCount = await dbGet(`SELECT COUNT(*) as count FROM members WHERE app_key = ?`, [appKey]);
    const spacesCount = await dbGet(`SELECT COUNT(*) as count FROM spaces WHERE app_key = ?`, [appKey]);
    const diskonCount = await dbGet(`SELECT COUNT(*) as count FROM diskon WHERE app_key = ?`, [appKey]);
    const reservasiCount = await dbGet(`SELECT COUNT(*) as count FROM reservasi WHERE app_key = ?`, [appKey]);
    const totalIncome = await dbGet(`SELECT SUM(total_bayar) as sum FROM reservasi WHERE app_key = ? AND status != 'dibatalkan'`, [appKey]);

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', {
      total_members: membersCount ? membersCount.count : 0,
      total_spaces: spacesCount ? spacesCount.count : 0,
      total_diskon: diskonCount ? diskonCount.count : 0,
      total_reservasi: reservasiCount ? reservasiCount.count : 0,
      total_pendapatan: totalIncome && totalIncome.sum ? totalIncome.sum : 0
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 7: GET /api/maker/list
app.get('/api/maker/list', async (req: CustomRequest, res: Response) => {
  try {
    const makers = await dbAll(`SELECT id, name, username, email, app_key, created_at FROM app_makers ORDER BY id ASC`);
    return sendSuccess(res, 200, 'Berhasil memproses permintaan', makers);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// ==========================================
// 3. AUTENTIKASI PENGGUNA (MEMBER & ADMIN SPACE)
// ==========================================

// Endpoint 8: POST /api/auth/register/member
app.post('/api/auth/register/member', async (req: CustomRequest, res: Response) => {
  try {
    const { username, password, nama_member, instansi, alamat, telp, foto } = req.body;
    const appKey = req.appKey;

    if (!username || !password || !nama_member) {
      return sendError(res, 400, 'Username, password, dan nama_member wajib diisi!', 'Bad Request');
    }

    const existingUser = await dbGet(`SELECT * FROM users WHERE username = ? AND app_key = ?`, [username, appKey]);
    if (existingUser) {
      return sendError(res, 400, 'Username sudah digunakan oleh akun lain!', 'Bad Request');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRes = await dbRun(
      `INSERT INTO users (username, password, role, app_key) VALUES (?, ?, 'member', ?)`,
      [username, hashedPassword, appKey]
    );

    const memberRes = await dbRun(
      `INSERT INTO members (id_user, nama_member, instansi, alamat, telp, foto, app_key) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userRes.lastID, nama_member, instansi || '', alamat || '', telp || '', foto || 'member_john.jpg', appKey]
    );

    const token = jwt.sign(
      { id: userRes.lastID, username, role: 'member', member_id: memberRes.lastID, app_key: appKey },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return sendSuccess(res, 201, 'Registrasi member berhasil!', {
      id: userRes.lastID,
      username,
      role: 'member',
      member: {
        id: memberRes.lastID,
        nama_member,
        instansi: instansi || '',
        alamat: alamat || '',
        telp: telp || '',
        foto: foto || 'member_john.jpg'
      },
      access_token: token,
      token
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 9: POST /api/auth/register/admin-space
app.post('/api/auth/register/admin-space', async (req: CustomRequest, res: Response) => {
  try {
    const { username, password, nama_coworking, nama_pemilik, telp } = req.body;
    const appKey = req.appKey;

    if (!username || !password || !nama_coworking || !nama_pemilik) {
      return sendError(res, 400, 'Username, password, nama_coworking, dan nama_pemilik wajib diisi!', 'Bad Request');
    }

    const existingUser = await dbGet(`SELECT * FROM users WHERE username = ? AND app_key = ?`, [username, appKey]);
    if (existingUser) {
      return sendError(res, 400, 'Username sudah digunakan oleh akun lain!', 'Bad Request');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRes = await dbRun(
      `INSERT INTO users (username, password, role, app_key) VALUES (?, ?, 'admin_space', ?)`,
      [username, hashedPassword, appKey]
    );

    const ownerRes = await dbRun(
      `INSERT INTO space_owners (id_user, nama_coworking, nama_pemilik, telp, app_key) VALUES (?, ?, ?, ?, ?)`,
      [userRes.lastID, nama_coworking, nama_pemilik, telp || '', appKey]
    );

    const token = jwt.sign(
      { id: userRes.lastID, username, role: 'admin_space', owner_id: ownerRes.lastID, app_key: appKey },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return sendSuccess(res, 201, 'Registrasi Admin Space berhasil!', {
      id: userRes.lastID,
      username,
      role: 'admin_space',
      space_owner: {
        id: ownerRes.lastID,
        nama_coworking,
        nama_pemilik,
        telp: telp || ''
      },
      access_token: token,
      token
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 10: POST /api/auth/login
app.post('/api/auth/login', async (req: CustomRequest, res: Response) => {
  try {
    const usernameInput = req.body.username || req.body.usernameOrEmail;
    const { password } = req.body;
    const appKey = req.appKey;

    if (!usernameInput || !password) {
      return sendError(res, 400, 'Username dan password wajib diisi!', 'Bad Request');
    }

    let user = await dbGet(`SELECT * FROM users WHERE username = ? AND app_key = ?`, [usernameInput, appKey]);
    if (!user) {
      user = await dbGet(`SELECT * FROM users WHERE username = ?`, [usernameInput]);
    }

    if (!user) {
      const maker = await dbGet(`SELECT * FROM app_makers WHERE username = ? OR email = ?`, [usernameInput, usernameInput]);
      if (maker) {
        const isValidMaker = await bcrypt.compare(password, maker.password);
        if (!isValidMaker) {
          return sendError(res, 401, 'Username atau Password salah!', 'Unauthorized');
        }

        const token = jwt.sign(
          { id: maker.id, username: maker.username, role: 'app_maker', app_key: maker.app_key },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return sendSuccess(res, 200, 'Login App Maker berhasil!', {
          id: maker.id,
          username: maker.username,
          role: 'app_maker',
          app_key: maker.app_key,
          access_token: token,
          token
        });
      }
      return sendError(res, 401, 'Username atau Password salah!', 'Unauthorized');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return sendError(res, 401, 'Username atau Password salah!', 'Unauthorized');
    }

    let memberData = null;
    let spaceOwnerData = null;

    if (user.role === 'member') {
      memberData = await dbGet(`SELECT * FROM members WHERE id_user = ?`, [user.id]);
    } else if (user.role === 'admin_space') {
      spaceOwnerData = await dbGet(`SELECT * FROM space_owners WHERE id_user = ?`, [user.id]);
    }

    const effectiveAppKey = user.app_key || appKey;

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        member_id: memberData ? memberData.id : null,
        owner_id: spaceOwnerData ? spaceOwnerData.id : null,
        app_key: effectiveAppKey
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return sendSuccess(res, 200, 'Login berhasil!', {
      id: user.id,
      username: user.username,
      role: user.role,
      app_key: effectiveAppKey,
      maker_id: 5,
      member: memberData,
      space_owner: spaceOwnerData,
      access_token: token,
      token
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 11: GET /api/auth/profile
app.get('/api/auth/profile', authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    let user = await dbGet(`SELECT id, username, role, app_key FROM users WHERE id = ?`, [req.user.id]);
    if (!user) {
      const maker = await dbGet(`SELECT id, name, username, email, app_key, created_at FROM app_makers WHERE id = ?`, [req.user.id]);
      if (maker) {
        return sendSuccess(res, 200, 'Berhasil memproses permintaan', {
          id: maker.id,
          username: maker.username,
          role: 'app_maker',
          app_key: maker.app_key,
          maker
        });
      }
      return sendError(res, 404, 'User tidak ditemukan!', 'NotFound');
    }

    let memberData = null;
    let spaceOwnerData = null;

    if (user.role === 'member') {
      memberData = await dbGet(`SELECT * FROM members WHERE id_user = ?`, [user.id]);
    } else if (user.role === 'admin_space') {
      spaceOwnerData = await dbGet(`SELECT * FROM space_owners WHERE id_user = ?`, [user.id]);
    }

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', {
      id: user.id,
      username: user.username,
      role: user.role,
      app_key: user.app_key,
      member: memberData,
      space_owner: spaceOwnerData
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// ==========================================
// 4. SPACE COWORKING (KATALOG & KETERSEDIAAN)
// ==========================================

// Endpoint 12: GET /api/spaces/types
app.get('/api/spaces/types', (req: CustomRequest, res: Response) => {
  return sendSuccess(res, 200, 'Berhasil memproses permintaan', [
    {
      tipe: 'desk',
      label: 'Personal Desk',
      deskripsi: 'Meja kerja individual yang nyaman dengan fasilitas colokan listrik, WiFi kencang, dan air minum.'
    },
    {
      tipe: 'meeting_room',
      label: 'Meeting Room',
      deskripsi: 'Ruang rapat tertutup dengan fasilitas proyektor/TV LED, whiteboard, sound system, dan AC dingin.'
    },
    {
      tipe: 'private_office',
      label: 'Private Office',
      deskripsi: 'Ruang kantor privat eksklusif untuk tim kecil hingga menengah dengan akses fleksibel dan keamanan 24 jam.'
    }
  ]);
});

// Endpoint 13: GET /api/spaces/availability
app.get('/api/spaces/availability', async (req: CustomRequest, res: Response) => {
  try {
    const { id_space, tanggal, jam_mulai, durasi_jam } = req.query as any;
    const appKey = req.appKey;

    if (!id_space || !tanggal || !jam_mulai || !durasi_jam) {
      return sendError(res, 400, 'Parameter id_space, tanggal, jam_mulai, dan durasi_jam wajib diisi!', 'Bad Request');
    }

    const space = await dbGet(`SELECT * FROM spaces WHERE id = ? AND app_key = ?`, [id_space, appKey]);
    if (!space) {
      return sendError(res, 404, 'Space tidak ditemukan!', 'NotFound');
    }

    const jam_selesai = calculateEndTime(jam_mulai, durasi_jam);

    // Overlap Check
    const overlap = await dbGet(
      `SELECT * FROM reservasi 
       WHERE id_space = ? AND tanggal_reservasi = ? AND status != 'dibatalkan' AND app_key = ?
       AND (
         (jam_mulai < ? AND jam_selesai > ?)
       )`,
      [id_space, tanggal, appKey, jam_selesai, jam_mulai]
    );

    if (overlap) {
      return sendError(res, 400, 'Maaf, space sudah terisi atau dibooking pada jam tersebut!', 'Bad Request');
    }

    const estimasi_total = space.harga_per_jam * Number(durasi_jam);

    return sendSuccess(res, 200, 'Space tersedia untuk dipesan pada jadwal yang diminta', {
      available: true,
      id_space: Number(id_space),
      nama_space: space.nama_space,
      tanggal,
      jam_mulai,
      jam_selesai,
      durasi_jam: Number(durasi_jam),
      harga_per_jam: space.harga_per_jam,
      estimasi_total
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 14: GET /api/spaces
app.get('/api/spaces', async (req: CustomRequest, res: Response) => {
  try {
    const { tipe, search } = req.query as any;
    const appKey = req.appKey;

    let query = `SELECT s.*, so.nama_coworking, so.nama_pemilik, so.telp 
                 FROM spaces s 
                 LEFT JOIN space_owners so ON s.id_owner = so.id 
                 WHERE s.app_key = ?`;
    const params: any[] = [appKey];

    if (tipe) {
      query += ` AND s.tipe = ?`;
      params.push(tipe);
    }
    if (search) {
      query += ` AND (s.nama_space LIKE ? OR s.deskripsi LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY s.id ASC`;

    const spaces = await dbAll(query, params);

    const formattedSpaces = spaces.map((s) => ({
      id: s.id,
      nama_space: s.nama_space,
      harga_per_jam: s.harga_per_jam,
      tipe: s.tipe,
      kapasitas: s.kapasitas,
      foto: s.foto || 'desk_flexi_01.jpg',
      deskripsi: s.deskripsi,
      id_owner: s.id_owner,
      owner: {
        id: s.id_owner,
        nama_coworking: s.nama_coworking || 'Moklet Hub Coworking Space',
        nama_pemilik: s.nama_pemilik || 'Ahmad Bidin, S.Kom',
        telp: s.telp || '081298765432'
      },
      foto_url: `http://localhost:${PORT}/uploads/spaces/${s.foto || 'desk_flexi_01.jpg'}`
    }));

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', formattedSpaces);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 15: GET /api/spaces/:id
app.get('/api/spaces/:id', async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const appKey = req.appKey;

    const s = await dbGet(
      `SELECT s.*, so.nama_coworking, so.nama_pemilik, so.telp 
       FROM spaces s 
       LEFT JOIN space_owners so ON s.id_owner = so.id 
       WHERE s.id = ? AND s.app_key = ?`,
      [id, appKey]
    );

    if (!s) {
      return sendError(res, 404, 'Space dengan ID tersebut tidak ditemukan!', 'NotFound');
    }

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', {
      id: s.id,
      nama_space: s.nama_space,
      harga_per_jam: s.harga_per_jam,
      tipe: s.tipe,
      kapasitas: s.kapasitas,
      foto: s.foto || 'desk_flexi_01.jpg',
      deskripsi: s.deskripsi,
      id_owner: s.id_owner,
      owner: {
        id: s.id_owner,
        nama_coworking: s.nama_coworking || 'Moklet Hub Coworking Space',
        nama_pemilik: s.nama_pemilik || 'Ahmad Bidin, S.Kom',
        telp: s.telp || '081298765432'
      },
      foto_url: `http://localhost:${PORT}/uploads/spaces/${s.foto || 'desk_flexi_01.jpg'}`
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// ==========================================
// 5. DISKON & PROMO (KATALOG DISKON)
// ==========================================

// Endpoint 16: GET /api/diskon/active
app.get('/api/diskon/active', async (req: CustomRequest, res: Response) => {
  try {
    const appKey = req.appKey;
    const diskons = await dbAll(`SELECT * FROM diskon WHERE app_key = ? ORDER BY id ASC`, [appKey]);
    return sendSuccess(res, 200, 'Berhasil memproses permintaan', diskons);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 17: POST /api/diskon/check
app.post('/api/diskon/check', async (req: CustomRequest, res: Response) => {
  try {
    const { nama_diskon } = req.body;
    const appKey = req.appKey;

    if (!nama_diskon) {
      return sendError(res, 400, 'Nama diskon wajib diisi!', 'Bad Request');
    }

    const diskon = await dbGet(`SELECT * FROM diskon WHERE LOWER(nama_diskon) = LOWER(?) AND app_key = ?`, [nama_diskon, appKey]);

    if (!diskon) {
      return sendError(res, 400, 'Kode promo tidak ditemukan atau sudah kedaluwarsa!', 'Bad Request');
    }

    return sendSuccess(res, 200, 'Kode promo valid dan masih berlaku!', {
      id: diskon.id,
      nama_diskon: diskon.nama_diskon,
      persentase_diskon: diskon.persentase_diskon,
      tanggal_awal: diskon.tanggal_awal,
      tanggal_akhir: diskon.tanggal_akhir,
      is_active: true
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 18: GET /api/diskon/:id
app.get('/api/diskon/:id', async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const appKey = req.appKey;

    const diskon = await dbGet(`SELECT * FROM diskon WHERE id = ? AND app_key = ?`, [id, appKey]);
    if (!diskon) {
      return sendError(res, 404, 'Diskon tidak ditemukan!', 'NotFound');
    }

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', diskon);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// ==========================================
// 6. RESERVASI MEMBER (PEMESANAN & HISTORI)
// ==========================================

// Endpoint 19: POST /api/reservasi
app.post('/api/reservasi', authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const { id_space, tanggal_reservasi, jam_mulai, durasi_jam, id_diskon, kode_promo } = req.body;
    const appKey = req.appKey;

    if (!id_space || !tanggal_reservasi || !jam_mulai || !durasi_jam) {
      return sendError(res, 400, 'Field id_space, tanggal_reservasi, jam_mulai, dan durasi_jam wajib diisi!', 'Bad Request');
    }

    const space = await dbGet(`SELECT * FROM spaces WHERE id = ? AND app_key = ?`, [id_space, appKey]);
    if (!space) {
      return sendError(res, 404, 'Space tidak ditemukan!', 'NotFound');
    }

    const jam_selesai = calculateEndTime(jam_mulai, durasi_jam);

    // Overlap check
    const overlap = await dbGet(
      `SELECT * FROM reservasi 
       WHERE id_space = ? AND tanggal_reservasi = ? AND status != 'dibatalkan' AND app_key = ?
       AND (
         (jam_mulai < ? AND jam_selesai > ?)
       )`,
      [id_space, tanggal_reservasi, appKey, jam_selesai, jam_mulai]
    );

    if (overlap) {
      return sendError(res, 400, 'Space tidak tersedia pada tanggal dan rentang jam tersebut!', 'Bad Request');
    }

    let memberId = req.user.member_id;
    if (!memberId) {
      const memberObj = await dbGet(`SELECT id FROM members WHERE id_user = ?`, [req.user.id]);
      memberId = memberObj ? memberObj.id : 1;
    }

    let percentage = 0;
    let selectedDiskonId = id_diskon || null;
    let selectedKodePromo = kode_promo || null;

    if (selectedKodePromo) {
      const d = await dbGet(`SELECT * FROM diskon WHERE LOWER(nama_diskon) = LOWER(?) AND app_key = ?`, [selectedKodePromo, appKey]);
      if (d) {
        percentage = d.persentase_diskon;
        selectedDiskonId = d.id;
      }
    } else if (selectedDiskonId) {
      const d = await dbGet(`SELECT * FROM diskon WHERE id = ? AND app_key = ?`, [selectedDiskonId, appKey]);
      if (d) {
        percentage = d.persentase_diskon;
        selectedKodePromo = d.nama_diskon;
      }
    }

    const total_harga_awal = space.harga_per_jam * Number(durasi_jam);
    const potongan_diskon = (total_harga_awal * percentage) / 100;
    const total_bayar = total_harga_awal - potongan_diskon;

    const kode_booking = `BOOK-${tanggal_reservasi.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await dbRun(
      `INSERT INTO reservasi (
        kode_booking, id_member, id_space, id_diskon, kode_promo,
        tanggal_reservasi, jam_mulai, jam_selesai, durasi_jam, harga_per_jam,
        total_harga_awal, potongan_diskon, total_bayar, status, app_key
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'belum_dikonfirm', ?)`,
      [
        kode_booking,
        memberId,
        id_space,
        selectedDiskonId,
        selectedKodePromo,
        tanggal_reservasi,
        jam_mulai,
        jam_selesai,
        Number(durasi_jam),
        space.harga_per_jam,
        total_harga_awal,
        potongan_diskon,
        total_bayar,
        appKey
      ]
    );

    return sendSuccess(res, 201, 'Reservasi berhasil dibuat! Silakan tunggu konfirmasi admin.', {
      id: result.lastID,
      kode_booking,
      id_member: memberId,
      id_space: Number(id_space),
      id_diskon: selectedDiskonId,
      tanggal_reservasi,
      jam_mulai,
      jam_selesai,
      durasi_jam: Number(durasi_jam),
      harga_per_jam: space.harga_per_jam,
      total_harga_awal,
      potongan_diskon,
      total_bayar,
      status: 'belum_dikonfirm'
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 20: GET /api/reservasi/my
app.get('/api/reservasi/my', authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const appKey = req.appKey;
    let memberId = req.user.member_id;

    if (!memberId) {
      const memberObj = await dbGet(`SELECT id FROM members WHERE id_user = ?`, [req.user.id]);
      memberId = memberObj ? memberObj.id : null;
    }

    let query = `SELECT r.*, s.nama_space, s.tipe 
                 FROM reservasi r 
                 LEFT JOIN spaces s ON r.id_space = s.id 
                 WHERE r.app_key = ?`;
    const params: any[] = [appKey];

    if (memberId) {
      query += ` AND r.id_member = ?`;
      params.push(memberId);
    }

    query += ` ORDER BY r.id DESC`;

    const reservations = await dbAll(query, params);

    const formatted = reservations.map((r) => ({
      id: r.id,
      kode_booking: r.kode_booking,
      tanggal_reservasi: r.tanggal_reservasi,
      jam_mulai: r.jam_mulai,
      jam_selesai: r.jam_selesai,
      durasi_jam: r.durasi_jam,
      total_bayar: r.total_bayar,
      status: r.status,
      space: {
        id: r.id_space,
        nama_space: r.nama_space,
        tipe: r.tipe
      }
    }));

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', formatted);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 21: GET /api/reservasi/my/history
app.get('/api/reservasi/my/history', authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const { month, year } = req.query as any;
    const appKey = req.appKey;

    let memberId = req.user.member_id;
    if (!memberId) {
      const memberObj = await dbGet(`SELECT id FROM members WHERE id_user = ?`, [req.user.id]);
      memberId = memberObj ? memberObj.id : null;
    }

    let query = `SELECT r.*, s.nama_space 
                 FROM reservasi r 
                 LEFT JOIN spaces s ON r.id_space = s.id 
                 WHERE r.app_key = ?`;
    const params: any[] = [appKey];

    if (memberId) {
      query += ` AND r.id_member = ?`;
      params.push(memberId);
    }

    const reservations = await dbAll(query, params);

    const filtered = reservations.filter((r) => {
      const d = new Date(r.tanggal_reservasi);
      const mMatch = month ? d.getMonth() + 1 === Number(month) : true;
      const yMatch = year ? d.getFullYear() === Number(year) : true;
      return mMatch && yMatch;
    });

    const total_pengeluaran = filtered.reduce((acc, curr) => acc + (curr.status !== 'dibatalkan' ? curr.total_bayar : 0), 0);

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', {
      month: month ? Number(month) : new Date().getMonth() + 1,
      year: year ? Number(year) : new Date().getFullYear(),
      total_reservasi: filtered.length,
      total_pengeluaran,
      items: filtered.map((r) => ({
        id: r.id,
        kode_booking: r.kode_booking,
        tanggal_reservasi: r.tanggal_reservasi,
        jam_mulai: r.jam_mulai,
        jam_selesai: r.jam_selesai,
        durasi_jam: r.durasi_jam,
        total_bayar: r.total_bayar,
        status: r.status,
        space_name: r.nama_space
      }))
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 22: GET /api/reservasi/:id/e-ticket
app.get('/api/reservasi/:id/e-ticket', authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const appKey = req.appKey;

    const r = await dbGet(
      `SELECT r.*, s.nama_space, s.tipe, s.harga_per_jam as space_harga,
              m.nama_member, m.instansi, m.telp as member_telp,
              so.nama_coworking, so.telp as owner_telp
       FROM reservasi r
       LEFT JOIN spaces s ON r.id_space = s.id
       LEFT JOIN members m ON r.id_member = m.id
       LEFT JOIN space_owners so ON s.id_owner = so.id
       WHERE r.id = ? AND r.app_key = ?`,
      [id, appKey]
    );

    if (!r) {
      return sendError(res, 404, 'Reservasi tidak ditemukan!', 'NotFound');
    }

    return sendSuccess(res, 200, 'E-Ticket berhasil dimuat', {
      e_ticket_number: `TICKET-MOKLET-${r.kode_booking.replace('BOOK-', '')}`,
      kode_booking: r.kode_booking,
      coworking_space: {
        nama: r.nama_coworking || 'Moklet Hub Coworking Space',
        telepon: r.owner_telp || '081298765432'
      },
      member: {
        nama: r.nama_member || 'John Doe',
        instansi: r.instansi || 'Universitas Indonesia / PT Maju Mundur',
        telp: r.member_telp || '081234567890'
      },
      space: {
        nama: r.nama_space,
        tipe: r.tipe,
        harga_per_jam: r.harga_per_jam
      },
      jadwal: {
        tanggal: r.tanggal_reservasi,
        jam_mulai: r.jam_mulai,
        jam_selesai: r.jam_selesai,
        durasi: `${r.durasi_jam} Jam`
      },
      rincian_pembayaran: {
        tarif_kotor: r.total_harga_awal,
        diskon_promo: r.potongan_diskon > 0 ? `${r.kode_promo || 'Diskon'}` : '0',
        potongan: r.potongan_diskon,
        total_dibayar: r.total_bayar
      },
      status_reservasi: r.status,
      qr_code_payload: `VERIFY-RESERVASI-${r.id}-${appKey}`
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 23: GET /api/reservasi/:id
app.get('/api/reservasi/:id', authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const appKey = req.appKey;

    const r = await dbGet(
      `SELECT r.*, s.nama_space, s.harga_per_jam as space_harga, m.nama_member, m.telp
       FROM reservasi r
       LEFT JOIN spaces s ON r.id_space = s.id
       LEFT JOIN members m ON r.id_member = m.id
       WHERE r.id = ? AND r.app_key = ?`,
      [id, appKey]
    );

    if (!r) {
      return sendError(res, 404, 'Reservasi tidak ditemukan!', 'NotFound');
    }

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', {
      id: r.id,
      kode_booking: r.kode_booking,
      id_member: r.id_member,
      id_space: r.id_space,
      tanggal_reservasi: r.tanggal_reservasi,
      jam_mulai: r.jam_mulai,
      jam_selesai: r.jam_selesai,
      durasi_jam: r.durasi_jam,
      total_bayar: r.total_bayar,
      status: r.status,
      member: {
        nama_member: r.nama_member,
        telp: r.telp
      },
      space: {
        nama_space: r.nama_space,
        harga_per_jam: r.harga_per_jam
      }
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 24: PATCH /api/reservasi/:id/cancel
app.patch('/api/reservasi/:id/cancel', authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const appKey = req.appKey;

    const r = await dbGet(`SELECT * FROM reservasi WHERE id = ? AND app_key = ?`, [id, appKey]);
    if (!r) {
      return sendError(res, 404, 'Reservasi tidak ditemukan!', 'NotFound');
    }

    await dbRun(`UPDATE reservasi SET status = 'dibatalkan', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [id]);

    return sendSuccess(res, 200, 'Reservasi berhasil dibatalkan oleh pengguna', {
      id: Number(id),
      status: 'dibatalkan',
      updated_at: new Date().toISOString()
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// ==========================================
// 7. PROFIL LOKASI COWORKING SPACE (PANEL ADMIN)
// ==========================================

// Endpoint 25: GET /api/admin/profile
app.get('/api/admin/profile', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const appKey = req.appKey;
    const profile = await dbGet(`SELECT * FROM space_owners WHERE app_key = ? ORDER BY id ASC LIMIT 1`, [appKey]);

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', {
      id: profile ? profile.id : 1,
      nama_coworking: profile ? profile.nama_coworking : 'Moklet Hub Coworking Space',
      nama_pemilik: profile ? profile.nama_pemilik : 'Ahmad Bidin, S.Kom',
      telp: profile ? profile.telp : '081298765432'
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 26: PUT /api/admin/profile
app.put('/api/admin/profile', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { nama_coworking, nama_pemilik, telp } = req.body;
    const appKey = req.appKey;

    let profile = await dbGet(`SELECT * FROM space_owners WHERE app_key = ? ORDER BY id ASC LIMIT 1`, [appKey]);

    if (!profile) {
      const userObj = await dbGet(`SELECT id FROM users WHERE role = 'admin_space' AND app_key = ?`, [appKey]);
      const userId = userObj ? userObj.id : req.user.id;
      const resOwner = await dbRun(
        `INSERT INTO space_owners (id_user, nama_coworking, nama_pemilik, telp, app_key) VALUES (?, ?, ?, ?, ?)`,
        [userId, nama_coworking, nama_pemilik, telp, appKey]
      );
      profile = { id: resOwner.lastID };
    } else {
      await dbRun(
        `UPDATE space_owners SET nama_coworking = ?, nama_pemilik = ?, telp = ? WHERE id = ?`,
        [nama_coworking || profile.nama_coworking, nama_pemilik || profile.nama_pemilik, telp || profile.telp, profile.id]
      );
    }

    return sendSuccess(res, 200, 'Profil Coworking Space berhasil diperbarui!', {
      id: profile.id,
      nama_coworking: nama_coworking || profile.nama_coworking,
      nama_pemilik: nama_pemilik || profile.nama_pemilik,
      telp: telp || profile.telp
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// ==========================================
// 8. MANAJEMEN MEMBER / PELANGGAN (PANEL ADMIN)
// ==========================================

// Endpoint 27: GET /api/admin/members
app.get('/api/admin/members', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { search } = req.query as any;
    const appKey = req.appKey;

    let query = `SELECT m.*, u.username FROM members m LEFT JOIN users u ON m.id_user = u.id WHERE m.app_key = ?`;
    const params: any[] = [appKey];

    if (search) {
      query += ` AND (m.nama_member LIKE ? OR m.instansi LIKE ? OR m.telp LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY m.id DESC`;

    const members = await dbAll(query, params);
    return sendSuccess(res, 200, 'Berhasil memproses permintaan', members);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 28: POST /api/admin/members
app.post('/api/admin/members', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { username, password, nama_member, instansi, alamat, telp, foto } = req.body;
    const appKey = req.appKey;

    if (!username || !password || !nama_member) {
      return sendError(res, 400, 'Username, password, dan nama_member wajib diisi!', 'Bad Request');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRes = await dbRun(
      `INSERT INTO users (username, password, role, app_key) VALUES (?, ?, 'member', ?)`,
      [username, hashedPassword, appKey]
    );

    const memberRes = await dbRun(
      `INSERT INTO members (id_user, nama_member, instansi, alamat, telp, foto, app_key) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userRes.lastID, nama_member, instansi || '', alamat || '', telp || '', foto || 'budi.jpg', appKey]
    );

    return sendSuccess(res, 201, 'Data member baru berhasil ditambahkan!', {
      id: memberRes.lastID,
      nama_member,
      instansi: instansi || '',
      alamat: alamat || '',
      telp: telp || '',
      foto: foto || 'budi.jpg'
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 29: GET /api/admin/members/:id
app.get('/api/admin/members/:id', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const appKey = req.appKey;

    const member = await dbGet(`SELECT * FROM members WHERE id = ? AND app_key = ?`, [id, appKey]);
    if (!member) {
      return sendError(res, 404, 'Member tidak ditemukan!', 'NotFound');
    }

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', member);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 30: PUT /api/admin/members/:id
app.put('/api/admin/members/:id', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nama_member, instansi, alamat, telp, foto } = req.body;
    const appKey = req.appKey;

    const member = await dbGet(`SELECT * FROM members WHERE id = ? AND app_key = ?`, [id, appKey]);
    if (!member) {
      return sendError(res, 404, 'Member tidak ditemukan!', 'NotFound');
    }

    await dbRun(
      `UPDATE members SET 
        nama_member = COALESCE(?, nama_member),
        instansi = COALESCE(?, instansi),
        alamat = COALESCE(?, alamat),
        telp = COALESCE(?, telp),
        foto = COALESCE(?, foto)
       WHERE id = ?`,
      [nama_member, instansi, alamat, telp, foto, id]
    );

    const updated = await dbGet(`SELECT * FROM members WHERE id = ?`, [id]);
    return sendSuccess(res, 200, 'Data member berhasil diperbarui!', updated);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 31: DELETE /api/admin/members/:id
app.delete('/api/admin/members/:id', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const appKey = req.appKey;

    const member = await dbGet(`SELECT * FROM members WHERE id = ? AND app_key = ?`, [id, appKey]);
    if (!member) {
      return sendError(res, 404, 'Member tidak ditemukan!', 'NotFound');
    }

    await dbRun(`DELETE FROM members WHERE id = ?`, [id]);
    await dbRun(`DELETE FROM users WHERE id = ?`, [member.id_user]);

    return sendSuccess(res, 200, 'Data member berhasil dihapus!', {
      id: Number(id),
      deleted: true
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// ==========================================
// 9. MANAJEMEN SPACE RUANGAN & MEJA (PANEL ADMIN)
// ==========================================

// Endpoint 32: GET /api/admin/spaces
app.get('/api/admin/spaces', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const appKey = req.appKey;
    const spaces = await dbAll(`SELECT * FROM spaces WHERE app_key = ? ORDER BY id ASC`, [appKey]);

    const formatted = spaces.map((s) => ({
      ...s,
      foto_url: `http://localhost:${PORT}/uploads/spaces/${s.foto || 'desk_flexi_01.jpg'}`
    }));

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', formatted);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 33: POST /api/admin/spaces
app.post('/api/admin/spaces', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { nama_space, harga_per_jam, tipe, kapasitas, deskripsi, foto } = req.body;
    const appKey = req.appKey;

    if (!nama_space || !harga_per_jam || !tipe || !deskripsi) {
      return sendError(res, 400, 'Nama space, harga per jam, tipe, dan deskripsi wajib diisi!', 'Bad Request');
    }

    const owner = await dbGet(`SELECT id FROM space_owners WHERE app_key = ? LIMIT 1`, [appKey]);
    const ownerId = owner ? owner.id : 1;

    const result = await dbRun(
      `INSERT INTO spaces (id_owner, nama_space, harga_per_jam, tipe, kapasitas, deskripsi, foto, app_key)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [ownerId, nama_space, Number(harga_per_jam), tipe, Number(kapasitas) || 1, deskripsi, foto || 'desk_alpha_01.jpg', appKey]
    );

    return sendSuccess(res, 201, 'Space baru berhasil ditambahkan!', {
      id: result.lastID,
      nama_space,
      harga_per_jam: Number(harga_per_jam),
      tipe,
      kapasitas: Number(kapasitas) || 1,
      deskripsi,
      foto: foto || 'desk_alpha_01.jpg',
      id_owner: ownerId
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 34: GET /api/admin/spaces/:id
app.get('/api/admin/spaces/:id', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const appKey = req.appKey;

    const s = await dbGet(`SELECT * FROM spaces WHERE id = ? AND app_key = ?`, [id, appKey]);
    if (!s) {
      return sendError(res, 404, 'Space tidak ditemukan!', 'NotFound');
    }

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', s);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 35: PUT /api/admin/spaces/:id
app.put('/api/admin/spaces/:id', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nama_space, harga_per_jam, tipe, kapasitas, deskripsi, foto } = req.body;
    const appKey = req.appKey;

    const s = await dbGet(`SELECT * FROM spaces WHERE id = ? AND app_key = ?`, [id, appKey]);
    if (!s) {
      return sendError(res, 404, 'Space tidak ditemukan!', 'NotFound');
    }

    await dbRun(
      `UPDATE spaces SET
        nama_space = COALESCE(?, nama_space),
        harga_per_jam = COALESCE(?, harga_per_jam),
        tipe = COALESCE(?, tipe),
        kapasitas = COALESCE(?, kapasitas),
        deskripsi = COALESCE(?, deskripsi),
        foto = COALESCE(?, foto)
       WHERE id = ?`,
      [nama_space, harga_per_jam, tipe, kapasitas, deskripsi, foto, id]
    );

    const updated = await dbGet(`SELECT * FROM spaces WHERE id = ?`, [id]);
    return sendSuccess(res, 200, 'Data space berhasil diperbarui!', updated);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 36: DELETE /api/admin/spaces/:id
app.delete('/api/admin/spaces/:id', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const appKey = req.appKey;

    const s = await dbGet(`SELECT * FROM spaces WHERE id = ? AND app_key = ?`, [id, appKey]);
    if (!s) {
      return sendError(res, 404, 'Space tidak ditemukan!', 'NotFound');
    }

    await dbRun(`DELETE FROM spaces WHERE id = ?`, [id]);

    return sendSuccess(res, 200, 'Space berhasil dihapus!', {
      id: Number(id),
      deleted: true
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// ==========================================
// 10. MANAJEMEN KODE PROMO & DISKON (PANEL ADMIN)
// ==========================================

// Endpoint 37: GET /api/admin/diskon
app.get('/api/admin/diskon', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const appKey = req.appKey;
    const diskons = await dbAll(`SELECT * FROM diskon WHERE app_key = ? ORDER BY id ASC`, [appKey]);
    return sendSuccess(res, 200, 'Berhasil memproses permintaan', diskons);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 38: POST /api/admin/diskon
app.post('/api/admin/diskon', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { nama_diskon, persentase_diskon, tanggal_awal, tanggal_akhir } = req.body;
    const appKey = req.appKey;

    if (!nama_diskon || !persentase_diskon || !tanggal_awal || !tanggal_akhir) {
      return sendError(res, 400, 'Nama diskon, persentase, tanggal_awal, dan tanggal_akhir wajib diisi!', 'Bad Request');
    }

    const result = await dbRun(
      `INSERT INTO diskon (nama_diskon, persentase_diskon, tanggal_awal, tanggal_akhir, app_key)
       VALUES (?, ?, ?, ?, ?)`,
      [nama_diskon.toUpperCase(), Number(persentase_diskon), tanggal_awal, tanggal_akhir, appKey]
    );

    return sendSuccess(res, 201, 'Kode promo baru berhasil dibuat!', {
      id: result.lastID,
      nama_diskon: nama_diskon.toUpperCase(),
      persentase_diskon: Number(persentase_diskon),
      tanggal_awal,
      tanggal_akhir
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 39: GET /api/admin/diskon/:id
app.get('/api/admin/diskon/:id', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const appKey = req.appKey;

    const d = await dbGet(`SELECT * FROM diskon WHERE id = ? AND app_key = ?`, [id, appKey]);
    if (!d) {
      return sendError(res, 404, 'Diskon tidak ditemukan!', 'NotFound');
    }

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', d);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 40: PUT /api/admin/diskon/:id
app.put('/api/admin/diskon/:id', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nama_diskon, persentase_diskon, tanggal_awal, tanggal_akhir } = req.body;
    const appKey = req.appKey;

    const d = await dbGet(`SELECT * FROM diskon WHERE id = ? AND app_key = ?`, [id, appKey]);
    if (!d) {
      return sendError(res, 404, 'Diskon tidak ditemukan!', 'NotFound');
    }

    await dbRun(
      `UPDATE diskon SET
        nama_diskon = COALESCE(?, nama_diskon),
        persentase_diskon = COALESCE(?, persentase_diskon),
        tanggal_awal = COALESCE(?, tanggal_awal),
        tanggal_akhir = COALESCE(?, tanggal_akhir)
       WHERE id = ?`,
      [nama_diskon ? nama_diskon.toUpperCase() : null, persentase_diskon, tanggal_awal, tanggal_akhir, id]
    );

    const updated = await dbGet(`SELECT * FROM diskon WHERE id = ?`, [id]);
    return sendSuccess(res, 200, 'Data promo diskon berhasil diperbarui!', updated);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 41: DELETE /api/admin/diskon/:id
app.delete('/api/admin/diskon/:id', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const appKey = req.appKey;

    const d = await dbGet(`SELECT * FROM diskon WHERE id = ? AND app_key = ?`, [id, appKey]);
    if (!d) {
      return sendError(res, 404, 'Diskon tidak ditemukan!', 'NotFound');
    }

    await dbRun(`DELETE FROM diskon WHERE id = ?`, [id]);

    return sendSuccess(res, 200, 'Kode promo berhasil dihapus!', {
      id: Number(id),
      deleted: true
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// ==========================================
// 11. TRANSAKSI RESERVASI & CHECK-IN/OUT (PANEL ADMIN)
// ==========================================

// Endpoint 42: GET /api/admin/reservasi
app.get('/api/admin/reservasi', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { month, year, status, id_space, tanggal } = req.query as any;
    const appKey = req.appKey;

    let query = `SELECT r.*, s.nama_space, s.tipe, m.nama_member, m.telp
                 FROM reservasi r
                 LEFT JOIN spaces s ON r.id_space = s.id
                 LEFT JOIN members m ON r.id_member = m.id
                 WHERE r.app_key = ?`;
    const params: any[] = [appKey];

    if (status) {
      query += ` AND r.status = ?`;
      params.push(status);
    }
    if (id_space) {
      query += ` AND r.id_space = ?`;
      params.push(id_space);
    }
    if (tanggal) {
      query += ` AND r.tanggal_reservasi = ?`;
      params.push(tanggal);
    }

    query += ` ORDER BY r.id DESC`;

    const list = await dbAll(query, params);

    const filtered = list.filter((r) => {
      const d = new Date(r.tanggal_reservasi);
      const mMatch = month ? d.getMonth() + 1 === Number(month) : true;
      const yMatch = year ? d.getFullYear() === Number(year) : true;
      return mMatch && yMatch;
    });

    const formatted = filtered.map((r) => ({
      id: r.id,
      kode_booking: r.kode_booking,
      tanggal_reservasi: r.tanggal_reservasi,
      jam_mulai: r.jam_mulai,
      jam_selesai: r.jam_selesai,
      durasi_jam: r.durasi_jam,
      total_harga_awal: r.total_harga_awal,
      potongan_diskon: r.potongan_diskon,
      total_bayar: r.total_bayar,
      status: r.status,
      member: {
        id: r.id_member,
        nama_member: r.nama_member || 'John Doe',
        telp: r.telp || '081234567890'
      },
      space: {
        id: r.id_space,
        nama_space: r.nama_space || 'Personal Desk - Flexi 01',
        tipe: r.tipe || 'desk'
      }
    }));

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', formatted);
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 43: PATCH /api/admin/reservasi/:id/status
app.patch('/api/admin/reservasi/:id/status', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appKey = req.appKey;

    if (!status) {
      return sendError(res, 400, 'Status wajib diisi!', 'Bad Request');
    }

    const r = await dbGet(`SELECT * FROM reservasi WHERE id = ? AND app_key = ?`, [id, appKey]);
    if (!r) {
      return sendError(res, 404, 'Reservasi tidak ditemukan!', 'NotFound');
    }

    await dbRun(`UPDATE reservasi SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [status, id]);

    return sendSuccess(res, 200, `Status reservasi berhasil diperbarui menjadi ${status}`, {
      id: Number(id),
      status,
      updated_at: new Date().toISOString()
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 44: POST /api/admin/reservasi/:id/check-in
app.post('/api/admin/reservasi/:id/check-in', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const appKey = req.appKey;

    const r = await dbGet(`SELECT * FROM reservasi WHERE id = ? AND app_key = ?`, [id, appKey]);
    if (!r) {
      return sendError(res, 404, 'Reservasi tidak ditemukan!', 'NotFound');
    }

    const checkInTime = new Date().toISOString();
    await dbRun(`UPDATE reservasi SET status = 'aktif', check_in_time = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [checkInTime, id]);

    return sendSuccess(res, 200, 'Check-in member berhasil! Status reservasi aktif.', {
      id: Number(id),
      status: 'aktif',
      check_in_time: checkInTime
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// Endpoint 45: POST /api/admin/reservasi/:id/check-out
app.post('/api/admin/reservasi/:id/check-out', authenticateToken, requireRole('admin_space'), async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const appKey = req.appKey;

    const r = await dbGet(`SELECT * FROM reservasi WHERE id = ? AND app_key = ?`, [id, appKey]);
    if (!r) {
      return sendError(res, 404, 'Reservasi tidak ditemukan!', 'NotFound');
    }

    const checkOutTime = new Date().toISOString();
    await dbRun(`UPDATE reservasi SET status = 'selesai', check_out_time = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [checkOutTime, id]);

    return sendSuccess(res, 200, 'Check-out member berhasil! Reservasi telah selesai.', {
      id: Number(id),
      status: 'selesai',
      check_out_time: checkOutTime
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
});

// ==========================================
// 12. REKAPITULASI LAPORAN PENDAPATAN (PANEL ADMIN)
// ==========================================

const handleMonthlyReport = async (req: CustomRequest, res: Response) => {
  try {
    const { month, year } = req.query as any;
    const appKey = req.appKey;

    const targetMonth = month ? Number(month) : 8;
    const targetYear = year ? Number(year) : 2026;

    const reservations = await dbAll(
      `SELECT r.*, s.tipe 
       FROM reservasi r 
       LEFT JOIN spaces s ON r.id_space = s.id 
       WHERE r.app_key = ? AND r.status != 'dibatalkan'`,
      [appKey]
    );

    const filtered = reservations.filter((r) => {
      const d = new Date(r.tanggal_reservasi);
      return d.getMonth() + 1 === targetMonth && d.getFullYear() === targetYear;
    });

    const total_transaksi = filtered.length;
    const total_jam_terpakai = filtered.reduce((acc, curr) => acc + curr.durasi_jam, 0);
    const estimasi_pendapatan_kotor = filtered.reduce((acc, curr) => acc + curr.total_harga_awal, 0);
    const total_potongan_diskon = filtered.reduce((acc, curr) => acc + curr.potongan_diskon, 0);
    const realisasi_pendapatan_bersih = filtered.reduce((acc, curr) => acc + curr.total_bayar, 0);

    const tipeGroup: Record<string, any> = {
      desk: { tipe: 'desk', label: 'Personal Desk', total_booking: 0, total_jam: 0, total_pendapatan: 0 },
      meeting_room: { tipe: 'meeting_room', label: 'Meeting Room', total_booking: 0, total_jam: 0, total_pendapatan: 0 },
      private_office: { tipe: 'private_office', label: 'Private Office', total_booking: 0, total_jam: 0, total_pendapatan: 0 }
    };

    filtered.forEach((r) => {
      const typeKey = r.tipe || 'desk';
      if (!tipeGroup[typeKey]) {
        tipeGroup[typeKey] = { tipe: typeKey, label: typeKey, total_booking: 0, total_jam: 0, total_pendapatan: 0 };
      }
      tipeGroup[typeKey].total_booking += 1;
      tipeGroup[typeKey].total_jam += r.durasi_jam;
      tipeGroup[typeKey].total_pendapatan += r.total_bayar;
    });

    return sendSuccess(res, 200, 'Berhasil memproses permintaan', {
      month: targetMonth,
      year: targetYear,
      total_transaksi,
      total_jam_terpakai,
      estimasi_pendapatan_kotor,
      total_potongan_diskon,
      realisasi_pendapatan_bersih,
      rincian_per_tipe_space: Object.values(tipeGroup)
    });
  } catch (err: any) {
    return sendError(res, 500, err.message, 'InternalServerError');
  }
};

// Endpoint 46: GET /api/admin/reports/monthly
app.get('/api/admin/reports/monthly', authenticateToken, requireRole('admin_space'), handleMonthlyReport);

// Endpoint 47: GET /api/admin/reports/income
app.get('/api/admin/reports/income', authenticateToken, requireRole('admin_space'), handleMonthlyReport);

// ==========================================
// 13. UPLOAD BERKAS & GAMBAR (MEDIA)
// ==========================================

// Endpoint 48: POST /api/upload/image
app.post('/api/upload/image', uploadGeneral.any(), (req: CustomRequest, res: Response) => {
  const file = req.files && req.files.length > 0 ? req.files[0] : req.file;
  if (!file) {
    return sendError(res, 400, 'Berkas gambar wajib diunggah!', 'Bad Request');
  }
  const filename = file.filename;
  return sendSuccess(res, 201, 'File berhasil diupload', {
    filename,
    original_name: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: `http://localhost:${PORT}/uploads/general/${filename}`
  });
});

// Endpoint 49: POST /api/upload/spaces
app.post('/api/upload/spaces', uploadSpaces.any(), (req: CustomRequest, res: Response) => {
  const file = req.files && req.files.length > 0 ? req.files[0] : req.file;
  if (!file) {
    return sendError(res, 400, 'Berkas foto ruangan wajib diunggah!', 'Bad Request');
  }
  const filename = file.filename;
  return sendSuccess(res, 201, 'Foto space berhasil diupload', {
    filename,
    url: `http://localhost:${PORT}/uploads/spaces/${filename}`
  });
});

// Endpoint 50: POST /api/upload/members
app.post('/api/upload/members', uploadMembers.any(), (req: CustomRequest, res: Response) => {
  const file = req.files && req.files.length > 0 ? req.files[0] : req.file;
  if (!file) {
    return sendError(res, 400, 'Berkas foto member wajib diunggah!', 'Bad Request');
  }
  const filename = file.filename;
  return sendSuccess(res, 201, 'Foto member berhasil diupload', {
    filename,
    url: `http://localhost:${PORT}/uploads/members/${filename}`
  });
});

// 404 Route Handler
app.use((req: CustomRequest, res: Response) => {
  return sendError(res, 404, `Endpoint ${req.method} ${req.url} tidak ditemukan!`, 'NotFound');
});

// Start Server & Seed Database
const startServer = async () => {
  try {
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Backend Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start backend server:', err);
  }
};

startServer();
