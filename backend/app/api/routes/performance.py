from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import PerformanceRecord, Student, Classroom, Subject
from app.schemas.schemas import PerformanceSaveBatch
from datetime import datetime, date
from typing import Optional
from sqlalchemy import func

router = APIRouter()

@router.get("")
def get_performance_records(classroom_id: str, subject_id: str, assessment_name: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(PerformanceRecord).filter(
        PerformanceRecord.class_id == classroom_id,
        PerformanceRecord.subject_id == subject_id
    )
    if assessment_name:
        query = query.filter(PerformanceRecord.assessment_name == assessment_name)
        
    records = query.all()
    students = db.query(Student).filter(Student.classroom_id == classroom_id).all()
    
    result = []
    for s in students:
        # Filter for this student's assessment
        # If assessment_name is given, we find that specific one.
        # Otherwise we list all assessments of the student in this subject
        s_records = [r for r in records if r.student_id == s.id]
        
        if assessment_name:
            rec = s_records[0] if s_records else None
            result.append({
                "studentId": s.id,
                "studentName": s.name,
                "rollNo": s.roll_no,
                "marksObtained": rec.marks_obtained if rec else None,
                "maxMarks": rec.max_marks if rec else 100
            })
        else:
            result.append({
                "studentId": s.id,
                "studentName": s.name,
                "rollNo": s.roll_no,
                "marks": [{
                    "id": r.id,
                    "assessment": r.assessment_name,
                    "score": r.marks_obtained,
                    "max": r.max_marks,
                    "date": str(r.date)
                } for r in s_records]
            })
            
    return result

@router.post("")
def save_performance_batch(payload: PerformanceSaveBatch, db: Session = Depends(get_db)):
    try:
        dt = datetime.strptime(payload.date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format, use YYYY-MM-DD")

    for rec in payload.records:
        existing = db.query(PerformanceRecord).filter(
            PerformanceRecord.student_id == rec.student_id,
            PerformanceRecord.class_id == payload.class_id,
            PerformanceRecord.subject_id == payload.subject_id,
            PerformanceRecord.assessment_name == payload.assessment_name
        ).first()
        
        if existing:
            existing.marks_obtained = rec.marks_obtained
            existing.max_marks = payload.max_marks
            existing.date = dt
        else:
            new_rec = PerformanceRecord(
                student_id=rec.student_id,
                class_id=payload.class_id,
                subject_id=payload.subject_id,
                assessment_name=payload.assessment_name,
                marks_obtained=rec.marks_obtained,
                max_marks=payload.max_marks,
                teacher_id=payload.teacher_id,
                date=dt
            )
            db.add(new_rec)
            
    db.commit()
    return {"message": "Performance marks saved successfully"}

@router.get("/student/{student_id}")
def get_student_performance(student_id: str, db: Session = Depends(get_db)):
    records = db.query(PerformanceRecord).filter(PerformanceRecord.student_id == student_id).all()
    
    # Calculate subject-wise performance averages
    subject_marks = {}
    for r in records:
        sub_id = r.subject_id
        if sub_id not in subject_marks:
            subject_marks[sub_id] = []
        subject_marks[sub_id].append(r)
        
    result = []
    for sub_id, recs in subject_marks.items():
        sub = db.query(Subject).filter(Subject.id == sub_id).first()
        if sub:
            avg_score = sum(r.marks_obtained for r in recs) / len(recs)
            # Find trend: compare last assessment with average or previous
            recs_sorted = sorted(recs, key=lambda x: x.date)
            trend = 0
            if len(recs_sorted) >= 2:
                trend = round(recs_sorted[-1].marks_obtained - recs_sorted[-2].marks_obtained)
                
            result.append({
                "subjectId": sub_id,
                "subjectName": sub.name,
                "subjectCode": sub.code,
                "average": round(avg_score, 1),
                "trend": trend,
                "marks": [
                    {"assessment": r.assessment_name, "score": r.marks_obtained, "max": r.max_marks}
                    for r in recs_sorted
                ]
            })
            
    return result
