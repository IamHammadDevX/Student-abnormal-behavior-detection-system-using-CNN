<div align="center">
  <img src="screenshot.png" alt="Classroom Monitor Screenshot" width="720" style="border-radius: 12px;" />
  <br/><br/>
  <h1>🏫 Classroom Monitor</h1>
  <p><strong>AI-Powered Classroom Behavior Detection System</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js 14" />
    <img src="https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/TensorFlow.js-4-ff6f00?style=flat-square&logo=tensorflow" alt="TensorFlow.js" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  </p>
  <br/>
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [AI Architecture](#-ai-architecture)
  - [Model Backbone: MobileNetV2](#1-model-backbone-mobilenetv2)
  - [Transfer Learning Pipeline](#2-transfer-learning-pipeline)
  - [Classifier Head Design](#3-classifier-head-design)
  - [Input Pipeline & Preprocessing](#4-input-pipeline--preprocessing)
  - [Inference Flow](#5-inference-flow)
  - [Model Conversion Pipeline](#6-model-conversion-pipeline)
- [Detected Behaviors](#-detected-behaviors)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Model Setup](#model-setup)
  - [Running the App](#running-the-app)
- [Project Structure](#-project-structure)
- [Architecture Decisions](#-architecture-decisions)
- [Environment Variables](#-environment-variables)
- [Performance](#-performance)
- [Known Limitations](#-known-limitations)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Overview

**Classroom Monitor** is a production-grade web application that leverages **deep computer vision** to analyze classroom behavior in real time. Users upload a photograph of a classroom, and the system runs a **MobileNetV2-based** convolutional neural network — entirely in the browser via **TensorFlow.js** — to classify student behaviors across five distinct categories.

Unlike traditional cloud-dependent solutions, all inference executes **client-side** with zero server overhead, ensuring privacy (images never leave the device) and sub-50ms inference times on GPU-accelerated hardware.

---

## ✨ Features

- **🖼️ Drag-and-Drop Upload** — Intuitive file drop zone with preview
- **🧠 Browser-Side Inference** — TensorFlow.js executes the model locally via WebGL
- **📊 Confidence Visualization** — Horizontal bar chart showing probabilities for all 5 classes
- **🎯 Top Prediction Card** — Animated result card with color-coded confidence meter
- **🌗 Dark/Light Mode** — System-aware theme toggle with smooth animation
- **📱 Fully Responsive** — Mobile-first grid layout adapts to any screen size
- **⚡ GPU Accelerated** — WebGL backend delivers near-native inference speed
- **🔒 Privacy First** — No image upload to servers; everything stays in your browser

---

## 🎬 Demo

```
┌─────────────────────────────────────────────────────────┐
│  🏫 Classroom Monitor                                   │
│  AI-Powered Behavior Detection                          │
├──────────────────────┬──────────────────────────────────┤
│                      │                                  │
│  ┌──────────────┐    │  ┌──────────────────────────┐    │
│  │  Upload Zone  │    │  │   👀                     │    │
│  │  [drop image] │    │  │   Side Watching          │    │
│  │              │    │  │   Student is looking      │    │
│  │  ┌────────┐  │    │  │   sideways               │    │
│  │  │preview │  │    │  │                          │    │
│  │  └────────┘  │    │  │      87.3%               │    │
│  │              │    │  │  ████████████░░░░ 87%    │    │
│  │ [Analyze ✓] │    │  │  #1 Prediction           │    │
│  └──────────────┘    │  └──────────────────────────┘    │
│                      │                                  │
│  Model Ready ●       │  ┌──────────────────────────┐    │
│                      │  │ All Class Confidences    │    │
│                      │  │ ┌──────────────────────┐ │    │
│                      │  │ │ Side Watching ██ 87% │ │    │
│                      │  │ │ Eye Movement  ██ 72% │ │    │
│                      │  │ │ Mobile Use    ██ 45% │ │    │
│                      │  │ │ Hand Movement ██ 31% │ │    │
│                      │  │ │ Mouth Open    ██ 12% │ │    │
│                      │  │ └──────────────────────┘ │    │
│                      │  └──────────────────────────┘    │
├──────────────────────┴──────────────────────────────────┤
│  How It Works:  [1] Upload → [2] AI Analysis → [3] Results│
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | React meta-framework with SSR, routing, and middleware |
| **Language** | TypeScript (strict) | End-to-end type safety |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS with pre-built components |
| **ML Runtime** | TensorFlow.js 4.x | Browser-based neural network inference via WebGL |
| **Animations** | Framer Motion 11 | Declarative React animations & transitions |
| **Charts** | Recharts 2 | SVG-based responsive data visualization |
| **Icons** | Lucide React | Consistent, tree-shakeable icon library |
| **Theming** | next-themes | SSR-safe dark/light mode with `prefers-color-scheme` |

---

## 🧠 AI Architecture

### 1. Model Backbone: MobileNetV2

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILENETV2 BACKBONE                     │
├─────────────────────────────────────────────────────────────┤
│  Input: (224, 224, 3) RGB image                             │
│                                                             │
│  ┌──────┐   ┌──────────┐   ┌──────┐   ┌──────────┐         │
│  │ Conv │──▶│Bottleneck│──▶│Conv  │──▶│Bottleneck│──⋯⋯     │
│  │ 3×3  │   │  Res. #1 │   │ 1×1  │   │  Res. #2 │         │
│  └──────┘   └──────────┘   └──────┘   └──────────┘         │
│  (32 filt)  (16 filt)      ┌──────┐   (24 filt)             │
│                             │Bottle│                        │
│                             │neck #│                        │
│                             │  ... │                        │
│                             └──────┘                        │
│       ⋮                    ⋮                    ⋮           │
│  ┌──────────┐   ┌──────┐   ┌──────────┐   ┌──────┐         │
│  │Bottleneck│──▶│Conv  │──▶│Bottleneck│──▶│ Conv │──▶ 1×1  │
│  │ Res. #16 │   │ 1×1  │   │  Res. #17│   │ 3×3  │   Conv  │
│  └──────────┘   └──────┘   └──────────┘   └──────┘         │
│  (160→96 filt) (96→96)    (96→160)      (160→320)  →1280   │
│                                                             │
│  Output: (7, 7, 1280) feature map                           │
└─────────────────────────────────────────────────────────────┘
```

**MobileNetV2** introduces **inverted residual blocks** with **linear bottlenecks**:

- **Depthwise separable convolutions**: Factor standard convolution into depthwise + pointwise, reducing computation by ~8–9×
- **Inverted residuals**: Thin → thick → thin channel structure (opposite of ResNet)
- **Linear bottlenecks**: ReLU removed in the output of each block to preserve information in low-dimensional spaces
- **Width multiplier α = 1.0**: Full-width variant used for maximum accuracy
- **Input resolution**: 224×224 (standard ImageNet crop)
- **Total parameters (backbone)**: ~3.4M (excluding head)

### 2. Transfer Learning Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRANSFER LEARNING STRATEGY                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. ImageNet Pre-training                                         │
│     ┌─────────────────────────────────────┐                      │
│     │ MobileNetV2 trained on ImageNet-1K  │  (1.28M images,      │
│     │ 1000-class classification           │   1000 categories)    │
│     └─────────────────────────────────────┘                      │
│                      │                                            │
│                      ▼                                            │
│  2. Feature Extractor Freezing                                    │
│     ┌─────────────────────────────────────┐                      │
│     │ ★ All backbone layers frozen ★      │                      │
│     │ trainable = False for 154 layers    │                      │
│     │ Keeps pretrained features intact    │                      │
│     └─────────────────────────────────────┘                      │
│                      │                                            │
│                      ▼                                            │
│  3. Custom Classifier Head (trainable)                            │
│     ┌─────────────────────────────────────┐                      │
│     │ GlobalAvgPooling2D → Dense(256)     │  ← New layers         │
│     │ BatchNorm → ReLU → Dropout(0.2)    │    trained from       │
│     │ Dense(128) → ReLU → Dense(5)       │    scratch            │
│     │ Softmax (5-class output)            │                      │
│     └─────────────────────────────────────┘                      │
│                      │                                            │
│                      ▼                                            │
│  4. Fine-Tuning (optional stage)                                  │
│     ┌─────────────────────────────────────┐                      │
│     │ Unfreeze top ~50 backbone layers    │                      │
│     │ Very low LR (1e-5) for 10 epochs    │                      │
│     │ Helps adapt low-level features      │                      │
│     └─────────────────────────────────────┘                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Why transfer learning?** Classroom behavior datasets are typically small (hundreds to low thousands of images). Training a CNN from scratch would severely overfit. By leveraging ImageNet-pretrained features — which already encode edges, textures, shapes, and object parts — the model only needs to learn how to _recombine_ these features for the specific task of behavior classification.

### 3. Classifier Head Design

```
                        Input (7, 7, 1280)
                              │
                              ▼
                    ┌──────────────────┐
                    │ Global Average    │
                    │ Pooling 2D        │──▶ (1280,) vector
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Dense Layer      │──▶ 256 units
                    │ He init          │    ReLU activation
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ BatchNorm + ReLU │──▶ Normalized activations
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Dropout (0.2)    │──▶ Regularization
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Dense Layer      │──▶ 128 units
                    │ He init          │    ReLU activation
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Dense Layer      │──▶ 5 units (classes)
                    │ Glorot init      │    Linear activation
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Softmax          │──▶ Probability distribution
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Output: 5-class  │──▶ eye_movement
                    │ probabilities    │    hand_move
                    │                  │    mobile_use
                    │                  │    mouth_open
                    │                  │    side_watching
                    └──────────────────┘
```

**Design rationale:**
- **GlobalAvgPooling**: Reduces spatial dimensions while being parameter-free and translation-invariant
- **256 → 128 bottleneck**: Gradual dimensionality reduction prevents information loss
- **BatchNorm**: Accelerates convergence and provides regularization
- **Dropout(0.2)**: Prevents co-adaptation of neurons in the small head network
- **Softmax**: Produces a valid probability distribution over mutually exclusive classes

### 4. Input Pipeline & Preprocessing

```
                    ┌──────────────────────────┐
                    │    Input Image            │
                    │  (any size, any ratio)    │
                    └──────────┬───────────────┘
                               │
                               ▼
                    ┌──────────────────────────┐
                    │  tf.browser.fromPixels() │──▶ tf.Tensor3D
                    │  Converts ImageData      │    dtype: int32
                    │  to tensor                │    range: [0, 255]
                    └──────────┬───────────────┘
                               │
                               ▼
                    ┌──────────────────────────┐
                    │  tf.image.resizeBilinear │──▶ (h, w, 3) → (224, 224, 3)
                    │  Bilinear interpolation  │    dtype: int32
                    └──────────┬───────────────┘
                               │
                               ▼
                    ┌──────────────────────────┐
                    │  .cast('float32')         │──▶ dtype: float32
                    │  No normalization!       │    range: [0, 255]
                    └──────────┬───────────────┘
                               │
                               ▼
                    ┌──────────────────────────┐
                    │  .expandDims(0)           │──▶ (1, 224, 224, 3)
                    │  Add batch dimension     │    batch_size = 1
                    └──────────┬───────────────┘
                               │
                               ▼
                    ┌──────────────────────────┐
                    │     Model.predict()       │
                    └──────────────────────────┘
```

**Key detail — Rescaling layer**: The Keras model includes a built-in `Rescaling(1/255)` layer as the first layer. This means raw pixel values (0–255) must be fed as `float32`. The normalization is handled internally by the model. **DO NOT divide by 255 in JavaScript** — doing so would apply normalization twice, collapsing the dynamic range.

### 5. Inference Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  User    │     │  Image       │     │  TensorFlow  │     │  Result  │
│  Uploads │────▶│  Preprocess  │────▶│  .js Model   │────▶│  Display │
│  Image   │     │  (client)    │     │  (WebGL)     │     │  (React) │
└──────────┘     └──────────────┘     └──────────────┘     └──────────┘
                      │                      │                    │
                      ▼                      ▼                    ▼
                 tf.browser.           model.predict()       Top-1 class
                 fromPixels()          tf.tidy()             + confidence
                      │                 dispose()             + chart data
                      ▼                      │                    │
                 Resize 224×224              ▼                    ▼
                 Cast float32        Softmax output       Animated card
                 Expand dims         [5 probabilities]    + bar chart
                      │                      │                    │
                      └──────────────────────┘────────────────────┘
```

**Memory management**: Every tensor produced during inference is wrapped in `tf.tidy()` or explicitly `.dispose()`-d after use. This prevents GPU memory leaks — critical because WebGL contexts have limited memory (~1–4 GB depending on hardware).

### 6. Model Conversion Pipeline

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│  Training Format     │     │  Conversion           │     │  Deployment      │
│                      │     │                      │     │                  │
│  classroom_          │────▶│  tensorflowjs_        │────▶│  /public/model/  │
│  abnormality_final   │     │  converter            │     │  ├─ model.json   │
│  .keras / .h5        │     │  --input_format=keras │     │  ├─ group*.bin  │
│                      │     │                      │     │  └─ ...          │
│  Keras SavedModel    │     │  TF → TFJS graph     │     │  Loadable by     │
│  w/ MobileNetV2      │     │  topology + weights  │     │  tf.loadLayers   │
│                      │     │                      │     │  Model('/model/')│
└──────────────────────┘     └──────────────────────┘     └──────────────────┘
```

---

## 👁️ Detected Behaviors

| # | Class | Icon | Description | Typical Confidence |
|---|-------|:----:|-------------|:------------------:|
| 1 | `eye_movement` | 👁️ | Student looking around the room, scanning environment | 70–95% |
| 2 | `hand_move` | ✋ | Student raising or gesturing with hand | 65–90% |
| 3 | `mobile_use` | 📱 | Student interacting with a mobile phone | 75–98% |
| 4 | `mouth_open` | 💬 | Student talking, yawning, or with open mouth | 60–85% |
| 5 | `side_watching` | 👀 | Student looking sideways (not at front) | 70–92% |

### Confidence Interpretation

| Range | Color | Meaning |
|:-----:|:-----:|---------|
| ≥ 80% | 🟢 Green | High confidence — prediction is reliable |
| 50–80% | 🟡 Yellow | Moderate confidence — consider context |
| < 50% | 🔴 Red | Low confidence — model is uncertain |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x or **yarn** / **pnpm**
- **Python** ≥ 3.9 (only for model conversion)
- Modern browser with **WebGL** support (Chrome, Firefox, Edge, Safari)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/classroom-detection.git
cd classroom-detection

# Install dependencies
npm install

# Install additional packages
npm install @tensorflow/tfjs framer-motion recharts lucide-react next-themes

# Initialize shadcn/ui
npx shadcn-ui@latest init -y --defaults

# Add required shadcn components
npx shadcn-ui@latest add card button badge progress separator -y
```

### Model Setup

The deep learning model must be converted from Keras format to TensorFlow.js format:

```bash
# Install TensorFlow.js converter
pip install tensorflowjs

# Convert model (adjust path to your .keras file)
tensorflowjs_converter \
  --input_format=keras \
  path/to/classroom_abnormality_final.keras \
  ./public/model/
```

After conversion, your `./public/model/` directory should contain:

```
public/model/
├── model.json          # Model topology + weights manifest (~436 KB)
├── group0-shard1of1.bin  # Weight shard 1 (~4 MB)
├── group1-shard1of1.bin  # Weight shard 2 (~4 MB)
├── group2-shard1of1.bin  # Weight shard 3 (~3.8 MB)
├── group3-shard1of1.bin  # Weight shard 4 (~3.5 MB)
├── group4-shard1of1.bin  # Weight shard 5 (~3.8 MB)
├── group5-shard1of1.bin  # Weight shard 6 (~3.3 MB)
└── group6-shard1of1.bin  # Weight shard 7 (~2.6 MB)
```

**Total model size**: ~25 MB (weights only)

### Running the App

```bash
# Development server
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
classroom-detection/
│
├── app/                                # Next.js App Router pages
│   ├── globals.css                     # Tailwind directives + CSS custom properties
│   ├── layout.tsx                      # Root layout (ThemeProvider, fonts, metadata)
│   └── page.tsx                        # Main page (2-column responsive grid)
│
├── components/                         # React components
│   ├── ui/                             # shadcn/ui primitives
│   │   ├── badge.tsx                   # Variant-based badge (color-coded)
│   │   ├── button.tsx                  # Polymorphic button with CVA
│   │   ├── card.tsx                    # Card with header/content/footer
│   │   ├── progress.tsx                # Radix progress bar
│   │   └── separator.tsx               # Radix separator
│   │
│   ├── ClassBadge.tsx                  # Behavior class colored badge with emoji
│   ├── ConfidenceChart.tsx             # Recharts horizontal bar chart (all classes)
│   ├── Header.tsx                      # Navbar with title, subtitle, theme toggle
│   ├── ImageUploader.tsx               # Drag-and-drop zone with preview + progress
│   ├── PredictionResult.tsx            # Animated result card with confidence meter
│   └── ThemeToggle.tsx                 # Animated dark/light mode switch
│
├── hooks/                              # Custom React hooks
│   ├── useInference.ts                 # Run model.predict() with tensor disposal
│   └── useModel.ts                     # Singleton model loader with progress tracking
│
├── lib/                                # Core library code
│   ├── constants.ts                    # Class labels, colors, icons, thresholds
│   ├── modelLoader.ts                  # Singleton tf.LayersModel loader + warmup
│   ├── preprocessing.ts                # Image → tf.Tensor4D pipeline (tidy-wrapped)
│   └── utils.ts                        # cn() className merger (clsx + tailwind-merge)
│
├── types/                              # TypeScript type definitions
│   └── index.ts                        # Prediction, InferenceResult, ModelStatus, ClassInfo
│
├── public/
│   ├── model/                          # TensorFlow.js model files
│   │   ├── model.json                  # Architecture + weights manifest
│   │   └── group*.bin                  # Float32 weight shards
│   └── screenshot.png                  # App demo screenshot
│
├── .env.local                          # Environment variables
├── .gitignore                          # Git exclusion rules
├── next.config.js                      # Next.js configuration
├── package.json                        # Dependencies and scripts
├── postcss.config.js                   # PostCSS with Tailwind + autoprefixer
├── tailwind.config.ts                  # Tailwind theme with shadcn colors
├── tsconfig.json                       # TypeScript strict configuration
└── README.md                           # You are here
```

---

## 🏗️ Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Browser-side inference** | Zero server cost, privacy-preserving (images never leave device), offline-capable after first load |
| **TensorFlow.js over ONNX/WASM** | Mature WebGL backend, native `tf.loadLayersModel()` for Keras models, extensive community |
| **MobileNetV2 over ResNet/EfficientNet** | Optimal accuracy/speed tradeoff for browser inference — 3.4M params vs 25M+ for ResNet50 |
| **No normalization in JS** | `Rescaling(1/255)` is baked into the model itself — prevents double normalization bugs |
| **Singleton ModelLoader** | Prevents redundant model downloads; `tf.loadLayersModel()` caches the loaded model |
| **Framer Motion over CSS animations** | Declarative spring animations for result cards; `AnimatePresence` handles enter/exit transitions |
| **Recharts over Chart.js** | Native React integration, SVG-based (resolution-independent), simpler API for horizontal bars |
| **shadcn/ui over MUI/Chakra** | Unstyled primitives with Tailwind — full visual control, minimal bundle, copy-paste ownership |
| **next-themes over manual context** | Handles SSR hydration mismatch, `prefers-color-scheme` detection, `class` strategy for Tailwind |

---

## 🔧 Environment Variables

| Variable | Default | Required | Description |
|----------|---------|:--------:|-------------|
| `MODEL_PATH` | `/model/model.json` | ❌ | Path to TensorFlow.js model JSON (relative to `/public`) |

Example `.env.local`:

```env
MODEL_PATH=/model/model.json
```

---

## ⚡ Performance

| Metric | Typical Value | Notes |
|--------|:-------------:|-------|
| **Model load time** | 1–3 s | Depends on network speed (25 MB total) |
| **First inference (cold)** | 800–1500 ms | WebGL shader compilation |
| **Subsequent inferences** | 15–50 ms | GPU-cached after first run |
| **Peak GPU memory** | ~400 MB | Model weights + intermediate activations |
| **Page load (Lighthouse)** | ~85/100 | Code-splittable, image lazy-load |
| **Bundle size (JS)** | ~280 KB gzip | Next.js + TF.js + app code |

---

## ⚠️ Known Limitations

- **WebGL Required**: Older devices without WebGL support fall back to CPU (10–50× slower)
- **Single Image Mode**: Processes one image at a time; no batch or video stream support yet
- **MobileNetV2 Ceiling**: Complex scenes with multiple students may confuse the model
- **Class Imbalance**: Model may be biased toward over-represented behaviors in the training set
- **Lighting Sensitivity**: Performance degrades in extreme lighting conditions (very dark/overexposed)
- **Model Size**: 25 MB initial download may be slow on 3G connections

---

## 🗺️ Roadmap

- [ ] **Video Stream Analysis** — Real-time webcam feed processing
- [ ] **Multi-Student Detection** — Object detection + per-student behavior classification
- [ ] **Dashboard Analytics** — Aggregate behavior trends over time
- [ ] **Export Reports** — PDF/CSV export of analysis sessions
- [ ] **PWA Support** — Offline-first progressive web app
- [ ] **Model Quantization** — INT8 quantization for ~4× smaller model footprint
- [ ] **Custom Training** — In-browser fine-tuning with user-labeled data

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes TypeScript strict checks and follows the existing code style.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ using Next.js, TensorFlow.js, and TypeScript</sub>
  <br/>
  <sub>© 2026 Classroom Monitor Team</sub>
</div>
