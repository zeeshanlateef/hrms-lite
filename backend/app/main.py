from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .database import engine, Base, SessionLocal
from .routers import employees, attendance
from . import crud, schemas, models
from sqlalchemy.orm import Session
from datetime import date as date_today
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
try:
    models.Base.metadata.create_all(bind=engine)
    logger.info("Database tables created or already exist.")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")

app = FastAPI(
    title="HRMS Lite API",
    description="Backend for Human Resource Management System",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:3000",
    "*" # For development ease
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "detail": str(exc)},
    )

# Include Routers
app.include_router(employees.router, prefix="/api")
app.include_router(attendance.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to HRMS Lite API", "docs": "/docs"}

@app.get("/api/dashboard/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(date: Optional[date_today] = None):
    db = SessionLocal()
    try:
        target_date = date or date_today.today()
        emp_count = db.query(models.Employee).count()
        att_count = db.query(models.Attendance).count()
        present_count = db.query(models.Attendance).filter(
            models.Attendance.date == target_date, 
            models.Attendance.status == 'Present'
        ).count()
        absent_count = db.query(models.Attendance).filter(
            models.Attendance.date == target_date, 
            models.Attendance.status == 'Absent'
        ).count()
        
        return {
            "total_employees": emp_count,
            "total_attendance": att_count,
            "present_today": present_count,
            "absent_today": absent_count
        }
    except Exception as e:
        logger.error(f"Stats error: {e}")
        return {
            "total_employees": 0,
            "total_attendance": 0,
            "present_today": 0,
            "absent_today": 0
        }
    finally:
        db.close()
