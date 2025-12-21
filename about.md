# ResCat App - Aplikasi Deteksi Penyakit Kucing

## Overview
**ResCat** adalah aplikasi web berbasis Laravel + Inertia.js yang dirancang untuk mendeteksi penyakit kulit pada kucing melalui analisis gambar menggunakan teknologi **Computer Vision** dan **Machine Learning**.

## Fitur Utama

### 1. **Scan & Deteksi Penyakit**
- User mengambil/upload foto kucing
- Sistem melakukan cropping dan preprocessing gambar
- Integrasi dengan Flask API untuk analisis menggunakan ML model
- Deteksi area spesifik: mata kiri/kanan, mulut, telinga kiri/kanan
- Background removal untuk hasil yang lebih akurat
- Menyimpan riwayat scan dengan status (pending, completed, failed)

### 2. **Manajemen Profil Kucing**
- Registrasi data kucing (nama, breed, gender, tanggal lahir, avatar)
- Tracking riwayat pemeriksaan per kucing
- Mendukung multiple cats per user

### 3. **Pet Care Finder**
- Database lokasi klinik/pet care terdekat
- Informasi lengkap: alamat, telepon, jam buka
- Koordinat GPS untuk navigasi

### 4. **Artikel Edukatif**
- Artikel tentang kesehatan kucing
- Manajemen konten dengan soft delete

### 5. **Admin Panel (Filament)**
- Dashboard monitoring
- CRUD management untuk semua entitas
- Manajemen user dan permissions

## Tech Stack
- **Backend**: Laravel 11 (PHP)
- **Frontend**: Inertia.js + React/Vue
- **AI/ML**: Flask API untuk image recognition
- **Database**: MySQL/PostgreSQL
- **Auth**: Laravel Fortify + Google OAuth
- **Admin**: Filament
- **Image Processing**: Remove.bg API integration

## Flow Aplikasi
1. User login/register (termasuk via Google)
2. Tambahkan profil kucing
3. Scan foto kucing → Crop → Analisis via ML
4. Sistem detect area bermasalah & memberikan diagnosis
5. Hasil disimpan dengan landmark image & detail per area
6. User bisa cek riwayat scan & rekomendasi pet care

## Use Case
Aplikasi ini cocok untuk:
- Pet owner yang ingin monitoring kesehatan kucing secara mandiri
- Deteksi dini penyakit kulit sebelum ke dokter hewan
- Edukasi perawatan kucing melalui artikel
- Mencari pet care/klinik terdekat saat dibutuhkan
