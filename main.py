from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
from app.model import predict, load_model_weights

app = FastAPI(
    title="Classroom Behavior Detection API",
    description="Detect abnormal behaviors in classroom using CNN",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.on_event("startup")
async def startup_event():
    """Try loading model on startup, but don't fail if missing"""
    try:
        load_model_weights()
        print("✓ Model loaded at startup")
    except Exception as e:
        print(f"⚠ Model loading skipped: {e}")
        print("The web UI will load, but predictions won't work until TensorFlow is installed")

@app.get("/", response_class=HTMLResponse)
async def root():
    """Serve main page"""
    html_path = os.path.join(os.path.dirname(__file__), "templates", "index.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>Classroom Behavior Detection API</h1><p>Upload an image to /docs</p>"

@app.get("/health")
async def health():
    """Health check"""
    return {"status": "ok", "model": "loaded"}

@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    """
    Predict classroom behavior from image
    
    Parameters:
    - file: Image file (JPG, PNG)
    
    Returns:
    - class_id: 0-4
    - class_name: Behavior name
    - confidence: 0-1
    - probabilities: All class probabilities
    """
    try:
        if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
            raise HTTPException(
                status_code=400,
                detail="File must be JPG or PNG image"
            )
        
        image_bytes = await file.read()
        result = predict(image_bytes)
        return result
    
    except HTTPException:
        raise
    except RuntimeError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Model not available: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/docs", tags=["docs"])
async def api_docs():
    """OpenAPI docs"""
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
