# 🫁 ChestXR — AI-Powered Chest X-Ray Classification

<div align="center">

**Deep learning-powered chest X-ray analysis for rapid, accurate diagnostic support.**

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)

</div>

---

## ✨ Features

- 🔬 **Multi-Class Classification** — Normal, COVID, Lung Opacity, Bacterial & Viral Pneumonia
- ⚡ **Instant Results** — 87.2% Accuracy on our latest 25k+ dataset
- 📊 **Enhanced Model** — Uses Scikit-Learn's HistGradientBoosting for 5 diagnostic classes
- 🎨 **Modern UI** — Beautiful, responsive interface with dark/light mode
- 📊 **Dashboard** — Track analysis history with performance metrics
- 🐳 **Docker Ready** — One-command deployment with Docker Compose
- 🔒 **Secure** — File validation, size limits, and rate limiting
- 📱 **Responsive** — Works on desktop, tablet, and mobile

---

## 🏗️ Architecture

```
chestxray/
├── frontend/              # React + Vite + Tailwind CSS 4
│   ├── src/
│   │   ├── components/    # Navbar, Footer, UploadZone, ResultCard
│   │   ├── pages/         # LandingPage, PredictPage, DashboardPage
│   │   ├── context/       # ThemeContext (dark/light mode)
│   │   ├── utils/         # API client (Axios)
│   │   └── App.jsx        # Root with routing
│   ├── Dockerfile
│   └── package.json
├── backend/               # FastAPI REST API
│   ├── app/
│   │   ├── main.py        # App entry, CORS, rate limiting
│   │   ├── api/routes.py  # /predict, /health, /history endpoints
│   │   ├── services/      # ML predictor service
│   │   └── utils/         # Image preprocessing
│   ├── Dockerfile
│   └── requirements.txt
├── model/                 # Place your trained model here
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** with pip
- **Node.js 18+** with npm
- (Optional) **Docker** for containerized deployment

### 1. Clone & Setup

```bash
cd chestxray
```

### 2. Backend Setup

```bash
# Create virtual environment
cd backend
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Add Your Model

Place your trained model file in the `model/` directory:

| Framework    | File Extension | Example             |
| ------------ | -------------- | ------------------- |
| Scikit-Learn | `.pkl`         | `chestxr_sklearn.pkl`|
| TensorFlow   | `.h5`          | `model.h5`          |
| PyTorch      | `.pt` / `.pth` | `model.pt`          |

> **Note:** If no model is found, the app runs in **Demo Mode** with realistic random predictions — perfect for frontend development.

### 4. Start Backend

```bash
cd backend
python -m app.main
```

The API will be available at `http://localhost:8000`.

- Swagger docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 5. Frontend Setup

```bash
cd frontend
npm install    # Already done if you cloned
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

If you want to train a brand new classification model, or you want to add your own X-ray images, follow these steps:

### 1. Structure Your Custom Images
By default, the training script uses the `data/arranged_train` directory. Just drop your `.jpg` or `.png` X-ray images into the folders that match their condition:
```
chestxray/data/arranged_train/
├── Normal/                  # Drop healthy lung X-rays here
├── COVID/                   # COVID-19 specific X-rays
├── Lung_Opacity/            # Non-infectious opacity
├── Bacterial_Pneumonia/     # Bacterial infections
└── Viral_Pneumonia/         # Viral infections
```
*Note: If a new folder is detected, it automatically becomes a medical classification class in the AI.*

### 2. Run the Training Pipeline
Once your images are in place (or if you just want to download the base Kaggle dataset automatically), simply run:
```bash
cd backend
# Ensure you have the virtual environment activated
.\venv\Scripts\python.exe train_custom_model.py
```
The script will automatically:
1. (Optional) Download base Kaggle datasets if needed.
2. Search all subfolders recursively for images.
3. Train a **HistGradientBoostingClassifier** (87.2% accuracy).
4. Auto-save `backend/model/chestxr_sklearn.pkl` and `backend/model/classes.json`.

### 3. Restart the API
Stop and restart your FastAPI backend (`python -m app.main`). The backend will automatically detect the new `classes.json`, load your freshly trained model, and serve live predictions in the UI!

---

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Access the app
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
```

---

## ☁️ Cloud Deployment (Free Hosting)

This project is pre-configured for a dual-tier deployment: **Vercel** for the frontend and **Render** for the heavy machine learning backend.

### 1. Backend (Render)
1. **GitHub:** Push your code to a GitHub repository.
2. **Setup:** Create a new **Web Service** on Render connected to your repo.
3. **Settings:**
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables:**
   - `PYTHON_VERSION`: `3.10.11`
   - `ALLOWED_ORIGINS`: `https://your-vercel-app.vercel.app` (Add after Step 2)

### 2. Frontend (Vercel)
1. **GitHub:** Connect the same repo to Vercel.
2. **Settings:**
   - **Root Directory:** Leave as the root (`/`). Vercel will auto-detect the `package.json` and run the build script.
3. **Environment Variables:**
   - `VITE_API_URL`: `https://your-render-app.onrender.com` (Your Render URL)

---

## 📡 API Reference

### `POST /api/predict`

Upload a chest X-ray image for classification.

**Request:**
```bash
curl -X POST http://localhost:8000/api/predict \
  -F "file=@chest_xray.jpg"
```

**Response:**
```json
{
  "prediction": "Pneumonia",
  "confidence": 0.9234,
  "all_predictions": {
    "Normal": 0.0412,
    "Pneumonia": 0.9234,
    "COVID-19": 0.0189,
    "Tuberculosis": 0.0098,
    "Lung Opacity": 0.0067
  },
  "model_loaded": true,
  "note": "",
  "timestamp": "2024-01-15T10:30:00",
  "inference_time_ms": 245.3
}
```

### `GET /api/health`

Health check endpoint.

### `GET /api/model-info`

Returns loaded model metadata.

### `GET /api/history`

Returns prediction history.

### `DELETE /api/history`

Clears prediction history.

---

## 🧪 Testing the API

```bash
# Health check
curl http://localhost:8000/api/health

# Predict (replace with your image path)
curl -X POST http://localhost:8000/api/predict \
  -F "file=@path/to/chest_xray.jpg"

# Get history
curl http://localhost:8000/api/history
```

---

## 🎨 UI Features

- **Landing Page** — Hero with animated gradients and floating orbs
- **Upload** — Drag & drop with scan-line animation and validation
- **Results** — Color-coded predictions with animated confidence bars
- **Dashboard** — Stats cards and sortable history table
- **Theme** — Automatic dark/light mode with system preference detection
- **Animations** — Smooth page transitions and micro-interactions via Framer Motion

---

## 🛡️ Security

- ✅ File type validation (`JPEG`, `PNG`, `WebP` only)
- ✅ File size limit (10 MB max)
- ✅ Image integrity verification
- ✅ Rate limiting via SlowAPI
- ✅ CORS configuration
- ✅ Global error handling (no stack trace leaks)

---

## 📝 Environment Variables

| Variable          | Default                              | Description                     |
| ----------------- | ------------------------------------ | ------------------------------- |
| `HOST`            | `0.0.0.0`                            | Server host                     |
| `PORT`            | `8000`                               | Server port                     |
| `DEBUG`           | `true`                               | Enable hot-reload               |
| `ALLOWED_ORIGINS` | `http://localhost:5173,...`           | CORS allowed origins            |
| `MODEL_DIR`       | `model`                              | Path to model directory         |
| `VITE_API_URL`    | (empty)                              | API URL for production frontend |

---

## ⚠️ Disclaimer

This tool is for **research and educational purposes only**. It is **not** a substitute for professional medical diagnosis. Always consult a qualified healthcare provider for medical decisions.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
