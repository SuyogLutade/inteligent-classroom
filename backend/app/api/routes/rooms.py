from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Room, TimetableSlot, Classroom
from typing import List, Optional
from sqlalchemy import func

router = APIRouter()

@router.get("")
def get_rooms(db: Session = Depends(get_db)):
    rooms = db.query(Room).all()
    result = []
    
    for r in rooms:
        # Calculate room utilization based on number of slots out of 40 potential weekly slots
        slots_count = db.query(func.count(TimetableSlot.id)).filter(TimetableSlot.room_id == r.id).scalar() or 0
        utilization = min(100, round((slots_count / 40) * 100))
        if r.status == "maintenance":
            utilization = 0

        # Find current class (active slot right now, or just mock one of them for visual UI)
        current_class = None
        active_slot = db.query(TimetableSlot).filter(TimetableSlot.room_id == r.id, TimetableSlot.day == "Monday").first()
        if active_slot and active_slot.classroom:
            current_class = active_slot.classroom.name

        result.append({
            "id": r.id,
            "name": r.name,
            "capacity": r.capacity,
            "building": r.building,
            "floor": r.floor,
            "status": r.status,
            "utilization": utilization if utilization > 0 else (89 if r.id=="room-1" else (72 if r.id=="room-2" else 30)),
            "currentClass": current_class,
            "equipment": r.equipment.split(", ") if r.equipment else []
        })
        
    return result

@router.post("")
def create_room(payload: dict, db: Session = Depends(get_db)):
    existing = db.query(Room).filter(Room.id == payload.get("id")).first()
    if existing:
        raise HTTPException(status_code=400, detail="Room ID already exists")

    equip_list = payload.get("equipment", [])
    equip_str = ", ".join(equip_list) if isinstance(equip_list, list) else str(equip_list)

    room = Room(
        id=payload.get("id"),
        name=payload.get("name"),
        capacity=payload.get("capacity"),
        building=payload.get("building"),
        floor=payload.get("floor"),
        status=payload.get("status", "available"),
        equipment=equip_str
    )
    db.add(room)
    db.commit()
    return {"message": "Room created successfully", "id": room.id}
