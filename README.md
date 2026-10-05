# AI Avatar Learning & Diagnostic Platform

An AI-powered adaptive learning system featuring a 3D avatar tutor, real-time facial emotion recognition, reinforcement learning pace adjustment, and diagnostic learning disability screening.

---

## 🚀 How to Run the Project

### 1. Requirements
- **Node.js** (v18 or higher): [Download Node.js](https://nodejs.org/)
- **Python** (v3.10 or v3.11): [Download Python](https://www.python.org/downloads/) *(Ensure "Add Python to PATH" is checked during installation)*

---

### 2. Quick Start (Windows Convenience Scripts)
Double click:
1. `run_backend.bat` — Installs Python dependencies and starts the Flask API at `http://127.0.0.1:5000`
2. `run_frontend.bat` — Installs npm packages and launches the Vite React app at `http://localhost:5173`

---

### 3. Manual Command Line Setup

#### 🟢 Start Backend (Python / Flask):
```bash
cd Backend
pip install -r requirements.txt
python app.py
```
*Backend API will run at:* `http://127.0.0.1:5000`

#### 🟢 Start Frontend (React / Vite):
```bash
cd Frontend
npm install
npm run dev
```
*Frontend App will run at:* `http://localhost:5173`

---

## 📁 Key Features Included
- **3D Avatar Companion** (Three.js & React Three Fiber)
- **Facial Emotion Detection** (MediaPipe + PyTorch + LSTM)
- **Adaptive Reinforcement Learning Tutor** (`RL.py`)
- **Multimodal Gemini AI** (Empathetic dialogue & handwriting analysis)
- **Diagnostic Reports Page** (`/profile`)
- **Offline Reliability System** (Local JSON file fallback if MongoDB is not installed)
"# AI-Based-Educational-platform-for-children-with-learning-disabilities" 
