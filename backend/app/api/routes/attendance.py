from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Attendance, Student, Classroom
from app.schemas.schemas import AttendanceSaveBatch
from datetime import datetime, date

router = APIRouter()

@router.get("")
def get_attendance_records(classroom_id: str, subject_id: str, date_str: str, db: Session = Depends(get_db)):
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format, use YYYY-MM-DD")
        
    students = db.query(Student).filter(Student.classroom_id == classroom_id).all()
    
    result = []
    for s in students:
        att = db.query(Attendance).filter(
            Attendance.student_id == s.id,
            Attendance.class_id == classroom_id,
            Attendance.subject_id == subject_id,
            Attendance.date == dt
        ).first()
        
        status = att.status if att else "Present" # default to Present
        result.append({
            "studentId": s.id,
            "studentName": s.name,
            "rollNo": s.roll_no,
            "status": status
        })
        
    return result

@router.post("")
def save_attendance(payload: AttendanceSaveBatch, db: Session = Depends(get_db)):
    try:
        dt = datetime.strptime(payload.date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format, use YYYY-MM-DD")

    for rec in payload.records:
        # Check if record exists
        existing = db.query(Attendance).filter(
            Attendance.student_id == rec.student_id,
            Attendance.class_id == payload.class_id,
            Attendance.subject_id == payload.subject_id,
            Attendance.date == dt
        ).first()
        
        if existing:
            existing.status = rec.status
        else:
            new_record = Attendance(
                student_id=rec.student_id,
                class_id=payload.class_id,
                subject_id=payload.subject_id,
                date=dt,
                status=rec.status
            )
            db.add(new_record)
            
    db.commit()
    return {"message": "Attendance records saved successfully"}

@router.get("/student/{student_id}")
def get_student_attendance(student_id: str, db: Session = Depends(get_db)):
    records = db.query(Attendance).filter(Attendance.student_id == student_id).all()
    result = []
    for r in records:
        result.append({
            "id": r.id,
            "date": str(r.date),
            "status": r.status,
            "subject": r.subject.name if r.subject else "",
            "subjectCode": r.subject.code if r.subject else ""
        })
    return result
