from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import TimetableSlot, Classroom, Subject, Teacher, Room
from app.schemas.schemas import TimetableSlotCreate
from typing import List, Optional

router = APIRouter()

@router.get("")
def get_timetable(classroom_id: Optional[str] = None, teacher_id: Optional[str] = None, room_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(TimetableSlot)
    if classroom_id:
        query = query.filter(TimetableSlot.class_id == classroom_id)
    if teacher_id:
        query = query.filter(TimetableSlot.teacher_id == teacher_id)
    if room_id:
        query = query.filter(TimetableSlot.room_id == room_id)
        
    slots = query.all()
    all_slots = db.query(TimetableSlot).all() # Load all to detect conflicts dynamically
    
    result = []
    for s in slots:
        has_conflict = False
        conflict_type = None
        conflict_with = None
        
        # Conflict check algorithm
        for other in all_slots:
            if s.id != other.id and s.day == other.day and s.start_time == other.start_time:
                # Faculty conflict
                if s.teacher_id == other.teacher_id:
                    has_conflict = True
                    conflict_type = "faculty"
                    conflict_with = other.id
                    break
                # Room conflict
                if s.room_id == other.room_id:
                    has_conflict = True
                    conflict_type = "room"
                    conflict_with = other.id
                    break
                    
        result.append({
            "id": s.id,
            "day": s.day,
            "startTime": s.start_time,
            "endTime": s.end_time,
            "subject": s.subject.name if s.subject else "Subject",
            "subjectId": s.subject_id,
            "teacher": s.teacher.name if s.teacher else "Teacher",
            "teacherId": s.teacher_id,
            "classroom": s.classroom.name if s.classroom else "Class",
            "classroomId": s.class_id,
            "room": s.room.name if s.room else "Room",
            "roomId": s.room_id,
            "hasConflict": has_conflict,
            "conflictType": conflict_type,
            "conflictWith": conflict_with
        })
        
    return result

@router.post("")
def create_timetable_slot(payload: TimetableSlotCreate, db: Session = Depends(get_db)):
    # Conflict checks
    # Convert string times to easily comparable formats or just check overlap.
    # Check overlapping slots for same teacher
    teacher_conflict = db.query(TimetableSlot).filter(
        TimetableSlot.teacher_id == payload.teacher_id,
        TimetableSlot.day == payload.day,
        TimetableSlot.start_time < payload.end_time,
        TimetableSlot.end_time > payload.start_time
    ).first()
    
    if teacher_conflict:
        teacher_name = teacher_conflict.teacher.name if teacher_conflict.teacher else payload.teacher_id
        raise HTTPException(
            status_code=400,
            detail=f"Faculty conflict: {teacher_name} is already assigned to {teacher_conflict.classroom.name if teacher_conflict.classroom else 'another class'} during this period ({payload.start_time}-{payload.end_time})."
        )
        
    # Check overlapping slots for same room
    room_conflict = db.query(TimetableSlot).filter(
        TimetableSlot.room_id == payload.room_id,
        TimetableSlot.day == payload.day,
        TimetableSlot.start_time < payload.end_time,
        TimetableSlot.end_time > payload.start_time
    ).first()
    
    if room_conflict:
        room_name = room_conflict.room.name if room_conflict.room else payload.room_id
        raise HTTPException(
            status_code=400,
            detail=f"Room conflict: {room_name} is already occupied by {room_conflict.classroom.name if room_conflict.classroom else 'another class'} during this period ({payload.start_time}-{payload.end_time})."
        )

    # Save slot
    slot = TimetableSlot(
        class_id=payload.class_id,
        subject_id=payload.subject_id,
        teacher_id=payload.teacher_id,
        room_id=payload.room_id,
        day=payload.day,
        start_time=payload.start_time,
        end_time=payload.end_time,
        academic_year=payload.academic_year
    )
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return {"message": "Timetable slot scheduled successfully", "id": slot.id}
