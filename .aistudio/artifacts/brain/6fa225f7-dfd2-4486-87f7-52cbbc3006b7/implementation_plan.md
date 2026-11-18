# Aerostreet Maximo — Streetwear Sneaker Landing Page

Transformasi menyeluruh landing page e-commerce dari produk botol menjadi etalase interaktif sepatu **Aerostreet Maximo** berbahasa Indonesia dengan harga Rupiah (IDR), palet monokrom streetwear, perbandingan langsung varian **All Black** vs **Black White**, serta konfigurator ukuran **EU 38–44**.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Seluruh keputusan inti di bawah ini telah dikonfirmasi melalui wawancara produk dan akan menjadi acuan utama implementasi.

- **Bahasa & Mata Uang (Terkonfirmasi)**: Seluruh copy antarmuka, spesifikasi teknis, label tombol, dan keranjang belanja menggunakan **Bahasa Indonesia** dengan harga resmi **Rp 179.900** (format IDR).
- **Konsep Layout & Palet (Terkonfirmasi)**: Mempertahankan struktur 5-section interaktif (Split Hero 3D Tilt, Pinned Showcase, Interactive Comparison Slider, Asymmetric Bento Specs, Configurator + Slide-Over Bag Drawer) dengan transformasi visual menuju **palet monokrom streetwear** (mode terang abu-abu kapur dan obsidian, mode gelap grafit pekat dan putih tulang).
- **Fokus Comparison Slider (Terkonfirmasi)**: Menampilkan perbandingan pixel-aligned secara langsung antara varian **All Black** dan **Black White** lengkap dengan kontrol segmen dan metrik teknis sepatu.
- **Rentang Ukuran Sepatu (Terkonfirmasi)**: Menyediakan pilihan ukuran standar dewasa **EU 38 hingga EU 44** beserta keterangan panjang insole (24,6 cm – 28,7 cm) pada konfigurator dan ringkasan keranjang.
- **Penggunaan Aset Foto Produk**: Mengintegrasikan langsung kedua foto produk **Aerostreet Maximo** yang diunggah pengguna tanpa image generation eksternal, memanfaatkan *blending* studio dan *focal crop* terarah untuk sorotan material pada Showcase dan Bento Grid.

---

## 1. Overview & Core Concept

- **What It Does**: Menghadirkan pengalaman eksplorasi produk digital kelas flagship untuk sneakers lokal **Aerostreet Maximo**, memadukan visual studio 3D tilt, transisi scroll terpin, penggeser komparasi varian warna, visualisasi spesifikasi kanvas interaktif, hingga pemilihan ukuran dan checkout simulasi dalam satu alur yang mulus.
- **Target Audience / Persona**: Penggemar sneakers lokal, pelajar, mahasiswa, hingga pekerja urban berusia 17–35 tahun yang mencari sepatu kasual-sporty tangguh untuk aktivitas harian dengan estetika monokrom yang bersih.
- **Key Value**: Menyampaikan keunggulan konstruksi **Shoes Injection Mould** (sol menyatu tanpa lem, tahan hujan dan cuci) serta detail material **Mesh, Kanvas, dan Kulit Sintetis** secara taktil dan interaktif sebelum pembeli memilih varian warna dan ukuran EU yang tepat.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Hero & Pemilihan Varian Instan**: Pengunjung disambut judul editorial besar, deskripsi singkat Aerostreet Maximo, serta siluet sepatu yang merespons gerakan kursor dengan kemiringan 3D di atas latar shader kontur monokrom. Pengunjung dapat langsung mengganti varian **All Black** dan **Black White** melalui kontrol swatch.
2. **Pinned 4-Stage Showcase**: Saat menggulir ke bawah, layar terkunci menampilkan 4 sudut pandang dan sorotan detail Maximo (Siluet All Black, Siluet Black White, Detail Midsole Injection Mould, dan Detail Upper Breathable Mesh) dengan transisi wipe horizontal dan indikator dot interaktif.
3. **Comparison Slider (All Black vs Black White)**: Pengunjung menggeser tuas pembanding (pointer drag, keyboard arrow, atau tombol tab cepat) untuk membandingkan siluet **All Black** dan **Black White** pada posisi presisi yang sama, disertai angka spesifikasi inti (`0% Lem` dan `340 g`).
4. **Asymmetric 3-Tile Bento Specs**: Grid asimetris tiga ubin yang menyoroti konstruksi tanpa lem, kombinasi tekstur mesh-sintetis, serta kanvas animasi wireframe 3D telapak/kontur sepatu yang bereaksi saat di-hover.
5. **Konfigurator & Keranjang Belanja (Slide-Over Drawer)**: Pengunjung memilih warna (**All Black** / **Black White**), ukuran (**EU 38–44** dengan info panjang insole cm), meninjau ringkasan spesifikasi, lalu menekan **Tambah ke Tas**. Panel keranjang geser menampilkan daftar item, pengatur jumlah (`+` / `-`), total harga IDR, dan tombol konfirmasi pesanan.

### Visual Identity & Theme

- **Aesthetic Direction**: *Monochrome Streetwear Editorial* — tegas, arsitektural, bebas ornamen berlebihan, membiarkan siluet dan tekstur sepatu menjadi pusat perhatian.
- **Color Palette & Mood**:
  - *Mode Terang (Default)*: Latar kapur dingin (`#f4f4f5`), permukaan abu-abu studio (`#e8e9ec` / `#dcdfe3`), teks utama obsidian (`#111214`), teks sekunder abu-abu slate (`#52565e`), aksen CTA hitam arang (`#18181b`) dengan teks kontras putih kapur (`#f4f4f5`).
  - *Mode Gelap*: Latar grafit pekat (`#0c0d0f`), permukaan charcoal (`#141619` / `#1c1f24`), teks utama putih tulang (`#f1f2f4`), teks sekunder abu-abu mineral (`#969ba3`), aksen CTA putih tulang (`#f1f2f4`) dengan teks obsidian (`#111214`).
- **Typography & Hierarchy**: Menggunakan pasangan **DM Sans** (400, 500, 700) untuk headline tegas dan keterbacaan bersih, dipadukan **DM Mono** (`tabular-nums`) khusus untuk harga Rupiah, ukuran EU, panjang insole cm, dan angka metrik teknis.
- **Component Styling & Layout**: Mematuhi aturan radius konsisten (`12px` pada kartu/kontainer media, `999px` pada tombol dan kontrol interaktif), pembagian 3 zona top bar satu baris (`Aerostreet` — navigasi ringkas — toggle tema & tas belanja), serta pemisahan konten melalui whitespace dan garis hairline tipis tanpa kartu bertumpuk.

### Interactive Feedback & Motion

- **Shader & Wireframe Latar**: Shader WebGL2 di Hero diperbarui menjadi kontur topografi jalanan monokrom yang bereaksi terhadap pergerakan kursor; kanvas Bento Specs menampilkan wireframe kontur sol dan siluet sepatu berputar yang berakselerasi saat pointer melintas.
- **Micro-Interactions**: Tombol memiliki respons tekan taktil (`scale(0.97)` dalam $\le 160\text{ms}$), drawer keranjang menggunakan kurva pegas halus, serta seluruh animasi menghormati preferensi `prefers-reduced-motion`.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Pemetaan Dua Foto Produk Studio untuk Seluruh Seksi**
  - *Chosen Approach*: Menggunakan dua aset foto **Aerostreet Maximo** (`All Black` dan `Black White`) secara penuh pada Hero, Comparison Slider, dan Konfigurator, serta menerapkan *studio crop* dan *framing* terkendali pada Showcase dan Bento Grid untuk menonjolkan detail konstruksi midsole emboss dan jaring mesh.
  - *Why*: Menjaga keaslian visual produk yang diunggah pengguna tanpa halusinasi bentuk sepatu dari gambar generasi AI, sekaligus memastikan alignment pixel-sempurna pada Comparison Slider.
  - *Alternatives Considered*: Menghasilkan gambar lifestyle baru dengan AI, namun dilewati sesuai batasan agar bentuk sepatu asli Aerostreet Maximo tidak berubah.

- **Decision 2: Penanganan Latar Belakang Putih Foto Produk di Mode Terang & Gelap**
  - *Chosen Approach*: Pada mode terang, gambar sepatu studio dipadukan dengan `mix-blend-mode: multiply` di atas kanvas terang agar menyatu mulus; pada mode gelap, panggung Hero dan preview Konfigurator menggunakan permukaan studio netral terang terintegrasi (*studio pedestal frame*) dengan vignette halus sehingga kontur sepatu hitam maupun putih tetap tajam dan kontrasnya terjaga.
  - *Why*: Foto produk asli memiliki latar putih penuh; pendekatan ini mencegah kotak putih kasar di mode gelap sekaligus mempertahankan detail bayangan asli sepatu All Black.
  - *Alternatives Considered*: Menggunakan filter inversi CSS pada mode gelap, namun berisiko merusak warna asli varian All Black dan Black White.

- **Decision 3: State Konfigurator & Keranjang Berbasis Client State dengan Data Teknis Akurat**
  - *Chosen Approach*: Menyimpan state varian warna, ukuran EU 38–44 (lengkap dengan tabel panjang kaki dalam cm), harga IDR (`Rp 179.900`), dan item keranjang secara reaktif di memori klien dengan validasi duplikasi item berdasarkan kombinasi `(varian, ukuran)`.
  - *Why*: Memberikan respons instan tanpa latensi jaringan untuk alur e-commerce showcase satu halaman yang fokus pada eksplorasi produk.
  - *Alternatives Considered*: Integrasi backend database, yang tidak diperlukan karena tidak ada autentikasi akun atau penyimpanan pesanan lintas sesi yang diminta.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```text
┌───────────────────────────────────────────────────────────────────────────┐
│                         Aerostreet Maximo Storefront                      │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Global State: theme (light/dark) · colorway · euSize · bagItems[]   │  │
│  │               activeStage · splitPct · drawerOpen · checkedOut      │  │
│  └───────────────┬───────────────────────────────────┬─────────────────┘  │
└──────────────────┼───────────────────────────────────┼────────────────────┘
                   │                                   │
     ┌─────────────▼─────────────┐       ┌─────────────▼──────────────┐
     │   Visual Motion Engine    │       │    Interactive Sections      │
     │  • Lenis Smooth Scroll    │       │  1. Header (3-Zone Nav)    │
     │  • GSAP ScrollTrigger Pin │       │  2. Split Hero + Swatches  │
     │  • 3D Pointer Tilt Ticker │       │  3. 4-Stage Pinned Wipe    │
     │  • WebGL2 Contour Shader  │       │  4. All Black vs Black/Wht │
     │  • 2D Sneaker Wireframe   │       │  5. 3-Tile Bento Specs     │
     └───────────────────────────┘       │  6. EU 38–44 Configurator  │
                                         │  7. Slide-Over Bag Drawer  │
                                         └────────────────────────────┘
```

### Data Model & State

- **ColorwayOption**:
  - `all-black`: Nama `"All Black"`, label pendek `"Hitam Pekat"`, kode swatch `#18181b`, sumber foto `/assets/aistudio/image_36b3b630.png`, deskripsi singkat material mesh & kulit sintetis serba hitam.
  - `black-white`: Nama `"Black White"`, label pendek `"Hitam Putih"`, kode swatch `#e4e4e7` (dengan ring kontras), sumber foto `/assets/aistudio/image_82e62bae.png`, deskripsi aksen tumit abu-abu & mudguard hitam.
- **ShoeSizeOption (EU 38 – EU 44)**:
  - Daftar terstruktur berisi label ukuran (`EU 38` s.d. `EU 44`), panjang insole (`24,6 cm`, `25,3 cm`, `26,0 cm`, `26,6 cm`, `27,3 cm`, `28,0 cm`, `28,7 cm`), dan harga seragam `179900` (IDR).
- **BagItem**:
  - `{ colorway: ColorwayId; size: ShoeSizeLabel; price: number; qty: number }` — item dengan warna dan ukuran sama otomatis digabungkan kuantitasnya saat ditambahkan ke tas.

### Interactive Component & State Mapping

- **Header & Theme Switch**: Toggle tema mengubah atribut `data-theme` pada root dokumen serta memperbarui palet shader WebGL2 dan kanvas wireframe secara real-time; tombol tas menampilkan jumlah total pasang sepatu di keranjang dan membuka drawer.
- **Hero Stage & Swatches**: Menggerakkan pointer di area hero mengkalkulasi rotasi 3D perspektif dengan redaman pegas; memilih swatch warna langsung menyinkronkan warna aktif pada Hero dan Konfigurator bawah.
- **Pinned Showcase & Dots**: ScrollTrigger mempin viewport dan menggeser `clip-path` keempat frame secara berurutan; klik pada tombol dot tab melompat langsung ke frame terkait dengan transisi teks halus.
- **Comparison Slider**: Mendukung `onPointerDown`/`Move`/`Up` dengan pointer capture serta kontrol keyboard `ArrowLeft`/`ArrowRight` pada handle `role="slider"`, ditambah tombol tab cepat `All Black` (100%) dan `Black White` (0%).
- **Configurator & Bag Drawer**: Memilih ukuran EU memperbarui tampilan panjang insole (cm) secara langsung; menekan `Tambah ke Tas` memperbarui `bagItems`, membuka slide-over drawer, menyediakan tombol `-`/`+` kuantitas, dan tombol `Pesan Sekarang` menampilkan status konfirmasi pesanan sebelum mereset tas.
