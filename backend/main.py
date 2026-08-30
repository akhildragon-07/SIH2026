from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import router as api_router

app = FastAPI(
    title="SakshamAI - PM-AJAY GIA Recommendation Backend",
    description="Explainable Hybrid AI Recommendation System for NSQF Skilling & Livelihood Mapping (SIH 2026)",
    version="2.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "SakshamAI PM-AJAY GIA Recommendation System",
        "dataset": "sih_nsqf_1000_synthetic_training_records.csv (DEMO DATASET)",
        "endpoints": [
            "POST /recommend",
            "POST /profile/extract",
            "POST /skill-gap",
            "POST /career-path",
            "GET /courses",
            "GET /evaluate"
        ]
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
