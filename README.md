# Photo Gallery App
Aplikasi ini merupakan Photo Gallery berbasis React Native yang menampilkan daftar gambar dari public API (Lorem Picsum). Aplikasi mendukung infinite scroll, fitur favorite gambar, serta menampilkan konfirmasi menggunakan Toast native Android melalui custom native module berbasis Kotlin.

## Fitur Utama
- Grid foto 2 kolom
- Infinite scroll (pagination)
- Pull-to-refresh
- Favorite / unfavorite gambar
- Konfirmasi menggunakan Android Toast (Native Module)
- Loading state dan error handling

## Tech yang Digunakan
- React Native (CLI)
- TypeScript
- Android Native Module (Kotlin)
- Lorem Picsum API

## Struktur Proyek
```src/
├─ screens/ // Screen utama aplikasi
├─ components/ // Reusable UI components
├─ services/ // API & data fetching
├─ hooks/ // Custom hooks (untuk memisahkan business logic agar lebih clean)
└─ native/ // JS wrapper untuk native module
```

## Penjelasan Implementasi

### Photo Grid & Pagination
- Menggunakan FlatList dengan layout 2 kolom
- Data dimuat per halaman (20 item)
- Pagination di-handle menggunakan onEndReached
- Guard diterapkan untuk mencegah duplicate request saat scroll

### Favorite Image
- Status favorite disimpan menggunakan Set untuk lookup yang efisien
- Tap pada gambar akan melakukan toggle favorite / unfavorite
- State favorite bersifat lokal

### Native Android Bridge (Kotlin)
Aplikasi menggunakan custom native module di Android untuk menampilkan Toast.

Flow:
1. React Native memanggil method `showToast(message)`
2. Method diekspos dari Kotlin melalui `ReactContextBaseJavaModule`
3. Android Toast ditampilkan menggunakan `android.widget.Toast`

Native module dipanggil setiap kali user melakukan favorite atau unfavorite gambar.

## Performa & Optimasi
Beberapa optimasi yang diterapkan:
- Konfigurasi FlatList (windowSize, maxToRenderPerBatch, initialNumToRender)
- Penggunaan useCallback untuk mencegah re-render tidak perlu
- Penggunaan Set untuk manajemen favorite
- Penggunaan useRef sebagai lock untuk mencegah overlap request async

## Error Handling & Loading State
- Loading spinner ditampilkan saat data sedang dimuat
- Error Handling menggunakan tombol retry jika gagal saat request API
- Empty state ditampilkan ketika data kosong

## Platform
Implementasi difokuskan pada Android, karena requirement native bridge bersifat Android-specific.  

## Cara Menjalankan Aplikasi
```bash
npm install
npx react-native run-android
```

## Screen Recording
Video singkat yang memperlihatkan:
- Tampilan grid foto 2 kolom
- Infinite scroll (pagination)
- Pull-to-refresh
- Favorite dan unfavorite gambar
- Konfirmasi menggunakan Android native Toast
- Loading state saat fetch data
- Error handling dan mekanisme retry ketika request gagal

[link screen recording](https://drive.google.com/file/d/1-0wcirvHulxiRxr-yNrE89eU2hFTd4Da/view?usp=sharing)
