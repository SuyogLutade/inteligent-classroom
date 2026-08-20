from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Teacher, Department, Classroom, Subject, TimetableSlot
from typing import List, Optional
from sqlalchemy import func

router = APIRouter()

@router.get("")
def get_teachers(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Teacher)
    if search:
        query = query.filter(Teacher.name.ilike(f"%{search}%"))
    
    teachers = query.all()
    result = []
    
    for t in teachers:
        # Load department name
        dept = db.query(Department).filter(Department.id == t.department_id).first()
        dept_name = dept.name if dept else ""
        
        # Load classrooms taught
        classes_taught = db.query(Classroom).filter(Classroom.class_teacher_id == t.id).all()
        class_ids = [c.id for c in classes_taught]
        
        # Add classes taught from timetable slots
        timetable_classes = db.query(TimetableSlot.class_id).filter(TimetableSlot.teacher_id == t.id).distinct().all()
        for cid_tuple in timetable_classes:
            cid = cid_tuple[0]
            if cid not in class_ids:
                class_ids.append(cid)
                
        classrooms = db.query(Classroom).filter(Classroom.id.in_(class_ids)).all() if class_ids else []
        class_names = [c.name for c in classrooms]

        # Load subjects taught
        subject_ids = db.query(TimetableSlot.subject_id).filter(TimetableSlot.teacher_id == t.id).distinct().all()
        subject_ids = [s[0] for s in subject_ids]
        subjects = db.query(Subject).filter(Subject.id.in_(subject_ids)).all() if subject_ids else []
        subject_names = [s.name for s in subjects]

        result.append({
            "id": t.id,
            "name": t.name,
            "email": t.email,
            "phone": t.phone,
            "department": dept_name,
            "departmentId": t.department_id,
            "experience": t.experience,
            "classes": class_names,
            "subjects": subject_names
        })

    return result

@router.post("")
def create_teacher(payload: dict, db: Session = Depends(get_db)):
    existing = db.query(Teacher).filter(Teacher.email == payload.get("email")).first()
    if existing:
        raise HTTPException(status_code=400, detail="Teacher email already exists")
        
    teacher = Teacher(
        id=payload.get("id"),
        name=payload.get("name"),
        email=payload.get("email"),
        password=payload.get("password", "teacher123"),
        department_id=payload.get("department_id"),
        experience=payload.get("experience", 5),
        phone=payload.get("phone")
    )
    db.add(teacher)
    db.commit()
    return {"message": "Teacher created successfully", "id": teacher.id}
