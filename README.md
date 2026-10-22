<div align="center">

# 🟨 NEOBRUTALIS-Pterodactyl

**Tema Neo-Brutalism untuk Pterodactyl Panel**
Border tebal. Shadow keras. Tanpa gradasi. Plus email OTP dan notifikasi server via Resend.

![Pterodactyl](https://img.shields.io/badge/Pterodactyl-1.15.x-000000?style=for-the-badge)
![Blueprint](https://img.shields.io/badge/Blueprint-framework-000000?style=for-the-badge)
![React](https://img.shields.io/badge/React-TypeScript-000000?style=for-the-badge)
![Resend](https://img.shields.io/badge/Email-Resend-000000?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-000000?style=for-the-badge)

[Fitur](#-fitur) · [Instalasi](#-instalasi) · [Konfigurasi Email](#-konfigurasi-email-resend) · [Troubleshooting](#-troubleshooting) · [Development](#-development)

</div>

---

## 📸 Showcase

| Dashboard (Light) | Dashboard (Dark) |
| --- | --- |
| ![Dashboard light](docs/screenshots/dashboard-light.png) | ![Dashboard dark](docs/screenshots/dashboard-dark.png) |

| Console (Light) | Console (Dark) |
| --- | --- |
| ![Console light](docs/screenshots/console-light.png) | ![Console dark](docs/screenshots/console-dark.png) |

<details>
<summary><b>Pengaturan tema</b></summary>

![Theme settings](docs/screenshots/theme-settings.png)

</details>

---

## ✨ Fitur

### 🎨 Tampilan

- Gaya Neo-Brutalism: border tebal, shadow tegas, tipografi bold, tanpa gradasi.
- Dashboard server dengan kartu status dan bar penggunaan CPU, RAM, serta Disk.
- Restyle halaman panel utama dan Admin Panel.
- Dark Mode toggle.
- Halaman **EGG Changer**.
- IP dan port server disamarkan secara default, klik untuk menampilkannya.

### 📧 Email (via Resend)

| Fitur | Pemicu | Butuh OTP? |
| --- | --- | --- |
| **Verifikasi registrasi** | Pengguna membuat akun baru | Ya |
| **Notifikasi instalasi** | Instalasi server **berhasil** | Tidak |
| **Notifikasi reinstall** | Reinstall server **berhasil** | Tidak |

Email dikirim dari `no-reply@elstycloud.my.id`. Notifikasi dipicu oleh status keberhasilan yang sebenarnya, bukan saat proses baru dimulai.

---

## 📋 Persyaratan

| Kebutuhan | Keterangan |
| --- | --- |
| Pterodactyl Panel | Lihat badge versi di atas |
| [Blueprint](https://blueprint.zip/) | Framework yang dipakai tema ini |
| Node.js + Yarn | Untuk build asset ([panduan resmi](https://pterodactyl.io/community/customization/panel.html)) |
| Akun [Resend](https://resend.com/) | Hanya jika memakai fitur email |
| Queue worker aktif | Jika email dikirim lewat antrean |

---

## 🚀 Instalasi

> ⚠️ **Backup dulu** sebelum memasang tema: database dan folder panel.
>
> ```bash
> cd /var/www
> tar -czf pterodactyl-backup-$(date +%F).tar.gz pterodactyl
> mysqldump -u root -p panel > panel-backup-$(date +%F).sql
> ```

**1. Salin file tema ke direktori panel**

```bash
cd /var/www/pterodactyl
# salin isi repository ini ke direktori panel
```

**2. Build asset**

```bash
yarn install
yarn build:production
php artisan optimize:clear
```

**3. (Opsional) Aktifkan email**, lanjut ke bagian berikutnya.

Detail build lengkap ada di [`BUILDING.md`](BUILDING.md).

---

## 📬 Konfigurasi Email (Resend)

### 1. Siapkan domain di Resend

1. Tambahkan domain `elstycloud.my.id` di dashboard Resend.
2. Pasang record DNS yang diminta Resend.
3. Tunggu sampai domain berstatus **Verified**.

### 2. Isi `.env`

```env
MAIL_MAILER=resend
MAIL_FROM_ADDRESS=no-reply@elstycloud.my.id
MAIL_FROM_NAME="ElstyCloud"

RESEND_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx

MAIL_EHLO_DOMAIN=elstycloud.my.id
```

> 🔒 Ganti `RESEND_KEY` dengan API key milikmu sendiri. **Jangan pernah commit API key asli** ke repository, terutama yang publik. Pastikan `.env` ada di `.gitignore`.

### 3. Terapkan konfigurasi

```bash
cd /var/www/pterodactyl
php artisan optimize:clear
php artisan queue:restart
```

Pastikan versi Pterodactyl dan integrasi mailer yang kamu pakai mendukung `MAIL_MAILER=resend` dan `RESEND_KEY`.

### 4. Tes pengiriman

```bash
php artisan tinker
>>> Mail::raw('Tes Resend', fn($m) => $m->to('emailkamu@contoh.com')->subject('Tes'));
```

---

## 🔄 Alur Email

```text
Registrasi   →  kirim OTP  →  pengguna verifikasi  →  akun aktif
Instal       →  proses install selesai & sukses  →  kirim notifikasi
Reinstall    →  proses reinstall selesai & sukses  →  kirim notifikasi
```

- OTP hanya dipakai untuk registrasi.
- Notifikasi instal/reinstall tidak butuh OTP.
- Gagal atau dibatalkan berarti **tidak ada** email notifikasi sukses.

### Catatan keamanan OTP

Implementasi registrasi OTP sebaiknya memiliki:

- masa berlaku kode yang singkat,
- batas jumlah percobaan,
- rate limiting per akun dan per IP,
- kode sekali pakai yang dibatalkan setelah dipakai.

---

## 🧩 Struktur Proyek

| Path | Isi |
| --- | --- |
| `resources/scripts/components/` | Komponen React yang di-restyle |
| `resources/views/` | Template Blade panel dan admin |
| `public/assets/` | Asset hasil build |
| `app/`, `routes/`, `config/`, `database/` | Backend Laravel |
| `.blueprint/` | Konfigurasi Blueprint |
| `docs/screenshots/` | Gambar untuk README |

---

## 🛠 Development

```bash
yarn watch     # build mode development
yarn lint      # ESLint pada resources/scripts
```

---

## 🩹 Troubleshooting

<details>
<summary><b>Build gagal: <code>error:0308010C:digital envelope routines::unsupported</code></b></summary>

Terjadi pada Node.js 17+ karena perubahan OpenSSL. Coba:

```bash
NODE_OPTIONS=--openssl-legacy-provider yarn build:production
```

</details>

<details>
<summary><b>Tampilan tidak berubah setelah build</b></summary>

```bash
php artisan optimize:clear
```

Lalu hard refresh browser (`Ctrl + Shift + R`) atau bersihkan cache CDN jika ada.

</details>

<details>
<summary><b>Email tidak terkirim</b></summary>

- Cek domain di Resend sudah **Verified**.
- Cek `RESEND_KEY` dan `MAIL_FROM_ADDRESS` di `.env`.
- Jalankan `php artisan queue:restart` dan pastikan worker aktif.
- Lihat `storage/logs/laravel-*.log` untuk pesan error.

</details>

<details>
<summary><b>Cara kembali ke tampilan bawaan</b></summary>

Pulihkan dari backup yang dibuat sebelum instalasi, lalu build ulang:

```bash
yarn build:production
php artisan optimize:clear
```

</details>

---

## 📝 Catatan Implementasi

Konfigurasi Resend hanya menyiapkan **pengiriman** email. Registrasi OTP serta notifikasi instalasi dan reinstall tetap bergantung pada implementasi backend dan integrasi event di panel. README ini tidak mengaktifkan fitur tersebut dengan sendirinya.

---

## 📚 Dokumen Lain

- [`BUILDING.md`](BUILDING.md): panduan build
- [`CHANGELOG.md`](CHANGELOG.md): riwayat perubahan
- [`SECURITY.md`](SECURITY.md): kebijakan keamanan dan pelaporan celah
- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md): tata tertib komunitas

## 🤝 Kontribusi

Issue dan pull request dipersilakan. Sebelum mengirim PR, jalankan `yarn lint` dan pastikan `yarn build:production` berhasil.

## 📄 Lisensi

[MIT](LICENSE.md) © [Firllyfikaa](https://github.com/firllyfikaa)
