# 🚦 Traffic Density Detection — Web Dashboard

Aplikasi web untuk memantau dan memprediksi kepadatan lalu lintas secara real-time menggunakan model **Random Forest** yang dilatih dari data rekaman kendaraan.

---

## 🗂️ Struktur Project

```
traffic_web/
├── backend/             # FastAPI (Python)
│   ├── main.py
│   ├── data_service.py
│   ├── traffic_model.pkl
│   ├── requirements.txt
│   └── collected_data/
├── frontend/            # React + Vite
│   ├── src/
│   └── package.json
└── .gitignore
```

---

## ⚙️ Prasyarat

Pastikan sudah terinstall:

| Tools | Versi Minimum |
|-------|--------------|
| Python | 3.10+ |
| Node.js | 18+ |
| npm | 9+ |
| Git | (opsional) |

---

## 🚀 Instalasi & Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/<username>/traffic_web.git
cd traffic_web
```

---

### 2. Setup Backend (Python / FastAPI)

```bash
# Masuk ke folder backend
cd backend

# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
# Windows:
.\venv\Scripts\Activate
# Mac/Linux:
source venv/bin/activate

# Install semua dependensi
pip install -r requirements.txt
```

#### ▶️ Jalankan Backend

```bash
uvicorn main:app --reload
```

Backend akan berjalan di: **http://127.0.0.1:8000**

> Pastikan file `traffic_model.pkl` ada di folder `backend/` sebelum menjalankan server.

---

### 3. Setup Frontend (React / Vite)

Buka terminal baru, lalu:

```bash
# Masuk ke folder frontend
cd frontend

# Install dependensi Node
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di: **http://localhost:5173**

---

## 🌐 Akses Aplikasi

Buka browser dan akses: **http://localhost:5173**

Pastikan **backend sudah berjalan** sebelum membuka frontend.

---

## 📡 Endpoint API

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/` | Health check API |
| POST | `/predict` | Prediksi kepadatan lalu lintas |
| GET | `/dashboard-stats` | Data statistik untuk dashboard |
| GET | `/analytics` | Data analitik lengkap |
| GET | `/history` | Riwayat prediksi |

### Contoh Request `/predict`

```json
POST http://127.0.0.1:8000/predict
Content-Type: application/json

{
  "day": 0,      // 0 = Senin, 6 = Minggu
  "hour": 8,     // Jam (0-23)
  "minute": 30   // Menit
}
```

---

## 🛠️ Troubleshooting

**`uvicorn` tidak ditemukan:**
```bash
# Pastikan venv sudah diaktifkan
.\venv\Scripts\Activate   # Windows
source venv/bin/activate  # Mac/Linux

# Lalu coba lagi
uvicorn main:app --reload
```

**Error CORS / fetch gagal di frontend:**
- Pastikan backend sudah berjalan di port `8000`
- Cek apakah ada proses lain yang memakai port tersebut

**Model tidak termuat:**
- Pastikan file `backend/traffic_model.pkl` ada
- Ukuran file sekitar ~90 MB (tidak di-push ke GitHub karena ukurannya besar)

---

## 📦 Teknologi yang Digunakan

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/) — REST API framework
- [scikit-learn](https://scikit-learn.org/) — Machine Learning (Random Forest)
- [pandas](https://pandas.pydata.org/) — Data processing
- [joblib](https://joblib.readthedocs.io/) — Model serialization

**Frontend:**
- [React 19](https://react.dev/) — UI framework
- [Vite](https://vitejs.dev/) — Build tool & dev server
- [TailwindCSS](https://tailwindcss.com/) — Styling
