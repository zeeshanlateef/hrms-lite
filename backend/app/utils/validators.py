import re

def validate_email_format(email: str) -> bool:
    """
    Simple regex validation for email addresses.
    Note: Pydantic's EmailStr is used in schemas, but this remains for extra utility.
    """
    regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$'
    return re.search(regex, email) is not None

def validate_employee_id(emp_id: str) -> bool:
    """
    Ensures employee ID follows a specific pattern if required.
    Example: EMP-XXXX
    """
    # For now, just ensure it's not empty and has reasonable length
    return len(emp_id) >= 3 and len(emp_id) <= 50
