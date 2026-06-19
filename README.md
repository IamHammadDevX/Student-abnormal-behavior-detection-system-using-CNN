<p align="center">
  <h1 align="center">🎓 Classroom Behavior Detection</h1>
  <p align="center">
    <strong>AI-powered classroom monitoring using CNN + Vision Transformer</strong>
    <br />
    Real-time detection of 5 student behaviors from images, with out-of-distribution rejection and a clean web interface.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/python-3.10%2B-blue" alt="Python">
  <img src="https://img.shields.io/badge/framework-FastAPI-009688" alt="FastAPI">
  <img src="https://img.shields.io/badge/model-MobileNetV2%20%2B%20ViT-orange" alt="Models">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/docker-ready-2496ED" alt="Docker">
</p>

---

## 📖 Overview

Classroom Behavior Detection is a deep learning web application that classifies student behaviors from classroom images. It uses **two independent models** — a **MobileNetV2** CNN (transfer learning + fine-tuning) and a **Vision Transformer (ViT)** built from scratch — served through a **FastAPI** backend with an interactive drag-and-drop web UI.

Predictions are protected by an **Out-of-Distribution (OOD) detection layer**, so the system no longer forces a confident answer on images that don't actually show classroom behavior — empty rooms, random photos, or unclear frames are correctly flagged as **Unknown** instead of being misclassified.

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

- **Dual-Model Architecture** — CNN (MobileNetV2) and Vision Transformer (ViT) run independently, with an ensemble (averaged) result
- **Out-of-Distribution Detection** — entropy + confidence thresholding rejects images that don't match any known behavior, instead of forcing a wrong prediction
- **Explainability** — Grad-CAM heatmaps for the CNN, patch attention maps for the ViT
- **Drag & Drop UI** — Upload images via browser, get instant predictions
- **REST API** — `/predict` endpoint for programmatic access
- **Confidence Scores** — Per-class probabilities with visual bars, for both models and the ensemble
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

### 3. Add Models

Place your trained models in `Models/`:

```
Models/
├── best_model_finetuned.keras    # CNN (MobileNetV2)
├── vit_classroom_final.keras     # Vision Transformer
├── class_names.json              # Class index → label mapping
└── ood_thresholds.json           # Calibrated OOD thresholds
```

> 📌 Model files are git-ignored by default. Download from [releases](#) or train using the included notebook `Models/classroom_behavior_CNN.ipynb`, which trains and saves both models plus calibrated thresholds.

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
├── main.py                          # FastAPI app entry point
├── requirements.txt                 # Python dependencies
├── Dockerfile                       # Container build
├── docker-compose.yml               # Multi-container orchestration
├── .gitignore
├── install.bat / install.sh         # Setup scripts
├── run.bat / run.sh                 # Launch scripts
├── app/
│   ├── __init__.py
│   └── model.py                     # Model loading, preprocessing, OOD logic, inference
├── Models/
│   ├── best_model_finetuned.keras   # Trained CNN — MobileNetV2 (git-ignored)
│   ├── vit_classroom_final.keras    # Trained Vision Transformer (git-ignored)
│   ├── class_names.json             # Class index → label mapping (git-ignored)
│   ├── ood_thresholds.json          # Calibrated confidence/entropy thresholds (git-ignored)
│   └── classroom_behavior_CNN.ipynb # Training notebook — CNN + ViT (git-ignored)
├── templates/
│   └── index.html                   # Single-page web UI
└── static/                          # Static assets (CSS, JS, images)
```

---

## 🔌 API Reference

### `POST /predict`

Upload an image and get a behavior prediction from both models plus the ensemble result. Images that don't resemble any known class are flagged instead of forced into a category.

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -F "file=@classroom.jpg"
```

**Response — confident prediction:**

```json
{
  "status": "ok",
  "ensemble": {
    "class_id": 2,
    "class_name": "Mobile Use",
    "confidence": 0.9521,
    "entropy": 0.182,
    "probabilities": {
      "Eye Movement": 0.02,
      "Hand Move": 0.01,
      "Mobile Use": 0.95,
      "Mouth Open": 0.01,
      "Side Watching": 0.01
    }
  },
  "cnn": { "class_name": "Mobile Use", "confidence": 0.9610 },
  "vit": { "class_name": "Mobile Use", "confidence": 0.9432 }
}
```

**Response — out-of-distribution image (no person, empty room, irrelevant photo):**

```json
{
  "status": "unknown_image",
  "ensemble": {
    "class_id": null,
    "class_name": "Unknown",
    "confidence": 0.31,
    "entropy": 1.52
  },
  "message": "Unknown image — entropy exceeds threshold. This does not look like any classroom behaviour."
}
```

**Response — low-confidence prediction (unclear/partial subject):**

```json
{
  "status": "low_confidence",
  "ensemble": {
    "class_id": 0,
    "class_name": "Eye Movement",
    "confidence": 0.54,
    "entropy": 0.97
  },
  "message": "Low confidence prediction. Best guess: Eye Movement, but result is unreliable."
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

## 🧠 Models

This project trains and serves **two independent architectures** and combines them via ensemble averaging.

### CNN — MobileNetV2 (Transfer Learning)

| Property       | Value                     |
|----------------|---------------------------|
| Architecture   | MobileNetV2 (Transfer)    |
| Input          | 224×224 RGB, raw 0–255    |
| Output         | 5-class softmax           |
| Training       | Frozen backbone → fine-tune top 30 layers |
| Explainability | Grad-CAM                  |
| Format         | `.keras` (recommended), `.h5` backup |

### Vision Transformer (Built from Scratch)

| Property            | Value                                  |
|----------------------|-----------------------------------------|
| Architecture          | ViT — patch embedding + multi-head self-attention |
| Patch size            | 16×16 (196 patches per image)          |
| Embedding dimension   | 64                                      |
| Transformer layers    | 8                                        |
| Attention heads        | 4                                        |
| Input                | 224×224 RGB, raw 0–255                  |
| Output               | 5-class softmax                         |
| Optimizer            | AdamW + cosine-decay learning rate       |
| Explainability        | Patch attention map                     |
| Format               | `.keras`                                 |

### Why two models?

The CNN learns strong local texture features (e.g. a hand shape, a phone edge) via convolution. The ViT instead attends globally across the whole frame, which helps when a behavior depends on the relationship between distant regions (e.g. eyes versus hands versus posture). Averaging their softmax outputs (the **ensemble**) generally produces a more stable prediction than either model alone, and disagreement between the two is itself a useful signal of an ambiguous image.

### Out-of-Distribution (OOD) Detection

Both models output a calibrated **confidence** and **Shannon entropy** for every prediction. Thresholds for both are computed automatically from the validation set during training (saved to `ood_thresholds.json`) rather than hand-picked:

| Signal | Meaning | Action when triggered |
|---|---|---|
| High entropy | Output is spread evenly across classes — the image doesn't resemble any known behavior | Prediction returned as `Unknown` |
| Low max confidence | Best guess is below the calibrated threshold | Prediction returned as `Low Confidence`, original guess still shown for reference |
| Normal | Confident, low-entropy prediction | Returned as-is |

This is why the API response includes a `status` field (`ok`, `low_confidence`, `unknown_image`) rather than always returning a hard class label.

Training notebook: `Models/classroom_behavior_CNN.ipynb`

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Backend     | FastAPI + Uvicorn                   |
| ML Engine   | TensorFlow / Keras                  |
| Models      | MobileNetV2 (CNN) + Vision Transformer (built from scratch) |
| OOD Logic   | Entropy + confidence thresholding (scipy)|
| Frontend    | Vanilla HTML/CSS/JS                 |
| Deployment  | Docker + Docker Compose             |
| Image Proc  | Pillow + NumPy                      |

---

## 📄 License

MIT © 2026

---

## 🙏 Acknowledgments

- MobileNetV2 pretrained on ImageNet
- Vision Transformer architecture based on ["An Image is Worth 16x16 Words"](https://arxiv.org/abs/2010.11929) (Dosovitskiy et al., 2020)
- Built with [FastAPI](https://fastapi.tiangolo.com/) and [TensorFlow](https://tensorflow.org/)

- **Output**: 5 classes (or `Unknown` when OOD-flagged)
- **Format**: `.keras` (recommended), `.h5` backup for the CNN

## 📊 Performance
- Both models load on startup (~700MB combined GPU memory)
- Inference: ~50-100ms per image (CNN), ~80-150ms per image (ViT), run sequentially
- Max concurrent requests: Limited by GPU memory

## 🔧 Troubleshooting

### Model not found
Check `Models/` folder exists and contains both `.keras` files (`best_model_finetuned.keras` and `vit_classroom_final.keras`), plus `class_names.json` and `ood_thresholds.json`.

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

### Every prediction looks wrong or identical
This is almost always a **preprocessing mismatch**, not a model problem. Both models have a `Rescaling(1/255)` layer built in — do **not** divide by 255 manually in `app/model.py`. See the "Notes" section below.

### All images get flagged as "Unknown"
The entropy/confidence thresholds in `ood_thresholds.json` may be too strict for your dataset. Re-run the calibration cell in the training notebook, or manually relax the values in that file.

## 📝 Notes
- Images auto-resize to 224×224
- Pixel values are passed as raw 0–255 floats — normalization happens **inside both models** via a `Rescaling` layer, so do not normalize manually in the backend
- Models predict on CPU if GPU unavailable
- CORS enabled for frontend development
- The ensemble result is the average of CNN and ViT softmax outputs; OOD thresholds are applied to the ensemble output

## 🚀 Future Enhancements
- [ ] Batch prediction endpoint
- [ ] Video stream support
- [ ] Confidence threshold filtering (configurable per-request)
- [ ] Request caching
- [ ] Database logging
- [ ] Authentication/API keys
- [ ] Rate limiting
- [ ] Model versioning
- [ ] LSTM temporal modeling for video sequences (Phase 3)
- [ ] YOLO-based real-time localization (Phase 3)

---
**Updated**: 2026-06-09
**Models**: `classroom_abnormality_final.keras` (CNN) + `vit_classroom_final.keras` (ViT)
**Framework**: FastAPI + TensorFlow/Keras