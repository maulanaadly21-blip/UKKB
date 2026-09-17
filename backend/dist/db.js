import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath);
// Helper promise functions
export const dbRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err)
                reject(err);
            else
                resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};
export const dbGet = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
};
export const dbAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
};
export const initDb = async () => {
    await dbRun(`PRAGMA foreign_keys = ON;`);
    // App Makers Table
    await dbRun(`
    CREATE TABLE IF NOT EXISTS app_makers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      app_key TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
    // Users Table
    await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('member', 'admin_space')),
      app_key TEXT NOT NULL DEFAULT 'mk_default_ukk_2026',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
    // Members Table
    await dbRun(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_user INTEGER NOT NULL,
      nama_member TEXT NOT NULL,
      instansi TEXT,
      alamat TEXT,
      telp TEXT,
      foto TEXT,
      app_key TEXT NOT NULL DEFAULT 'mk_default_ukk_2026',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
    // Space Owners Table
    await dbRun(`
    CREATE TABLE IF NOT EXISTS space_owners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_user INTEGER NOT NULL,
      nama_coworking TEXT NOT NULL,
      nama_pemilik TEXT NOT NULL,
      telp TEXT NOT NULL,
      app_key TEXT NOT NULL DEFAULT 'mk_default_ukk_2026',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
    // Spaces Table
    await dbRun(`
    CREATE TABLE IF NOT EXISTS spaces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_owner INTEGER NOT NULL,
      nama_space TEXT NOT NULL,
      harga_per_jam REAL NOT NULL,
      tipe TEXT NOT NULL CHECK(tipe IN ('desk', 'meeting_room', 'private_office')),
      kapasitas INTEGER NOT NULL DEFAULT 1,
      foto TEXT,
      deskripsi TEXT,
      app_key TEXT NOT NULL DEFAULT 'mk_default_ukk_2026',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
    // Diskon Table
    await dbRun(`
    CREATE TABLE IF NOT EXISTS diskon (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_diskon TEXT NOT NULL,
      persentase_diskon REAL NOT NULL,
      tanggal_awal TEXT NOT NULL,
      tanggal_akhir TEXT NOT NULL,
      app_key TEXT NOT NULL DEFAULT 'mk_default_ukk_2026',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
    // Reservasi Table
    await dbRun(`
    CREATE TABLE IF NOT EXISTS reservasi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kode_booking TEXT UNIQUE NOT NULL,
      id_member INTEGER NOT NULL,
      id_space INTEGER NOT NULL,
      id_diskon INTEGER,
      kode_promo TEXT,
      tanggal_reservasi TEXT NOT NULL,
      jam_mulai TEXT NOT NULL,
      jam_selesai TEXT NOT NULL,
      durasi_jam INTEGER NOT NULL,
      harga_per_jam REAL NOT NULL,
      total_harga_awal REAL NOT NULL,
      potongan_diskon REAL NOT NULL DEFAULT 0,
      total_bayar REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'belum_dikonfirm',
      check_in_time TEXT,
      check_out_time TEXT,
      qr_code_payload TEXT,
      app_key TEXT NOT NULL DEFAULT 'mk_default_ukk_2026',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
export default db;
