import bcrypt from 'bcryptjs';
import { initDb, dbRun, dbGet } from './db.js';
export const seedDatabase = async () => {
    await initDb();
    const defaultKey = 'mk_default_ukk_2026';
    const hashedPassMember = await bcrypt.hash('member123', 10);
    const hashedPassAdmin = await bcrypt.hash('admin123', 10);
    const hashedPassJohn = await bcrypt.hash('Secret123!', 10);
    // 1. Seed App Makers
    const existingMaker = await dbGet(`SELECT * FROM app_makers WHERE app_key = ?`, [defaultKey]);
    if (!existingMaker) {
        await dbRun(`
      INSERT INTO app_makers (id, name, username, email, password, app_key)
      VALUES (1, 'Admin Default UKK', 'admin_default', 'admin@ukk.sch.id', ?, ?)
    `, [hashedPassAdmin, defaultKey]);
        await dbRun(`
      INSERT INTO app_makers (id, name, username, email, password, app_key)
      VALUES (5, 'Budi Santoso', 'budisantoso', 'budi@smk.sch.id', ?, 'mk_4ffb8c4b40a6499ea7767bfafb32f6e0')
    `, [hashedPassJohn]);
    }
    // 2. Seed Admin Space User & Space Owner
    let adminUser = await dbGet(`SELECT * FROM users WHERE username = ? AND app_key = ?`, ['admin@horizonhub.id', defaultKey]);
    if (!adminUser) {
        const resUser = await dbRun(`
      INSERT INTO users (username, password, role, app_key)
      VALUES ('admin@horizonhub.id', ?, 'admin_space', ?)
    `, [hashedPassAdmin, defaultKey]);
        await dbRun(`
      INSERT INTO space_owners (id_user, nama_coworking, nama_pemilik, telp, app_key)
      VALUES (?, 'Moklet Hub Coworking Space', 'Ahmad Bidin, S.Kom', '081298765432', ?)
    `, [resUser.lastID, defaultKey]);
    }
    let adminUser2 = await dbGet(`SELECT * FROM users WHERE username = ? AND app_key = ?`, ['admin_space1', defaultKey]);
    if (!adminUser2) {
        const resUser = await dbRun(`
      INSERT INTO users (username, password, role, app_key)
      VALUES ('admin_space1', ?, 'admin_space', ?)
    `, [hashedPassJohn, defaultKey]);
        await dbRun(`
      INSERT INTO space_owners (id_user, nama_coworking, nama_pemilik, telp, app_key)
      VALUES (?, 'Moklet Hub Coworking Space', 'Ahmad Bidin, S.Kom', '081298765432', ?)
    `, [resUser.lastID, defaultKey]);
    }
    // 3. Seed Member Users
    let memberUser = await dbGet(`SELECT * FROM users WHERE username = ? AND app_key = ?`, ['member@gmail.com', defaultKey]);
    if (!memberUser) {
        const resUser = await dbRun(`
      INSERT INTO users (username, password, role, app_key)
      VALUES ('member@gmail.com', ?, 'member', ?)
    `, [hashedPassMember, defaultKey]);
        await dbRun(`
      INSERT INTO members (id_user, nama_member, instansi, alamat, telp, foto, app_key)
      VALUES (?, 'Budi Raharjo', 'SMK Telkom Malang', 'Jl. Danau Ranau No. 1, Sawojajar, Malang', '085712345678', 'budi.jpg', ?)
    `, [resUser.lastID, defaultKey]);
    }
    let johnUser = await dbGet(`SELECT * FROM users WHERE username = ? AND app_key = ?`, ['johndoe', defaultKey]);
    if (!johnUser) {
        const resUser = await dbRun(`
      INSERT INTO users (username, password, role, app_key)
      VALUES ('johndoe', ?, 'member', ?)
    `, [hashedPassJohn, defaultKey]);
        await dbRun(`
      INSERT INTO members (id_user, nama_member, instansi, alamat, telp, foto, app_key)
      VALUES (?, 'John Doe', 'Universitas Indonesia / PT Maju Mundur', 'Jl. Sudirman No. 123, Jakarta Selatan', '081234567890', 'member_john.jpg', ?)
    `, [resUser.lastID, defaultKey]);
    }
    // 4. Seed Spaces
    const existingSpace = await dbGet(`SELECT * FROM spaces WHERE app_key = ?`, [defaultKey]);
    if (!existingSpace) {
        const owner = await dbGet(`SELECT id FROM space_owners WHERE app_key = ? LIMIT 1`, [defaultKey]);
        const ownerId = owner ? owner.id : 1;
        await dbRun(`
      INSERT INTO spaces (id, id_owner, nama_space, harga_per_jam, tipe, kapasitas, foto, deskripsi, app_key)
      VALUES 
      (1, ?, 'Personal Desk - Flexi 01', 20000, 'desk', 1, 'desk_flexi_01.jpg', 'Meja kerja individual yang tenang dan nyaman dengan colokan listrik, WiFi kencang 100Mbps, lampu meja LED, dan free refill air mineral.', ?),
      (2, ?, 'Personal Desk Alpha 01', 25000, 'desk', 1, 'desk_alpha_01.jpg', 'Meja kerja privat ergonomis dilengkapi stopkontak dedicated dan free flow kopi/teh.', ?),
      (3, ?, 'Meeting Room Alpha', 100000, 'meeting_room', 8, 'meeting_room_alpha.jpg', 'Ruang rapat kedap suara berkapasitas 8 orang, dilengkapi Smart TV 55 inch untuk presentasi, soundbar Bluetooth, whiteboard kaca, AC dingin, dan conference speaker.', ?),
      (4, ?, 'Private Office Executive', 150000, 'private_office', 10, 'private_office_executive.jpg', 'Ruang kantor privat eksklusif untuk tim kecil hingga menengah dengan akses fleksibel dan keamanan 24 jam.', ?)
    `, [ownerId, defaultKey, ownerId, defaultKey, ownerId, defaultKey, ownerId, defaultKey]);
    }
    // 5. Seed Discounts
    const existingDiskon = await dbGet(`SELECT * FROM diskon WHERE app_key = ?`, [defaultKey]);
    if (!existingDiskon) {
        await dbRun(`
      INSERT INTO diskon (id, nama_diskon, persentase_diskon, tanggal_awal, tanggal_akhir, app_key)
      VALUES 
      (1, 'DISKONHEMAT20', 20, '2026-01-01T00:00:00.000Z', '2026-12-31T23:59:59.000Z', ?),
      (2, 'UKKPROMO50', 50, '2026-08-01T00:00:00.000Z', '2026-09-30T23:59:59.000Z', ?),
      (3, 'PROMOCOWORKING', 20, '2026-01-01T00:00:00.000Z', '2026-12-31T23:59:59.000Z', ?),
      (4, 'HEBATSAMPAI20', 15, '2026-01-01T00:00:00.000Z', '2026-12-31T23:59:59.000Z', ?)
    `, [defaultKey, defaultKey, defaultKey, defaultKey]);
    }
    // 6. Seed Sample Reservations
    const existingReservasi = await dbGet(`SELECT * FROM reservasi WHERE app_key = ?`, [defaultKey]);
    if (!existingReservasi) {
        const member = await dbGet(`SELECT id FROM members WHERE app_key = ? LIMIT 1`, [defaultKey]);
        const memberId = member ? member.id : 1;
        await dbRun(`
      INSERT INTO reservasi (
        id, kode_booking, id_member, id_space, id_diskon, kode_promo,
        tanggal_reservasi, jam_mulai, jam_selesai, durasi_jam, harga_per_jam,
        total_harga_awal, potongan_diskon, total_bayar, status, app_key
      )
      VALUES (
        12, 'BOOK-20260830-0012', ?, 1, 1, 'DISKONHEMAT20',
        '2026-08-30', '09:00', '12:00', 3, 20000,
        60000, 12000, 48000, 'disetujui', ?
      )
    `, [memberId, defaultKey]);
    }
    console.log('✅ Database seeded successfully!');
};
if (process.argv[1] && process.argv[1].includes('seed')) {
    seedDatabase().catch((err) => {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    });
}
