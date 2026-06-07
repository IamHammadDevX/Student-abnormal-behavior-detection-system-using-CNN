import os
import numpy as np
from PIL import Image
import io
from pathlib import Path

# Try importing TensorFlow/Keras, fallback if not available
TF_AVAILABLE = False
TF_ERROR = None

try:
    print(f"[DEBUG] Attempting TensorFlow import...")
    from tensorflow import keras
    from keras.models import load_model as keras_load_model
    print(f"[DEBUG] ✓ TensorFlow imported successfully")
    TF_AVAILABLE = True
except ImportError as e:
    TF_ERROR = str(e)
    print(f"[DEBUG] TensorFlow import failed: {e}")
    try:
        print(f"[DEBUG] Attempting standalone Keras import...")
        import keras
        keras_load_model = keras.models.load_model
        print(f"[DEBUG] ✓ Keras imported successfully")
        TF_AVAILABLE = True
    except ImportError as e2:
        TF_ERROR = str(e2)
        print(f"[DEBUG] Keras import also failed: {e2}")
        TF_AVAILABLE = False
        keras_load_model = None
except Exception as e:
    TF_ERROR = str(e)
    print(f"[DEBUG] Unexpected error during TensorFlow import: {e}")
    TF_AVAILABLE = False
    keras_load_model = None

# Class mapping from model
CLASS_NAMES = {
    0: "Eye Movement",
    1: "Hand Move",
    2: "Mobile Use",
    3: "Mouth Open",
    4: "Side Watching"
}

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "Models",
    "best_model_finetuned.keras"
)

# Load model once at startup
model = None

def load_model_weights():
    """Load model on app startup"""
    global model
    if model is None:
        if not TF_AVAILABLE:
            msg = f"TensorFlow/Keras not available. Error: {TF_ERROR}"
            print(f"[DEBUG] {msg}")
            raise RuntimeError(msg)
        
        if not os.path.exists(MODEL_PATH):
            msg = f"Model not found at: {MODEL_PATH}"
            print(f"[DEBUG] {msg}")
            raise FileNotFoundError(msg)
        
        try:
            print(f"[DEBUG] Loading model from: {MODEL_PATH}")
            model = keras_load_model(MODEL_PATH)
            print(f"[DEBUG] ✓ Model loaded successfully")
        except Exception as e:
            msg = f"Error loading model: {e}"
            print(f"[DEBUG] {msg}")
            raise
    return model

def preprocess_image(image_bytes):
    """Convert image bytes to 224x224 tensor — NO manual normalization"""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img, dtype=np.float32)   # keep 0-255, model rescales internally
    img_array = np.expand_dims(img_array, axis=0)  # shape: (1, 224, 224, 3)
    return img_array

def predict(image_bytes):
    """Inference on image"""
    model = load_model_weights()
    img_array = preprocess_image(image_bytes)
    
    predictions = model.predict(img_array, verbose=0)
    confidence = float(np.max(predictions[0]))
    class_id = int(np.argmax(predictions[0]))
    class_name = CLASS_NAMES.get(class_id, "Unknown")
    
    # All class probabilities
    class_probs = {
        CLASS_NAMES[i]: float(predictions[0][i])
        for i in range(len(CLASS_NAMES))
    }
    
    return {
        "class_id": class_id,
        "class_name": class_name,
        "confidence": confidence,
        "probabilities": class_probs
    }

