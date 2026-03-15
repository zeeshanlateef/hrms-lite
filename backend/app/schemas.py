from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, date
from typing import List, Optional

# Shared properties
class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Attendance Schemas
class AttendanceBase(BaseModel):
    employee_id: str
    date: date
    status: str = Field(..., pattern="^(Present|Absent)$")

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int
    employee_name: Optional[str] = None # For frontend display convenience

    class Config:
        from_attributes = True

# Statistics Schmea
class DashboardStats(BaseModel):
    total_employees: int
    total_attendance: int
    present_today: int
    absent_today: int
