from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Notification
from app.schemas.schemas import NotificationCreate
from typing import List, Optional

router = APIRouter()

@router.get("")
def get_notifications(user_id: str, db: Session = Depends(get_db)):
    notifs = db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.id.desc()).all()
    result = []
    for n in notifs:
        result.append({
            "id": n.id,
            "userId": n.user_id,
            "type": n.type,
            "message": n.message,
            "time": n.time,
            "read": n.read,
            "severity": n.severity
        })
    return result

@router.post("")
def create_notification(payload: NotificationCreate, db: Session = Depends(get_db)):
    notif = Notification(
        user_id=payload.user_id,
        type=payload.type,
        message=payload.message,
        time="Just now",
        read=False,
        severity=payload.severity
    )
    db.add(notif)
    db.commit()
    return {"message": "Notification created successfully", "id": notif.id}

@router.put("/{notification_id}/read")
def mark_as_read(notification_id: int, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notif.read = True
    db.commit()
    return {"message": "Notification marked as read"}
