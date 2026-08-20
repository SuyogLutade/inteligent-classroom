from sqlalchemy import Column, String, Integer, Float, Boolean, Date, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database.connection import Base
from datetime import datetime

# Junction table for Class <=> Subject
class ClassSubject(Base):
    __tablename__ = "class_subjects"
    id = Column(Integer, primary_key=True, autoincrement=True)
    class_id = Column(String, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(String, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)

class Department(Base):
    __tablename__ = "departments"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False, unique=True)
    hod = Column(String, nullable=False)

    subjects = relationship("Subject", back_populates="department", cascade="all, delete-orphan")
    teachers = relationship("Teacher", back_populates="department", cascade="all, delete-orphan")
    classrooms = relationship("Classroom", back_populates="department", cascade="all, delete-orphan")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False, unique=True)
    department_id = Column(String, ForeignKey("departments.id", ondelete="CASCADE"), nullable=False)
    credits = Column(Integer, nullable=False)

    department = relationship("Department", back_populates="subjects")
    timetable_slots = relationship("TimetableSlot", back_populates="subject", cascade="all, delete-orphan")
    attendances = relationship("Attendance", back_populates="subject", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="subject", cascade="all, delete-orphan")
    performance_records = relationship("PerformanceRecord", back_populates="subject", cascade="all, delete-orphan")

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    department_id = Column(String, ForeignKey("departments.id", ondelete="CASCADE"), nullable=False)
    experience = Column(Integer, nullable=False)
    phone = Column(String, nullable=False)

    department = relationship("Department", back_populates="teachers")
    classes_taught = relationship("Classroom", back_populates="class_teacher")
    timetable_slots = relationship("TimetableSlot", back_populates="teacher", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="teacher", cascade="all, delete-orphan")
    performance_records = relationship("PerformanceRecord", back_populates="teacher", cascade="all, delete-orphan")

class Classroom(Base):
    __tablename__ = "classrooms"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    section = Column(String, nullable=False)
    batch = Column(String, nullable=False)
    department_id = Column(String, ForeignKey("departments.id", ondelete="CASCADE"), nullable=False)
    semester = Column(Integer, nullable=False)
    strength = Column(Integer, default=0)
    class_teacher_id = Column(String, ForeignKey("teachers.id", ondelete="SET NULL"), nullable=True)

    department = relationship("Department", back_populates="classrooms")
    class_teacher = relationship("Teacher", back_populates="classes_taught")
    students = relationship("Student", back_populates="classroom")
    enrollments = relationship("Enrollment", back_populates="classroom", cascade="all, delete-orphan")
    timetable_slots = relationship("TimetableSlot", back_populates="classroom", cascade="all, delete-orphan")
    attendances = relationship("Attendance", back_populates="classroom", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="classroom", cascade="all, delete-orphan")
    performance_records = relationship("PerformanceRecord", back_populates="classroom", cascade="all, delete-orphan")

class Student(Base):
    __tablename__ = "students"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    roll_no = Column(String, nullable=False, unique=True)
    classroom_id = Column(String, ForeignKey("classrooms.id", ondelete="SET NULL"), nullable=True)
    phone = Column(String, nullable=False)
    focus_subject_id = Column(String, ForeignKey("subjects.id", ondelete="SET NULL"), nullable=True)

    classroom = relationship("Classroom", back_populates="students")
    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")
    attendances = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="student", cascade="all, delete-orphan")
    performance_records = relationship("PerformanceRecord", back_populates="student", cascade="all, delete-orphan")

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    class_id = Column(String, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False)
    academic_year = Column(String, nullable=False)
    semester = Column(Integer, nullable=False)
    status = Column(String, default="active")  # active, completed, dropped

    student = relationship("Student", back_populates="enrollments")
    classroom = relationship("Classroom", back_populates="enrollments")

class Room(Base):
    __tablename__ = "rooms"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False)
    building = Column(String, nullable=False)
    floor = Column(Integer, nullable=False)
    status = Column(String, default="available")  # active, available, maintenance
    equipment = Column(String, nullable=True)  # Comma-separated list e.g., "Projector, AC"

    timetable_slots = relationship("TimetableSlot", back_populates="room", cascade="all, delete-orphan")

class TimetableSlot(Base):
    __tablename__ = "timetable_slots"
    id = Column(Integer, primary_key=True, autoincrement=True)
    class_id = Column(String, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(String, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    teacher_id = Column(String, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    room_id = Column(String, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    day = Column(String, nullable=False)  # Monday, Tuesday, etc.
    start_time = Column(String, nullable=False)  # HH:MM
    end_time = Column(String, nullable=False)  # HH:MM
    academic_year = Column(String, default="2025-2026")

    classroom = relationship("Classroom", back_populates="timetable_slots")
    subject = relationship("Subject", back_populates="timetable_slots")
    teacher = relationship("Teacher", back_populates="timetable_slots")
    room = relationship("Room", back_populates="timetable_slots")

class Attendance(Base):
    __tablename__ = "attendances"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    class_id = Column(String, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(String, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False)  # Present, Absent, Late

    student = relationship("Student", back_populates="attendances")
    classroom = relationship("Classroom", back_populates="attendances")
    subject = relationship("Subject", back_populates="attendances")

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    class_id = Column(String, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(String, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    teacher_id = Column(String, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    due_date = Column(Date, nullable=False)
    max_marks = Column(Integer, default=100)
    status = Column(String, default="active")  # active, closed, overdue

    classroom = relationship("Classroom", back_populates="assignments")
    subject = relationship("Subject", back_populates="assignments")
    teacher = relationship("Teacher", back_populates="assignments")
    submissions = relationship("Submission", back_populates="assignment", cascade="all, delete-orphan")

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    assignment_id = Column(String, ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(String, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    marks_obtained = Column(Float, nullable=True)
    feedback = Column(String, nullable=True)
    status = Column(String, default="submitted")  # submitted, evaluated, late

    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("Student", back_populates="submissions")

class PerformanceRecord(Base):
    __tablename__ = "performance_records"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    class_id = Column(String, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(String, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    assessment_name = Column(String, nullable=False)  # Test 1, Test 2, Mid-sem, etc.
    marks_obtained = Column(Float, nullable=False)
    max_marks = Column(Float, nullable=False)
    teacher_id = Column(String, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)

    student = relationship("Student", back_populates="performance_records")
    classroom = relationship("Classroom", back_populates="performance_records")
    subject = relationship("Subject", back_populates="performance_records")
    teacher = relationship("Teacher", back_populates="performance_records")

class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    author = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    priority = Column(String, default="medium")  # high, medium, low
    target_role = Column(String, default="all")  # all, teacher, student
    target_class_id = Column(String, ForeignKey("classrooms.id", ondelete="SET NULL"), nullable=True)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, nullable=False)  # Target user's id (e.g. admin-1, t-1, stu-1)
    type = Column(String, nullable=False)  # timetable, attendance, system, academic, etc.
    message = Column(String, nullable=False)
    time = Column(String, nullable=False)  # relative time text e.g. "10 min ago"
    read = Column(Boolean, default=False)
    severity = Column(String, default="info")  # info, warning, critical
