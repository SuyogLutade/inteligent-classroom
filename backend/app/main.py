from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title="SmartClass API",
    description="Smart Classroom Management System — SIH1625",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "ok",
        "service": "SmartClass API",
        "version": "1.0.0",
        "description": "SIH1625 — Smart Classroom Management System",
    }


@app.get("/", tags=["System"])
async def root():
    return {"message": "SmartClass API is running. Visit /docs for the API documentation."}
