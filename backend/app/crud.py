from sqlalchemy.orm import Session
from app import models, schemas
from datetime import date
from typing import Optional
import io
import csv

def get_employee_by_id(db: Session, employee_id: str):
    return db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()

def get_employee_by_email(db: Session, email: str):
    return db.query(models.Employee).filter(models.Employee.email == email).first()

def get_employees(db: Session):
    return db.query(models.Employee).all()

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_employee = models.Employee(
        employee_id=employee.employee_id,
        full_name=employee.full_name,
        email=employee.email,
        department=employee.department
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def update_employee(db: Session, employee_id: str, employee_update: schemas.EmployeeCreate):
    db_employee = db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()
    if db_employee:
        db_employee.full_name = employee_update.full_name
        db_employee.email = employee_update.email
        db_employee.department = employee_update.department
        # employee_id is usually immutable in such systems, but could be modified if needed
        db.commit()
        db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, employee_id: str):
    db_employee = db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()
    if db_employee:
        db.delete(db_employee)
        db.commit()
    return db_employee

def get_attendance(db: Session, date_filter: Optional[date] = None):
    query = db.query(models.Attendance)
    if date_filter:
        query = query.filter(models.Attendance.date == date_filter)
    
    results = query.all()
    # Enriched results with employee names for frontend display convenience
    for record in results:
        record.employee_name = record.employee.full_name
    return results

def mark_attendance(db: Session, attendance: schemas.AttendanceCreate):
    # Check if a record already exists for this employee on this date
    db_attendance = db.query(models.Attendance).filter(
        models.Attendance.employee_id == attendance.employee_id,
        models.Attendance.date == attendance.date
    ).first()

    if db_attendance:
        # Update existing record
        db_attendance.status = attendance.status
    else:
        # Create new record
        db_attendance = models.Attendance(
            employee_id=attendance.employee_id,
            date=attendance.date,
            status=attendance.status
        )
        db.add(db_attendance)
    
    db.commit()
    db.refresh(db_attendance)
    
    # Enrich with employee name for frontend display
    db_attendance.employee_name = db_attendance.employee.full_name
    return db_attendance

def generate_employees_csv(db: Session):
    employees = db.query(models.Employee).all()
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow(['Employee ID', 'Full Name', 'Email', 'Department', 'Created At'])
    
    for emp in employees:
        writer.writerow([
            emp.employee_id,
            emp.full_name,
            emp.email,
            emp.department,
            emp.created_at.strftime("%Y-%m-%d %H:%M:%S") if emp.created_at else "N/A"
        ])
    
    return output.getvalue()
