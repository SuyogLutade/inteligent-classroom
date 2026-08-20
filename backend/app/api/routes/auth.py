from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Student, Teacher, Department
from app.schemas.schemas import LoginRequest, LoginResponse

router = APIRouter()

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email = payload.email
    password = payload.password

    # 1. Check Admin (hardcoded for prototype/demo)
    if email == "admin@smartclass.edu" and password == "admin123":
        admin_user = {
            "id": "admin-1",
            "name": "Dr. Priya Nair",
            "email": "admin@smartclass.edu",
            "role": "admin",
            "designation": "HOD & Administrator",
            "department": "Computer Science & Engineering",
        }
        return {"user": admin_user, "token": "admin-jwt-token"}

    # 2. Check Teacher
    teacher = db.query(Teacher).filter(Teacher.email == email).first()
    if teacher:
        if teacher.password != password:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
        # Load department name
        dept = db.query(Department).filter(Department.id == teacher.department_id).first()
        dept_name = dept.name if dept else "Computer Science & Engineering"

        teacher_user = {
            "id": teacher.id,
            "name": teacher.name,
            "email": teacher.email,
            "role": "teacher",
            "designation": "Assistant Professor",
            "department": dept_name,
            "phone": teacher.phone,
            "experience": teacher.experience,
        }
        return {"user": teacher_user, "token": f"teacher-token-{teacher.id}"}

    # 3. Check Student
    student = db.query(Student).filter(Student.email == email).first()
    if student:
        if student.password != password:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
        student_user = {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "role": "student",
            "designation": "B.Tech Student",
            "rollNo": student.roll_no,
            "classroom": student.classroom_id,
            "phone": student.phone,
        }
        return {"user": student_user, "token": f"student-token-{student.id}"}

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
