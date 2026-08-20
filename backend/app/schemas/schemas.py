from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date, datetime

class UserBase(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    user: dict  # safe user info
    token: str

class DepartmentBase(BaseModel):
    id: str
    name: str
    code: str
    hod: str

    class Config:
        from_attributes = True

class SubjectBase(BaseModel):
    id: str
    name: str
    code: str
    department_id: str
    credits: int

    class Config:
        from_attributes = True

class TeacherBase(BaseModel):
    id: str
    name: str
    email: EmailStr
    department_id: str
    experience: int
    phone: str

    class Config:
        from_attributes = True

class ClassroomBase(BaseModel):
    id: str
    name: str
    section: str
    batch: str
    department_id: str
    semester: int
    strength: int
    class_teacher_id: Optional[str] = None

    class Config:
        from_attributes = True

class ClassroomCreate(BaseModel):
    id: str
    name: str
    section: str
    batch: str
    department_id: str
    semester: int
    class_teacher_id: Optional[str] = None

class StudentBase(BaseModel):
    id: str
    name: str
    email: EmailStr
    roll_no: str
    classroom_id: Optional[str] = None
    phone: str
    focus_subject_id: Optional[str] = None

    class Config:
        from_attributes = True

class EnrollmentBase(BaseModel):
    id: int
    student_id: str
    class_id: str
    academic_year: str
    semester: int
    status: str

    class Config:
        from_attributes = True

class RoomBase(BaseModel):
    id: str
    name: str
    capacity: int
    building: str
    floor: int
    status: str
    equipment: Optional[str] = None

    class Config:
        from_attributes = True

class TimetableSlotBase(BaseModel):
    id: int
    class_id: str
    subject_id: str
    teacher_id: str
    room_id: str
    day: str
    start_time: str
    end_time: str
    academic_year: str

    class Config:
        from_attributes = True

class TimetableSlotCreate(BaseModel):
    class_id: str
    subject_id: str
    teacher_id: str
    room_id: str
    day: str
    start_time: str
    end_time: str
    academic_year: Optional[str] = "2025-2026"

class AttendanceBase(BaseModel):
    id: int
    student_id: str
    class_id: str
    subject_id: str
    date: date
    status: str

    class Config:
        from_attributes = True

class AttendanceCreateSingle(BaseModel):
    student_id: str
    status: str

class AttendanceSaveBatch(BaseModel):
    class_id: str
    subject_id: str
    date: str  # YYYY-MM-DD
    records: List[AttendanceCreateSingle]

class AssignmentBase(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    class_id: str
    subject_id: str
    teacher_id: str
    due_date: date
    max_marks: int
    status: str

    class Config:
        from_attributes = True

class AssignmentCreate(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    class_id: str
    subject_id: str
    teacher_id: str
    due_date: str  # YYYY-MM-DD
    max_marks: Optional[int] = 100

class SubmissionBase(BaseModel):
    id: int
    assignment_id: str
    student_id: str
    submitted_at: datetime
    marks_obtained: Optional[float] = None
    feedback: Optional[str] = None
    status: str

    class Config:
        from_attributes = True

class SubmissionSubmit(BaseModel):
    assignment_id: str
    student_id: str

class SubmissionGrade(BaseModel):
    marks_obtained: float
    feedback: Optional[str] = None

class PerformanceRecordBase(BaseModel):
    id: int
    student_id: str
    class_id: str
    subject_id: str
    assessment_name: str
    marks_obtained: float
    max_marks: float
    teacher_id: str
    date: date

    class Config:
        from_attributes = True

class PerformanceRecordCreateSingle(BaseModel):
    student_id: str
    marks_obtained: float

class PerformanceSaveBatch(BaseModel):
    class_id: str
    subject_id: str
    assessment_name: str
    max_marks: float
    teacher_id: str
    date: str  # YYYY-MM-DD
    records: List[PerformanceRecordCreateSingle]

class AnnouncementBase(BaseModel):
    id: int
    title: str
    content: str
    author: str
    created_at: datetime
    priority: str
    target_role: str
    target_class_id: Optional[str] = None

    class Config:
        from_attributes = True

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    author: str
    priority: Optional[str] = "medium"
    target_role: Optional[str] = "all"
    target_class_id: Optional[str] = None

class NotificationBase(BaseModel):
    id: int
    user_id: str
    type: str
    message: str
    time: str
    read: bool
    severity: str

    class Config:
        from_attributes = True

class NotificationCreate(BaseModel):
    user_id: str
    type: str
    message: str
    severity: Optional[str] = "info"
