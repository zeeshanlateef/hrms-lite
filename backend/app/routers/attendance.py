from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app import crud, schemas
from app.database import get_db

router = APIRouter(
    prefix="/attendance",
    tags=["attendance"]
)

@router.post("/", response_model=schemas.Attendance, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    db_employee = crud.get_employee_by_id(db, employee_id=attendance.employee_id)
    if not db_employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee does not exist"
        )
    return crud.mark_attendance(db=db, attendance=attendance)

@router.get("/", response_model=List[schemas.Attendance])
def read_attendance(date: Optional[date] = None, db: Session = Depends(get_db)):
    return crud.get_attendance(db, date_filter=date)
