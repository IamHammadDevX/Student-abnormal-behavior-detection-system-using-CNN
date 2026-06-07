<p align="center">
  <h1 align="center">🎓 Classroom Behavior Detection</h1>
  <p align="center">
    <strong>AI-powered classroom monitoring using CNN deep learning</strong>
    <br />
    Real-time detection of 5 student behaviors from images via a clean web interface.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/python-3.10%2B-blue" alt="Python">
  <img src="https://img.shields.io/badge/framework-FastAPI-009688" alt="FastAPI">
  <img src="https://img.shields.io/badge/model-MobileNetV2-orange" alt="MobileNetV2">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/docker-ready-2496ED" alt="Docker">
</p>

---

## 📖 Overview

Classroom Behavior Detection is a deep learning web application that classifies student behaviors from classroom images. It uses a **MobileNetV2** CNN fine-tuned for 5 behavior classes, served through a **FastAPI** backend with an interactive drag-and-drop web UI.

### 🔍 Detected Behaviors

| ID | Class          | Description                     |
|----|----------------|---------------------------------|
| 0  | Eye Movement   | Student looking around          |
| 1  | Hand Move      | Student raising or moving hand  |
| 2  | Mobile Use     | Student using phone             |
| 3  | Mouth Open     | Student talking or yawning      |
| 4  | Side Watching  | Student looking sideways        |

---

## ✨ Features

- **Drag & Drop UI** — Upload images via browser, get instant predictions
- **REST API** — `/predict` endpoint for programmatic access
- **Confidence Scores** — Per-class probabilities with visual bars
- **Docker Support** — One-command deployment with `docker-compose up`
- **Graceful Fallback** — Web UI loads even without TensorFlow; clear error on predict
- **OpenAPI Docs** — Auto-generated Swagger UI at `/docs`

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- pip
- (Optional) Docker

### 1. Clone

```bash
git clone https://github.com/your-username/classroom-detection.git
cd classroom-detection
```

### 2. Install

```bash
# Windows
install.bat

# macOS / Linux
chmod +x install.sh && ./install.sh

# Or manually
python -m venv venv
venv\Scripts\activate     # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
pip install tensorflow
```

### 3. Add Model

Place your trained model at `Models/best_model_finetuned.keras`.

> 📌 Model files are git-ignored by default. Download from [releases](#) or train using the included notebook `Models/classroom_behavior_CNN.ipynb`.

### 4. Run

```bash
# Windows
run.bat

# macOS / Linux
./run.sh

# Or manually
python main.py
```

### 5. Open

| What                | URL                              |
|---------------------|----------------------------------|
| Web UI              | http://localhost:8000            |
| API Docs (Swagger)  | http://localhost:8000/docs       |
| ReDoc               | http://localhost:8000/redoc      |
| Health Check        | http://localhost:8000/health     |

---

## 📁 Project Structure

```
classroom-detection/
├── main.py                        # FastAPI app entry point
├── requirements.txt               # Python dependencies
├── Dockerfile                     # Container build
├── docker-compose.yml             # Multi-container orchestration
├── .gitignore
├── install.bat / install.sh       # Setup scripts
├── run.bat / run.sh               # Launch scripts
├── app/
│   ├── __init__.py
│   └── model.py                   # Model loading, preprocessing, inference
├── Models/
│   ├── best_model_finetuned.keras  # Trained MobileNetV2 model (git-ignored)
│   └── classroom_behavior_CNN.ipynb # Training notebook (git-ignored)
├── templates/
│   └── index.html                 # Single-page web UI
└── static/                        # Static assets (CSS, JS, images)
```

---

## 🔌 API Reference

### `POST /predict`

Upload an image and get behavior prediction.

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -F "file=@classroom.jpg"
```

**Response:**

```json
{
  "class_id": 2,
  "class_name": "Mobile Use",
  "confidence": 0.9521,
  "probabilities": {
    "Eye Movement": 0.02,
    "Hand Move": 0.01,
    "Mobile Use": 0.95,
    "Mouth Open": 0.01,
    "Side Watching": 0.01
  }
}
```

### `GET /health`

```json
{ "status": "ok" }
```

### `GET /docs`

Interactive Swagger UI.

---

## 🐳 Docker

```bash
# Build and run
docker-compose up --build

# Or manually
docker build -t classroom-detection .
docker run -p 8000:8000 \
  -v $(pwd)/Models:/app/Models:ro \
  -v $(pwd)/templates:/app/templates:ro \
  classroom-detection
```

---

## 🧠 Model

| Property       | Value                     |
|----------------|---------------------------|
| Architecture   | MobileNetV2 (Transfer)    |
| Input          | 224×224 RGB               |
| Output         | 5-class softmax           |
| Framework      | TensorFlow / Keras        |
| Format         | `.keras`                  |
| Origin         | Fine-tuned from ImageNet  |

Training notebook: `Models/classroom_behavior_CNN.ipynb`

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Backend     | FastAPI + Uvicorn                   |
| ML Engine   | TensorFlow / Keras                  |
| Model       | MobileNetV2 (CNN)                   |
| Frontend    | Vanilla HTML/CSS/JS                 |
| Deployment  | Docker + Docker Compose             |
| Image Proc  | Pillow + NumPy                      |

---

## 📄 License

MIT © 2026

---

## 🙏 Acknowledgments

- MobileNetV2 pretrained on ImageNet
- Built with [FastAPI](https://fastapi.tiangolo.com/) and [TensorFlow](https://tensorflow.org/)

- **Output**: 5 classes
- **Format**: `.keras` (recommended), `.h5` backup

## 📊 Performance
- Model loads on startup (~500MB GPU memory)
- Inference: ~50-100ms per image
- Max concurrent requests: Limited by GPU memory

## 🔧 Troubleshooting

### Model not found
Check `Models/` folder exists and contains `.keras` file

### CUDA out of memory
Reduce batch size or use CPU:
```python
# In app/model.py
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'  # Force CPU
```

### Port already in use
```bash
uvicorn main:app --port 8001
```

## 📝 Notes
- Images auto-resize to 224×224
- Normalized to [0, 1]
- Model predicts on CPU if GPU unavailable
- CORS enabled for frontend development

## 🚀 Future Enhancements
- [ ] Batch prediction endpoint
- [ ] Video stream support
- [ ] Confidence threshold filtering
- [ ] Request caching
- [ ] Database logging
- [ ] Authentication/API keys
- [ ] Rate limiting
- [ ] Model versioning

---
**Created**: 2026-06-07
**Model**: classroom_abnormality_final.keras
**Framework**: FastAPI + TensorFlow/Keras
