# 🫁 ChestXR — AI-Powered Chest X-Ray Classification

## What is this project?
ChestXR is a deep learning-powered medical imaging assistant that automatically analyzes chest X-rays. By leveraging a **Scikit-Learn HistGradientBoosting** model trained on a dataset of over 25,000 images, it can instantly classify X-rays into five distinct diagnostic categories:
- **Normal**
- **COVID-19**
- **Lung Opacity**
- **Bacterial Pneumonia**
- **Viral Pneumonia**

The project provides a modern, interactive web interface for healthcare professionals to upload scans, view confidence scores, and track analysis history.

---

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS 4, Framer Motion, GSAP
- **Backend:** FastAPI (Python), Uvicorn, SlowAPI (Rate Limiting)
- **Machine Learning:** Scikit-Learn (HistGradientBoosting), NumPy, Pillow, Joblib
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## 🚀 How to Run

### 1. Backend Setup
1. Open a terminal in the `backend/` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows: .\venv\Scripts\activate
   # macOS/Linux: source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   python -m app.main
   ```
   *The API will be live at http://localhost:8000*

### 2. Frontend Setup
1. Open a terminal in the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The website will be live at http://localhost:5173*

---

## ☁️ Cloud Deployment
This project is pre-configured for a dual-tier deployment:
- **Frontend (Vercel):** Hosts the React UI. Set `VITE_API_URL` to your Render backend URL.
- **Backend (Render):** Hosts the Python ML API. Set `PYTHON_VERSION` to `3.10.11` and `ALLOWED_ORIGINS` to your Vercel URL.

---

## ⚠️ Disclaimer
This tool is for **research and educational purposes only**. It is **not** a substitute for professional medical diagnosis. Always consult a qualified healthcare provider for medical decisions.
