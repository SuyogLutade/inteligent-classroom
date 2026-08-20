from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Announcement, Classroom
from app.schemas.schemas import AnnouncementCreate
from datetime import datetime
from typing import Optional

router = APIRouter()

@router.get("")
def get_announcements(role: Optional[str] = None, classroom_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Announcement)
    
    # Filter by target role and classroom
    if role:
        if role == "student" and classroom_id:
            query = query.filter(
                (Announcement.target_role == "all") | 
                ((Announcement.target_role == "student") & ((Announcement.target_class_id.is_(None)) | (Announcement.target_class_id == classroom_id)))
            )
        elif role == "teacher":
            query = query.filter(Announcement.target_role.in_(["all", "teacher"]))
            
    announcements = query.order_by(Announcement.created_at.desc()).all()
    result = []
    for a in announcements:
        # Load class name if any
        class_name = None
        if a.target_class_id:
            c = db.query(Classroom).filter(Classroom.id == a.target_class_id).first()
            if c:
                class_name = c.name
                
        result.append({
            "id": a.id,
            "title": a.title,
            "content": a.content,
            "author": a.author,
            "createdAt": str(a.created_at.date()),
            "priority": a.priority,
            "targetRole": a.target_role,
            "classroomId": a.target_class_id,
            "classroomName": class_name
        })
        
    return result

@router.post("")
def create_announcement(payload: AnnouncementCreate, db: Session = Depends(get_db)):
    ann = Announcement(
        title=payload.title,
        content=payload.content,
        author=payload.author,
        priority=payload.priority,
        target_role=payload.target_role,
        target_class_id=payload.target_class_id,
        created_at=datetime.utcnow()
    )
    db.add(ann)
    db.commit()
    return {"message": "Announcement created successfully", "id": ann.id}
