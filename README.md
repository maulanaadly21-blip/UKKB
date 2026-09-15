# 🏢 Smart Space Booking - Sistem Reservasi Coworking Space & Workstation
**UKK RPL 2026/2027 Paket B**

Aplikasi sistem pemesanan Coworking Space *end-to-end* berbasis **Decoupled Architecture** (Backend RESTful API & Frontend React SPA terpisah).

---

## 🎨 Visual Identity & Theme
* **Theme Mode**: Strict Light & Professional (Warm Emerald `#0F766E`, Slate-50 `#F8FAFC`, Pure White `#FFFFFF`, Crisp Border `#E2E8F0`).
* **Typography**: Plus Jakarta Sans & Inter font hierarchy.
* **Layout Aesthetics**: Modular Linear/Airbnb Workspaces aesthetic with real-time floor plan matrix and schedule slider.

---

## 🚀 Unique Killer Features
1. **Smart Focus Heatmap & Live Schedule Slider**:
   * Interactive horizontal time slider (08:00 - 22:00) that updates room catalog & mini floor plan matrix availability status instantly (Tersedia / Emerald, Terisi / Amber, Promo / Teal).
2. **Workspace Amenity Matcher**:
   * Smart filter matching fiber connectivity, 4K displays, Herman Miller chairs, soundproofing, and auto-applying best active voucher codes.
3. **Digital E-Ticket with QR Code Generator**:
   * Dynamic base64 QR Code canvas generation, printable pass with reference code and receptionist scan validation.
4. **Admin Space Panel & Scanner**:
   * Dashboard revenue stats, room type distribution chart (Recharts), CRUD Space & Voucher, Quick QR Check-In (`dikonfirmasi` -> `aktif` -> `selesai`).

---

## 📁 Monorepo Folder Structure

```
coworking-booking-system/
├── backend/
│   ├── src/
│   │   ├── config/             # DB & JWT configurations
│   │   ├── controllers/        # Request handlers (auth, space, reservasi, diskon, stats, spaceOwner)
│   │   ├── middleware/         # Auth JWT, Role Checker ('member' / 'admin_space'), App-Key Validator ('x-maker-key')
│   │   ├── models/             # Database schemas & migrations (SQLite)
│   │   ├── routes/             # RESTful API endpoints contract
│   │   ├── services/           # Business logic (overlap detection, discount calc, floorplan heatmap)
│   │   ├── utils/              # Response formatter & QR Code helper
│   │   └── server.js           # Server entry point
│   ├── scripts/                # Database seed script (node scripts/seed.js)
│   ├── data/                   # SQLite database storage file
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios instance (Bearer token & x-maker-key interceptors)
│   │   ├── components/
│   │   │   ├── common/         # Button, Input, Select, Modal, Badge, Card
│   │   │   ├── layout/         # Navbar, Sidebar, MemberLayout, AdminLayout, Footer
│   │   │   ├── member/         # SpaceCard, TimeSlider, FloorPlanHeatmap, AmenityMatcher, ETicketModal
│   │   │   └── admin/          # RevenueChart, StatusBadge, CheckInScanner, RoomModal, DiscountModal
│   │   ├── context/            # AuthContext, NotificationContext
│   │   ├── pages/
│   │   │   ├── auth/           # Login, RegisterMember, RegisterAdminSpace
│   │   │   ├── member/         # CatalogPage, CheckoutPage, ReservationStatusPage, HistoryPage
│   │   │   └── admin/          # AdminDashboardPage, ManageSpacesPage, ManageDiscountsPage, ManageReservationsPage, SpaceProfilePage
│   │   ├── styles/             # Tailwind CSS tokens & index.css
│   │   └── App.jsx / main.jsx
│   ├── .env
│   └── package.json
└── README.md
```

---

## 🔑 Login Demo Accounts (Seeded)

| Role | Email | Password | Keterangan |
|---|---|---|---|
| **Member (VIP)** | `member@gmail.com` | `member123` | Member reguler / VIP |
| **Admin Space** | `admin@horizonhub.id` | `admin123` | Pengelola Horizon Workspaces |

### Voucher Promo Aktif
- `PROMOCOWORKING`: Potongan 20% (Min. durasi 2 jam)
- `HEBATSAMPAI20`: Potongan 15% (Min. durasi 1 jam)

---

## 💻 Cara Menjalankan Aplikasi

### 1. Menjalankan Backend API:
```bash
cd backend
npm install
npm run seed   # Mengisi dummy data awal
npm start      # Berjalan di http://localhost:5001
```

### 2. Menjalankan Frontend Web:
```bash
cd frontend
npm install
npm run dev    # Berjalan di http://localhost:3000
```
