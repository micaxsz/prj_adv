# No-pedia

**Platform Manajemen dan Presentasi Tutorial Interaktif**

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-7.7.0-2D3748?style=flat-square&logo=prisma)
![MariaDB](https://img.shields.io/badge/MariaDB-10.x-003545?style=flat-square&logo=mariadb)

---

## Deskripsi Project

**No-pedia** adalah aplikasi web berbasis **Next.js** yang dirancang untuk **membuat, mengelola, dan mempresentasikan tutorial interaktif** kepada mahasiswa atau audiens lainnya. Berbeda dengan platform tutorial konvensional yang hanya menampilkan teks statis, No-pedia mendukung berbagai jenis konten multimedia — termasuk kode program dengan syntax highlighting — yang bisa dipresentasikan secara langsung melalui browser.

Aplikasi ini dibangun untuk **dosen, asisten teaching, atau siapapun** yang ingin menyampaikan materi tutorial dengan cara yang lebih terstruktur dan interaktif. Dosen dapat membuat tutorial dengan berbagai blok konten (teks, gambar, kode, dan tautan), mengatur urutannya, dan memilih bagian mana yang ingin ditampilkan saat presentasi.

**Masalah yang diselesaikan:**
- Tutorial convencional (Word/PDF) sulit diperbarui dan tidak interaktif
- Tidak ada platform khusus untuk membuat dan mempresentasikan tutorial paso-pasang
- Code snippet di tutorial biasa tidak memiliki syntax highlighting yang baik

---

## Fitur Utama

- **[Manajemen Tutorial Lengkap]** — CRUD (Create, Read, Update, Delete) penuh untuk tutorial. Setiap tutorial memiliki judul, foto cover, mata kuliah terkait, dan email kreatot

- **[Blok Konten Multi-Tipe]** — Setiap tutorial terdiri dari blok-blok konten yang bisa berupa:
  - **Text** — Teks biasa dengan support format **bold**
  - **Image** — Gambar dengan loading state
  - **Code** — Block kode dengan syntax highlighting otomatis (TSX, Python, HTML, dll)
  - **URL** — Tautan yang dirender menjadi card interaktif dengan favicon

- **[Drag & Drop Reordering]** — Urutan blok konten bisa diubah dengan mudah melalui fitur drag & drop. Urutan baru akan otomatis tersimpan ke database

- **[Visibility Toggle]** — Dosen bisa memilih bagian mana yang ditampilkan saat presentasi dan bagian mana yang disembunyikan. Berguna untuk mode "step-by-step" presentation

- **[Mode Presentasi vs Selesai]** — Dua tampilan berbeda:
  - **Presentation Mode** — Mengikuti visibility setting, cocok untuk presentasi langsung
  - **Finished Mode** — Menampilkan semua konten tanpa terkecuali, cocok untuk dokumentasi

- **[URL Slug Unik]** — Setiap tutorial memiliki dua URL unik: satu untuk presentasi dan satu untuk versi selesai. Slug di-generate otomatis dari judul dengan random number untuk menghindari duplikasi

- **[Real-time Polling]** — Halaman presentasi secara otomatis memperbarui konten setiap 5 detik untuk mendeteksi perubahan dari dosen

- **[Toast Notifications]** — Feedback visual untuk setiap aksi (berhasil/tambah/ubah/hapus) menggunakan sonner toasts

- **[Autentikasi Eksternal]** — Login terintegrasi dengan API autentikasi eksternal. Token disimpan di localStorage dan dikirim sebagai Bearer token di setiap request

---

## Teknologi yang Digunakan

### Frontend

| Teknologi | Fungsi dalam Project | Alasan Pemilihan |
|----------|---------------------|-----------------|
| **Next.js 16** | Framework utama dengan App Router | Digunakan sebagai fondasi aplikasi. App Router memungkinkan route-based architecture yang bersih dan efisien |
| **React 19** | Library untuk membangun antarmuka | Sistem komponen React memudahkan pembuatan UI yang bisa dipakai ulang di banyak halaman |
| **Tailwind CSS 4** | Utility-first CSS framework | Mempercepat styling dengan class-based approach. Konsisten dengan desain shadcn/ui |
| **shadcn/ui** | Koleksi komponen UI yang bisa di-copy-paste | Komponen yang indah dan accessible, dapat disesuaikan sepenuhnya tanpa batasan library |
| **Lucide React** | Library ikon | Ikon yang clean dan konsisten untuk UI |
| **Sonner** | Toast notifications | Library toast yang ringan dan terlihat profesional |
| **Radix UI** | Primitives untuk komponen aksesibel | Fondasi shadcn/ui untuk aksesibilitas (focus management, keyboard navigation) |

### Backend

| Teknologi | Fungsi dalam Project | Alasan Pemilihan |
|----------|---------------------|-----------------|
| **Next.js API Routes** | Handler untuk endpoint API | Tidak perlu server terpisah — API routes berjalan di dalam Next.js |
| **Prisma ORM 7** | Database ORM | Type-safe database access dengan migration yang mudah. Generate client dari schema |
| **External Auth API** | Autentikasi user | Tidak perlu implementasi auth dari nol — integrate dengan API yang sudah ada |

### Database

| Teknologi | Fungsi dalam Project | Alasan Pemilihan |
|----------|---------------------|-----------------|
| **MariaDB** | Database utama | Relational database yang stabil untuk menyimpan tutorial dan relasinya |
| **Prisma Schema** | Definisi model data | Satu schema untuk mendefinisikan semua model, relations, dan enums |

---

## Arsitektur & Alur Kerja Sistem

### Arsitektur Sistem

Sistem ini menggunakan pola **REST API + Frontend** di mana Next.js menangani keduanya:

```
┌─────────────────────────────────────────────────────────┐
│                      BROWSER (Client)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   Login     │  │  Dashboard  │  │  Presentation   │ │
│  │   Page      │  │   Page      │  │     Page        │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP Request/Response
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   NEXT.JS SERVER                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              API Routes (Backend)                │   │
│  │  /api/tutorial        → CRUD tutorial            │   │
│  │  /api/detail-tutorial → CRUD detail             │   │
│  │  /api/presentation/*  → Get by slug             │   │
│  │  /api/finished/*      → Get by slug             │   │
│  └────────────────────────┬────────────────────────┘   │
│                           │                              │
│  ┌────────────────────────▼────────────────────────┐   │
│  │            Service Layer (tutorial-service.ts)    │   │
│  │         Auth Service (auth-service.ts)           │   │
│  └────────────────────────┬────────────────────────┘   │
│                           │                              │
│  ┌────────────────────────▼────────────────────────┐   │
│  │                  PRISMA ORM                      │   │
│  │            Database Operations                   │   │
│  └────────────────────────┬────────────────────────┘   │
└───────────────────────────┼─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                       MARIADB                           │
│  ┌──────────────┐        ┌──────────────────┐         │
│  │   tutorial   │ 1──N   │ detail_tutorial  │         │
│  └──────────────┘        └──────────────────┘         │
└─────────────────────────────────────────────────────────┘
```

### Alur Kerja Utama

#### 1. Alur Login
```
User mengisi form login
        │
        ▼
AuthService.login() → POST /api/auth/login
        │
        ▼
Token (refreshToken) disimpan di localStorage
        │
        ▼
Redirect ke /dashboard
```

#### 2. Alur Membuat Tutorial
```
User klik "Add Tutorial" di Dashboard
        │
        ▼
TutorialModal terbuka, user isi form
        │
        ▼
tutorialService.addTutorial() → POST /api/tutorial
        │
        ├── Generate slug otomatis dari judul + random number
        ├── Generate url_presentation dan url_finished unik
        │
        ▼
Tutorial tersimpan di database
        │
        ▼
Modal tertutup, Dashboard refresh otomatis
```

#### 3. Alur Presentasi Tutorial
```
User buka URL /presentation/[slug]
        │
        ▼
fetchTutorial() dengan polling setiap 5 detik
        │
        ▼
TutorialPresentation render semua detail dengan status="show"
        │
        ▼
Dosen bisa toggle visibility tiap blok secara real-time
```

### Model Data

```
┌─────────────────────────────────────────────────────────────┐
│                         tutorial                             │
├─────────────────────────────────────────────────────────────┤
│ id              │ int (PK, auto-increment)                │
│ judul           │ string                                   │
│ foto            │ string (URL)                             │
│ kode_matkul     │ string (kode mata kuliah)                │
│ matkul          │ string (nama mata kuliah)                │
│ creator_email   │ string                                   │
│ url_presentation│ string (unique slug untuk presentasi)   │
│ url_finished    │ string (unique slug untuk selesai)      │
│ created_at      │ datetime                                 │
│ updated_at      │ datetime                                 │
└───────────────────────────┬─────────────────────────────────┘
                            │ 1:N
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      detail_tutorial                         │
├─────────────────────────────────────────────────────────────┤
│ id              │ int (PK, auto-increment)                │
│ tipe            │ enum (text, gambar, code, url)            │
│ order           │ int (untuk urutan tampil)                │
│ status          │ enum (show, hide)                        │
│ isi             │ string (konten blok)                     │
│ tutorial_id     │ int (FK ke tutorial.id)                 │
│ created_at      │ datetime                                 │
│ updated_at      │ datetime                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Struktur Folder

```
no-pedia/
├── app/                          # App Router — semua halaman dan API routes
│   ├── api/                      # API Routes (Backend handlers)
│   │   ├── tutorial/             # CRUD untuk tutorial
│   │   │   ├── route.ts          # GET all, POST create
│   │   │   └── [id]/route.ts     # GET, PUT, DELETE by ID
│   │   ├── detail-tutorial/      # CRUD untuk detail tutorial
│   │   │   ├── route.ts          # POST create
│   │   │   └── [id]/route.ts     # PUT, DELETE by ID
│   │   ├── presentation/         # Lookup tutorial by url_presentation
│   │   │   └── [id]/route.ts     # GET by slug
│   │   ├── finished/              # Lookup tutorial by url_finished
│   │   │   └── [id]/route.ts      # GET by slug
│   │   └── public/
│   │       └── tutorial/
│   │           └── [kode]/       # GET tutorial by kode_matkul
│   │
│   ├── dashboard/                # Halaman dashboard utama
│   │   └── page.tsx
│   │
│   ├── detail-tutorial/
│   │   └── [id]/page.tsx        # Manajemen detail tutorial (edit, delete, reorder)
│   │
│   ├── presentation/
│   │   └── [id]/page.tsx         # Halaman presentasi tutorial
│   │
│   ├── finished/
│   │   └── [id]/page.tsx         # Halaman tutorial selesai (show all)
│   │
│   ├── login/
│   │   └── page.tsx              # Halaman login
│   │
│   ├── layout.tsx                # Root layout dengan providers
│   └── page.tsx                  # Redirect ke /login
│
├── components/                   # Komponen React yang bisa dipakai ulang
│   ├── ui/                       # Komponen shadcn/ui (button, dialog, dll)
│   ├── app-sidebar.tsx           # Sidebar utama aplikasi
│   ├── nav-user.tsx              # User dropdown dengan logout
│   ├── card-tutorial.tsx         # Card untuk menampilkan tutorial di dashboard
│   ├── modal-tutorial.tsx        # Modal untuk add/edit tutorial
│   ├── modal-delete-tutorial.tsx  # Modal konfirmasi hapus tutorial
│   ├── modal-add-detail.tsx       # Modal untuk menambah detail tutorial
│   ├── detail-row.tsx            # Row component untuk setiap detail
│   ├── tutorial-presentation.tsx # Komponen utama render tutorial
│   └── toaster.tsx               # Provider untuk toast notifications
│
├── service/                      # Service layer — logika bisnis terpisah dari UI
│   ├── tutorial-service.ts       # Semua operasi terkait tutorial via API
│   └── auth-service.ts           # Login, logout, getMatkul
│
├── hooks/                        # Custom React hooks
│   └── use-mobile.ts             # Deteksi apakah user di mobile
│
├── tipe/                         # TypeScript type definitions
│   └── tutorial-tipe.ts           # Interface Tutorial, DetailTutorial, Tipe, Status
│
├── lib/                          # Library dan utility
│   ├── prisma.ts                # Prisma client initialization dengan MariaDB adapter
│   └── utils.ts                 # Fungsi utility (cn untuk className)
│
├── prisma/                      # Prisma ORM
│   └── schema.prisma            # Schema database — model dan relations
│
└── README.md                    # Dokumentasi project
```

---

## API Reference

### Endpoint Utama

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/tutorial` | Mengambil semua tutorial |
| POST | `/api/tutorial` | Membuat tutorial baru |
| GET | `/api/tutorial/[id]` | Mengambil satu tutorial by ID |
| PUT | `/api/tutorial/[id]` | Update tutorial by ID |
| DELETE | `/api/tutorial/[id]` | Hapus tutorial by ID |
| POST | `/api/detail-tutorial` | Menambah detail ke tutorial |
| PUT | `/api/detail-tutorial/[id]` | Update detail by ID |
| DELETE | `/api/detail-tutorial/[id]` | Hapus detail by ID |
| GET | `/api/presentation/[slug]` | Lookup tutorial by url_presentation |
| GET | `/api/finished/[slug]` | Lookup tutorial by url_finished |
| GET | `/api/public/tutorial/[kode]` | Lookup tutorial by kode_matkul |

---

## Cara Menjalankan

### Prasyarat
- Node.js 20+
- MariaDB database
- npm/yarn/pnpm/bun

### Setup

1. **Clone repository dan install dependencies**
```bash
npm install
```

2. **Setup environment variables**
```bash
# Buat file .env di root project
DATABASE_URL="mysql://user:password@localhost:3306/no_pedia"
DATABASE_HOST="localhost"
DATABASE_USER="your_db_user"
DATABASE_PASSWORD="your_db_password"
DATABASE_NAME="no_pedia"
NEXT_PUBLIC_AUTH_API_URL="https://auth-api.example.com"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

3. **Generate Prisma Client**
```bash
npx prisma generate
```

4. **Run database migration**
```bash
npx prisma migrate dev
```

5. **Jalankan development server**
```bash
npm run dev
```

6. **Buka di browser**
```
http://localhost:3000
```

---

## Catatan Pengembangan

- **Next.js 16 Breaking Changes**: Next.js 16 memiliki perubahan API dari versi sebelumnya. Pastikan untuk membaca dokumentasi resmi sebelum memodifikasi fitur inti.

- **Prisma Custom Output**: Prisma client di-generate ke folder `generated/prisma/` (bukan `node_modules`) untuk kemudahan imports.

- **Auto-generated Slugs**: URL slug untuk presentation dan finished di-generate otomatis dengan random number untuk menghindari duplikasi judul.

- **External Auth**: Autentikasi ditangani oleh API eksternal. Token Bearer dikirim di header untuk setiap request yang membutuhkan otorisasi.

---

*Made with Next.js, Prisma, and MariaDB*
