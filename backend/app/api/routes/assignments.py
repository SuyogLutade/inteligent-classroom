from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Assignment, Submission, Student, Classroom
from app.schemas.schemas import AssignmentCreate, SubmissionGrade
from datetime import datetime, date
from typing import Optional

router = APIRouter()

@router.get("")
def get_assignments(classroom_id: Optional[str] = None, teacher_id: Optional[str] = None, student_id: Optional[str] = None, db: Session = Depends(get_db)):
    if student_id:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        classroom_id = student.classroom_id

    query = db.query(Assignment)
    if classroom_id:
        query = query.filter(Assignment.class_id == classroom_id)
    if teacher_id:
        query = query.filter(Assignment.teacher_id == teacher_id)

    assignments = query.all()
    result = []
    
    for a in assignments:
        submission_data = None
        if student_id:
            sub = db.query(Submission).filter(Submission.assignment_id == a.id, Submission.student_id == student_id).first()
            if sub:
                submission_data = {
                    "id": sub.id,
                    "submittedAt": str(sub.submitted_at),
                    "marksObtained": sub.marks_obtained,
                    "feedback": sub.feedback,
                    "status": sub.status
                }
                
        # Calculate rates for teachers
        submission_rate = 0
        avg_score = 0
        total_students = db.query(Student).filter(Student.classroom_id == a.class_id).count()
        submissions_count = db.query(Submission).filter(Submission.assignment_id == a.id).count()
        if total_students > 0:
            submission_rate = round((submissions_count / total_students) * 100)
            
        evaluated_subs = db.query(Submission).filter(Submission.assignment_id == a.id, Submission.marks_obtained.isnot(None)).all()
        if evaluated_subs:
            avg_score = round(sum(s.marks_obtained for s in evaluated_subs) / len(evaluated_subs))

        result.append({
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "dueDate": str(a.due_date),
            "maxMarks": a.max_marks,
            "status": a.status,
            "classroom": a.classroom.name if a.classroom else "",
            "classroomId": a.class_id,
            "subject": a.subject.name if a.subject else "",
            "subjectCode": a.subject.code if a.subject else "",
            "teacherName": a.teacher.name if a.teacher else "",
            "submission": submission_data,
            "submissionRate": submission_rate,
            "avgScore": avg_score
        })
        
    return result

@router.post("")
def create_assignment(payload: AssignmentCreate, db: Session = Depends(get_db)):
    try:
        dt = datetime.strptime(payload.due_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format, use YYYY-MM-DD")

    assignment = Assignment(
        id=payload.id,
        title=payload.title,
        description=payload.description,
        class_id=payload.class_id,
        subject_id=payload.subject_id,
        teacher_id=payload.teacher_id,
        due_date=dt,
        max_marks=payload.max_marks,
        status="active"
    )
    db.add(assignment)
    db.commit()
    return {"message": "Assignment created successfully", "id": assignment.id}

@router.post("/{assignment_id}/submit")
def submit_assignment(assignment_id: str, payload: dict, db: Session = Depends(get_db)):
    student_id = payload.get("student_id")
    # Verify assignment exists
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Check if already submitted
    existing = db.query(Submission).filter(Submission.assignment_id == assignment_id, Submission.student_id == student_id).first()
    if existing:
        existing.submitted_at = datetime.utcnow()
        existing.status = "submitted"
    else:
        new_sub = Submission(
            assignment_id=assignment_id,
            student_id=student_id,
            submitted_at=datetime.utcnow(),
            status="submitted"
        )
        db.add(new_sub)
        
    db.commit()
    return {"message": "Assignment submitted successfully"}

@router.get("/{assignment_id}/submissions")
def get_assignment_submissions(assignment_id: str, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    students = db.query(Student).filter(Student.classroom_id == assignment.class_id).all()
    result = []
    
    for s in students:
        sub = db.query(Submission).filter(Submission.assignment_id == assignment_id, Submission.student_id == s.id).first()
        if sub:
            result.append({
                "submissionId": sub.id,
                "studentId": s.id,
                "studentName": s.name,
                "rollNo": s.roll_no,
                "submittedAt": str(sub.submitted_at),
                "marksObtained": sub.marks_obtained,
                "feedback": sub.feedback,
                "status": sub.status
            })
        else:
            result.append({
                "submissionId": None,
                "studentId": s.id,
                "studentName": s.name,
                "rollNo": s.roll_no,
                "submittedAt": None,
                "marksObtained": None,
                "feedback": None,
                "status": "missing"
            })
            
    return result

@router.post("/submissions/{submission_id}/grade")
def grade_submission(submission_id: int, payload: SubmissionGrade, db: Session = Depends(get_db)):
    sub = db.query(Submission).filter(Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    sub.marks_obtained = payload.marks_obtained
    sub.feedback = payload.feedback
    sub.status = "evaluated"
    db.commit()
    return {"message": "Submission evaluated successfully"}
