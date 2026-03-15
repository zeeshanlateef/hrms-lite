from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas
from app.database import get_db

router = APIRouter(
    prefix="/employees",
    tags=["employees"]
)

@router.post("/", response_model=schemas.Employee, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = crud.get_employee_by_id(db, employee_id=employee.employee_id)
    if db_employee:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Employee ID already exists"
        )
    db_email = crud.get_employee_by_email(db, email=employee.email)
    if db_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    return crud.create_employee(db=db, employee=employee)

@router.get("/", response_model=List[schemas.Employee])
def read_employees(db: Session = Depends(get_db)):
    return crud.get_employees(db)

@router.put("/{employee_id}", response_model=schemas.Employee)
def update_employee(employee_id: str, employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = crud.get_employee_by_id(db, employee_id=employee_id)
    if not db_employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    return crud.update_employee(db=db, employee_id=employee_id, employee_update=employee)

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    db_employee = crud.get_employee_by_id(db, employee_id=employee_id)
    if not db_employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    crud.delete_employee(db, employee_id=employee_id)
    return None

@router.get("/export/csv")
def export_employees_csv(db: Session = Depends(get_db)):
    from fastapi.responses import Response
    csv_data = crud.generate_employees_csv(db)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=employees_export.csv"}
    )
