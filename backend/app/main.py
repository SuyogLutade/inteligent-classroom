from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.connection import engine, SessionLocal, Base
from app.utils.seed import seed_database

# Import routers (to be created next)
from app.api.routes import (
    auth, classes, students, teachers, rooms,
    timetable, attendance, assignments, performance,
    announcements, notifications, dashboard
)

# Auto create SQLite tables
Base.metadata.create_all(bind=engine)

# Auto seed database if empty
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

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

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(classes.router, prefix="/api/classes", tags=["Classes"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(teachers.router, prefix="/api/teachers", tags=["Teachers"])
app.include_router(rooms.router, prefix="/api/rooms", tags=["Rooms"])
app.include_router(timetable.router, prefix="/api/timetable", tags=["Timetable"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"])
app.include_router(assignments.router, prefix="/api/assignments", tags=["Assignments"])
app.include_router(performance.router, prefix="/api/performance", tags=["Performance"])
app.include_router(announcements.router, prefix="/api/announcements", tags=["Announcements"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])


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
