from sqlalchemy.orm import Session
from app.models.models import (
    Department, Subject, Teacher, Classroom, Student, Enrollment,
    ClassSubject, Room, TimetableSlot, Attendance, Assignment,
    Submission, PerformanceRecord, Announcement, Notification
)
from datetime import date, datetime, timedelta

def seed_database(db: Session):
    # Check if database is already seeded
    if db.query(Department).first():
        print("Database already seeded. Skipping.")
        return

    print("Seeding database...")

    # 1. DEPARTMENTS
    depts = [
        Department(id="dept-1", name="Computer Science & Engineering", code="CSE", hod="Dr. Priya Nair"),
        Department(id="dept-2", name="Electronics & Communication", code="ECE", hod="Dr. Ramesh Gupta"),
        Department(id="dept-3", name="Mechanical Engineering", code="ME", hod="Prof. Suresh Patel"),
    ]
    for d in depts:
        db.add(d)
    db.commit()

    # 2. SUBJECTS
    subs = [
        Subject(id="sub-1", name="Data Structures & Algorithms", code="DSA", department_id="dept-1", credits=4),
        Subject(id="sub-2", name="Database Management Systems", code="DBMS", department_id="dept-1", credits=3),
        Subject(id="sub-3", name="Operating Systems", code="OS", department_id="dept-1", credits=3),
        Subject(id="sub-4", name="Computer Networks", code="CN", department_id="dept-1", credits=3),
        Subject(id="sub-5", name="Software Engineering", code="SE", department_id="dept-1", credits=3),
        Subject(id="sub-6", name="Machine Learning", code="ML", department_id="dept-1", credits=4),
    ]
    for s in subs:
        db.add(s)
    db.commit()

    # 3. TEACHERS
    teachers_list = [
        Teacher(id="t-1", name="Prof. Arjun Sharma", email="arjun.sharma@smartclass.edu", password="teacher123", department_id="dept-1", experience=8, phone="+91 98765 43210"),
        Teacher(id="t-2", name="Dr. Meera Krishnan", email="meera.k@smartclass.edu", password="teacher123", department_id="dept-1", experience=12, phone="+91 98765 43211"),
        Teacher(id="t-3", name="Prof. Vikram Singh", email="vikram.singh@smartclass.edu", password="teacher123", department_id="dept-1", experience=6, phone="+91 98765 43212"),
    ]
    for t in teachers_list:
        db.add(t)
    db.commit()

    # 4. CLASSROOMS
    classes = [
        Classroom(id="cls-1", name="CSE-A", section="A", batch="2022-26", department_id="dept-1", semester=6, strength=60, class_teacher_id="t-1"),
        Classroom(id="cls-2", name="CSE-B", section="B", batch="2022-26", department_id="dept-1", semester=6, strength=58, class_teacher_id="t-2"),
        Classroom(id="cls-3", name="CSE-C", section="C", batch="2022-26", department_id="dept-1", semester=6, strength=55, class_teacher_id="t-3"),
    ]
    for c in classes:
        db.add(c)
    db.commit()

    # 5. CLASS SUBJECTS ASSIGNMENTS
    cs_pairs = [
        ("cls-1", "sub-1"), ("cls-1", "sub-2"), ("cls-1", "sub-3"), ("cls-1", "sub-4"), ("cls-1", "sub-5"), ("cls-1", "sub-6"),
        ("cls-2", "sub-1"), ("cls-2", "sub-4"), ("cls-2", "sub-5"), ("cls-2", "sub-6"),
        ("cls-3", "sub-1"), ("cls-3", "sub-2"), ("cls-3", "sub-3"), ("cls-3", "sub-4"), ("cls-3", "sub-5"),
    ]
    for cid, sid in cs_pairs:
        db.add(ClassSubject(class_id=cid, subject_id=sid))
    db.commit()

    # 6. STUDENTS
    students_list = [
        # CSE-A Students
        Student(id="stu-1", name="Rahul Sharma", email="rahul.sharma@student.edu", password="student123", roll_no="CSE22A001", classroom_id="cls-1", phone="+91 99000 11001", focus_subject_id="sub-2"),
        Student(id="stu-2", name="Priya Mehta", email="priya.mehta@student.edu", password="student123", roll_no="CSE22A002", classroom_id="cls-1", phone="+91 99000 11002"),
        Student(id="stu-3", name="Aryan Kapoor", email="aryan.kapoor@student.edu", password="student123", roll_no="CSE22A003", classroom_id="cls-1", phone="+91 99000 11003", focus_subject_id="sub-2"),
        Student(id="stu-4", name="Sneha Reddy", email="sneha.reddy@student.edu", password="student123", roll_no="CSE22A004", classroom_id="cls-1", phone="+91 99000 11004"),
        
        # CSE-C Students
        Student(id="stu-5", name="Amit Verma", email="amit.verma@student.edu", password="student123", roll_no="CSE22C001", classroom_id="cls-3", phone="+91 99000 11005", focus_subject_id="sub-2"),
        Student(id="stu-6", name="Divya Nair", email="divya.nair@student.edu", password="student123", roll_no="CSE22C002", classroom_id="cls-3", phone="+91 99000 11006", focus_subject_id="sub-2"),
    ]
    
    # Generate 15 extra students to populate classes
    for i in range(7, 25):
        cid = "cls-1" if i < 13 else ("cls-2" if i < 19 else "cls-3")
        name = f"Student {i}"
        roll = f"CSE22{'A' if cid=='cls-1' else ('B' if cid=='cls-2' else 'C')}00{i}"
        students_list.append(
            Student(id=f"stu-{i}", name=name, email=f"student{i}@student.edu", password="student123", roll_no=roll, classroom_id=cid, phone=f"+91 99000 110{i:02d}")
        )

    for s in students_list:
        db.add(s)
    db.commit()

    # 7. ENROLLMENTS
    for s in students_list:
        if s.classroom_id:
            db.add(Enrollment(student_id=s.id, class_id=s.classroom_id, academic_year="2025-2026", semester=6, status="active"))
    db.commit()

    # 8. ROOMS
    rooms_list = [
        Room(id="room-1", name="Room 101", building="Block A", floor=1, capacity=60, status="active", equipment="Projector, Whiteboard, AC"),
        Room(id="room-2", name="Room 102", building="Block A", floor=1, capacity=60, status="active", equipment="Projector, Whiteboard, AC"),
        Room(id="room-3", name="Room 103", building="Block A", floor=1, capacity=40, status="available", equipment="Projector, Sound System, AC"),
        Room(id="room-4", name="Room 201", building="Block B", floor=2, capacity=60, status="active", equipment="Smartboard, Whiteboard, AC"),
        Room(id="room-5", name="Room 202", building="Block B", floor=2, capacity=80, status="available", equipment="Dual Projectors, Mic System, AC"),
        Room(id="room-6", name="Lab 301", building="Block C", floor=3, capacity=30, status="active", equipment="30 PCs, Server, AC, Projector"),
        Room(id="room-7", name="Room 207", building="Block B", floor=2, capacity=40, status="available", equipment="Whiteboard, Fan"),
        Room(id="room-8", name="Room 301", building="Block C", floor=3, capacity=60, status="maintenance", equipment="Projector, Whiteboard, AC"),
    ]
    for r in rooms_list:
        db.add(r)
    db.commit()

    # 9. TIMETABLE
    slots = [
        # Monday
        TimetableSlot(class_id="cls-1", subject_id="sub-1", teacher_id="t-1", room_id="room-1", day="Monday", start_time="09:00", end_time="10:00"),
        TimetableSlot(class_id="cls-1", subject_id="sub-2", teacher_id="t-2", room_id="room-1", day="Monday", start_time="10:00", end_time="11:00"),
        TimetableSlot(class_id="cls-2", subject_id="sub-4", teacher_id="t-3", room_id="room-2", day="Monday", start_time="11:00", end_time="12:00"),
        # Monday conflict
        TimetableSlot(class_id="cls-2", subject_id="sub-6", teacher_id="t-1", room_id="room-4", day="Monday", start_time="11:00", end_time="12:00"),
        TimetableSlot(class_id="cls-3", subject_id="sub-1", teacher_id="t-1", room_id="room-2", day="Monday", start_time="11:00", end_time="12:00"),
        TimetableSlot(class_id="cls-3", subject_id="sub-3", teacher_id="t-2", room_id="room-4", day="Monday", start_time="14:00", end_time="15:00"),
        TimetableSlot(class_id="cls-1", subject_id="sub-5", teacher_id="t-3", room_id="room-1", day="Monday", start_time="15:00", end_time="16:00"),
        # Tuesday
        TimetableSlot(class_id="cls-2", subject_id="sub-2", teacher_id="t-2", room_id="room-2", day="Tuesday", start_time="09:00", end_time="10:00"),
        TimetableSlot(class_id="cls-3", subject_id="sub-1", teacher_id="t-1", room_id="room-4", day="Tuesday", start_time="10:00", end_time="11:00"),
        TimetableSlot(class_id="cls-1", subject_id="sub-3", teacher_id="t-2", room_id="room-1", day="Tuesday", start_time="11:00", end_time="12:00"),
        # Tuesday room conflict
        TimetableSlot(class_id="cls-1", subject_id="sub-4", teacher_id="t-3", room_id="room-2", day="Tuesday", start_time="14:00", end_time="15:00"),
        TimetableSlot(class_id="cls-2", subject_id="sub-5", teacher_id="t-1", room_id="room-2", day="Tuesday", start_time="14:00", end_time="15:00"),
        # Wednesday
        TimetableSlot(class_id="cls-1", subject_id="sub-1", teacher_id="t-1", room_id="room-1", day="Wednesday", start_time="09:00", end_time="10:00"),
        TimetableSlot(class_id="cls-2", subject_id="sub-3", teacher_id="t-2", room_id="room-2", day="Wednesday", start_time="10:00", end_time="11:00"),
        TimetableSlot(class_id="cls-3", subject_id="sub-5", teacher_id="t-3", room_id="room-4", day="Wednesday", start_time="11:00", end_time="12:00"),
        TimetableSlot(class_id="cls-1", subject_id="sub-6", teacher_id="t-1", room_id="room-1", day="Wednesday", start_time="14:00", end_time="15:00"),
        # Thursday
        TimetableSlot(class_id="cls-3", subject_id="sub-2", teacher_id="t-2", room_id="room-4", day="Thursday", start_time="09:00", end_time="10:00"),
        TimetableSlot(class_id="cls-1", subject_id="sub-4", teacher_id="t-3", room_id="room-1", day="Thursday", start_time="10:00", end_time="11:00"),
        TimetableSlot(class_id="cls-2", subject_id="sub-1", teacher_id="t-1", room_id="room-2", day="Thursday", start_time="11:00", end_time="12:00"),
        # Friday
        TimetableSlot(class_id="cls-2", subject_id="sub-5", teacher_id="t-3", room_id="room-2", day="Friday", start_time="09:00", end_time="10:00"),
        TimetableSlot(class_id="cls-1", subject_id="sub-3", teacher_id="t-2", room_id="room-1", day="Friday", start_time="10:00", end_time="11:00"),
        TimetableSlot(class_id="cls-3", subject_id="sub-6", teacher_id="t-1", room_id="room-4", day="Friday", start_time="11:00", end_time="12:00"),
    ]
    for s in slots:
        db.add(s)
    db.commit()

    # 10. ATTENDANCE HISTORICAL RECORDS
    # Generate 20 dates
    today_dt = date.today()
    dates = [today_dt - timedelta(days=x) for x in range(25) if (today_dt - timedelta(days=x)).weekday() < 5] # Weekdays only
    
    # Target Attendance rates: cls-1: 91%, cls-2: 79%, cls-3: 64%
    # student specific: stu-1 (Rahul Sharma): 62%, stu-2: 94%, stu-3: 78%, stu-4: 88%, stu-5 (Amit): 55%, stu-6: 61%
    import random
    random.seed(42)  # For deterministic seed

    attendance_records = []
    for s in students_list:
        # Determine average rate
        if s.id == "stu-1":
            rate = 0.62
        elif s.id == "stu-2":
            rate = 0.94
        elif s.id == "stu-3":
            rate = 0.78
        elif s.id == "stu-4":
            rate = 0.88
        elif s.id == "stu-5":
            rate = 0.55
        elif s.id == "stu-6":
            rate = 0.61
        elif s.classroom_id == "cls-1":
            rate = 0.92
        elif s.classroom_id == "cls-2":
            rate = 0.79
        else:
            rate = 0.65

        # For student consecutive absences (stu-1 has 4, stu-5 has 6)
        consecutives = 0
        if s.id == "stu-1":
            consecutives = 4
        elif s.id == "stu-5":
            consecutives = 6

        for i, dt in enumerate(dates):
            # If we need consecutive absences at the end (most recent dates)
            if i < consecutives:
                status = "Absent"
            else:
                status = "Present" if random.random() < rate else "Absent"
            
            # Seed for DBMS (sub-2) and DSA (sub-1)
            for sid in ["sub-1", "sub-2"]:
                attendance_records.append(
                    Attendance(student_id=s.id, class_id=s.classroom_id, subject_id=sid, date=dt, status=status)
                )

    db.bulk_save_objects(attendance_records)
    db.commit()

    # 11. ASSIGNMENTS
    asgns = [
        Assignment(id="asgn-1", title="Binary Search Tree Implementation", description="Implement a full BST with insert, delete, and search operations in C++.", class_id="cls-1", subject_id="sub-1", teacher_id="t-1", due_date=date.today() + timedelta(days=6), max_marks=100, status="active"),
        Assignment(id="asgn-2", title="SQL Query Optimization", description="Optimize the given set of SQL queries and explain your approach.", class_id="cls-1", subject_id="sub-2", teacher_id="t-2", due_date=date.today() + timedelta(days=1), max_marks=50, status="active"),
        Assignment(id="asgn-3", title="Process Scheduling Simulation", description="Simulate FCFS, SJF and Round Robin scheduling algorithms.", class_id="cls-1", subject_id="sub-3", teacher_id="t-2", due_date=date.today() + timedelta(days=3), max_marks=75, status="active"),
        Assignment(id="asgn-4", title="ER Diagram for E-Commerce System", description="Design a complete ER diagram for an e-commerce system with at least 8 entities.", class_id="cls-3", subject_id="sub-2", teacher_id="t-2", due_date=date.today() - timedelta(days=1), max_marks=100, status="overdue"),
        Assignment(id="asgn-5", title="Network Protocol Analysis", description="Analyze TCP/IP handshake using Wireshark and document observations.", class_id="cls-2", subject_id="sub-4", teacher_id="t-3", due_date=date.today() + timedelta(days=9), max_marks=50, status="active"),
    ]
    for a in asgns:
        db.add(a)
    db.commit()

    # 12. SUBMISSIONS
    # Seed submissions
    # cls-1 has stu-1, stu-2, stu-3, stu-4 and some others.
    # We will submit for stu-2, stu-4 (present) and occasionally grade.
    submissions = [
        # BST
        Submission(assignment_id="asgn-1", student_id="stu-2", submitted_at=datetime.utcnow() - timedelta(days=2), marks_obtained=92.0, feedback="Excellent code quality.", status="evaluated"),
        Submission(assignment_id="asgn-1", student_id="stu-4", submitted_at=datetime.utcnow() - timedelta(days=1), marks_obtained=85.0, feedback="Good structure.", status="evaluated"),
        Submission(assignment_id="asgn-1", student_id="stu-3", submitted_at=datetime.utcnow(), status="submitted"),
        # SQL Query Optimization
        Submission(assignment_id="asgn-2", student_id="stu-2", submitted_at=datetime.utcnow() - timedelta(days=3), marks_obtained=48.0, feedback="Perfect answers.", status="evaluated"),
        Submission(assignment_id="asgn-2", student_id="stu-4", submitted_at=datetime.utcnow() - timedelta(days=2), status="submitted"),
        # ER Diagram (overdue)
        Submission(assignment_id="asgn-4", student_id="stu-6", submitted_at=datetime.utcnow() - timedelta(days=1), marks_obtained=65.0, feedback="Some entities missing.", status="evaluated"),
    ]
    for sub in submissions:
        db.add(sub)
    db.commit()

    # 13. PERFORMANCE RECORDS (MARKS)
    # Target averages: stu-1 (68%, 55%, 72%), stu-2 (88%, 86%, 83%), stu-3 (74%, 70%, 70%), stu-5 (52%, 48%, 51%), stu-6 (61%, 56%, 59%)
    marks_history = [
        # student_id, class_id, subject_id, assessment, marks, max
        ("stu-1", "cls-1", "sub-1", "Test 1", 72, 100),
        ("stu-1", "cls-1", "sub-1", "Test 2", 68, 100),
        ("stu-1", "cls-1", "sub-1", "Test 3", 65, 100),
        ("stu-1", "cls-1", "sub-2", "Test 1", 58, 100),
        ("stu-1", "cls-1", "sub-2", "Test 2", 55, 100),
        ("stu-1", "cls-1", "sub-2", "Test 3", 52, 100),
        ("stu-1", "cls-1", "sub-3", "Test 1", 74, 100),
        ("stu-1", "cls-1", "sub-3", "Test 2", 72, 100),
        ("stu-1", "cls-1", "sub-3", "Test 3", 70, 100),

        ("stu-2", "cls-1", "sub-1", "Test 1", 85, 100),
        ("stu-2", "cls-1", "sub-1", "Test 2", 88, 100),
        ("stu-2", "cls-1", "sub-1", "Test 3", 91, 100),
        ("stu-2", "cls-1", "sub-2", "Test 1", 82, 100),
        ("stu-2", "cls-1", "sub-2", "Test 2", 86, 100),
        ("stu-2", "cls-1", "sub-2", "Test 3", 89, 100),
        
        ("stu-3", "cls-1", "sub-1", "Test 1", 76, 100),
        ("stu-3", "cls-1", "sub-1", "Test 2", 74, 100),
        ("stu-3", "cls-1", "sub-1", "Test 3", 73, 100),
        ("stu-3", "cls-1", "sub-2", "Test 1", 70, 100),
        ("stu-3", "cls-1", "sub-2", "Test 2", 71, 100),
        ("stu-3", "cls-1", "sub-2", "Test 3", 69, 100),

        ("stu-5", "cls-3", "sub-1", "Test 1", 60, 100),
        ("stu-5", "cls-3", "sub-1", "Test 2", 52, 100),
        ("stu-5", "cls-3", "sub-1", "Test 3", 44, 100),
        ("stu-5", "cls-3", "sub-2", "Test 1", 55, 100),
        ("stu-5", "cls-3", "sub-2", "Test 2", 48, 100),
        ("stu-5", "cls-3", "sub-2", "Test 3", 40, 100),

        ("stu-6", "cls-3", "sub-1", "Test 1", 65, 100),
        ("stu-6", "cls-3", "sub-1", "Test 2", 61, 100),
        ("stu-6", "cls-3", "sub-1", "Test 3", 57, 100),
    ]

    perf_records = []
    for sid, cid, subid, assess, val, mx in marks_history:
        # Determine teacher
        tid = "t-1" if subid in ["sub-1", "sub-6"] else ("t-2" if subid in ["sub-2", "sub-3"] else "t-3")
        perf_records.append(
            PerformanceRecord(
                student_id=sid, class_id=cid, subject_id=subid,
                assessment_name=assess, marks_obtained=val, max_marks=mx,
                teacher_id=tid, date=date.today() - timedelta(days=10)
            )
        )
    db.bulk_save_objects(perf_records)
    db.commit()

    # 14. ANNOUNCEMENTS
    anns = [
        Announcement(title="Mid-Semester Examination Schedule", content="Mid-semester examinations for Semester 6 will be conducted from September 10–18. Detailed schedule will be shared by each department.", author="Admin", priority="high", target_role="all"),
        Announcement(title="DBMS Lab Session Rescheduled", content="The DBMS practical session scheduled for Friday (Aug 23) has been rescheduled to Saturday (Aug 24) due to a faculty event. Attendance will be marked.", author="Dr. Meera Krishnan", priority="medium", target_role="student", target_class_id="cls-1"),
        Announcement(title="Faculty Development Program", content="All teaching faculty are requested to attend the FDP on 'Modern Teaching Methodologies' on August 24, 2026 from 10 AM to 4 PM in Seminar Hall 103.", author="Admin", priority="medium", target_role="teacher"),
    ]
    for an in anns:
        db.add(an)
    db.commit()

    # 15. NOTIFICATIONS
    notifs = [
        # admin
        Notification(user_id="admin-1", type="timetable", message="Room 102 has a scheduling conflict on Tuesday at 14:00", time="10 min ago", read=False, severity="warning"),
        Notification(user_id="admin-1", type="attendance", message="CSE-C attendance dropped below 65% this week", time="1 hr ago", read=False, severity="critical"),
        Notification(user_id="admin-1", type="system", message="3 timetable conflicts detected across campus", time="2 hr ago", read=False, severity="warning"),
        Notification(user_id="admin-1", type="performance", message="CSE-C classroom health score dropped to 58 (Critical)", time="3 hr ago", read=True, severity="critical"),
        
        # teacher
        Notification(user_id="t-1", type="attendance", message="7 students in CSE-B have attendance below 75%", time="30 min ago", read=False, severity="warning"),
        Notification(user_id="t-1", type="attendance", message="Rahul Sharma has 4 consecutive absences", time="2 hr ago", read=False, severity="warning"),
        Notification(user_id="t-2", type="assignment", message="Assignment 4 (ER Diagram) has only 54% completion — deadline passed", time="1 hr ago", read=False, severity="critical"),
        Notification(user_id="t-2", type="academic", message="18 submissions pending evaluation for Binary Search Tree assignment", time="3 hr ago", read=True, severity="info"),
        
        # student
        Notification(user_id="stu-1", type="attendance", message="Your DBMS attendance is 68% — below the 75% required threshold", time="1 hr ago", read=False, severity="warning"),
        Notification(user_id="stu-1", type="assignment", message="SQL Query Optimization assignment due in 1 day", time="2 hr ago", read=False, severity="warning"),
        Notification(user_id="stu-1", type="academic", message="Your DBMS score has declined in the last two assessments", time="1 day ago", read=True, severity="info"),
    ]
    for n in notifs:
        db.add(n)
    db.commit()

    print("Seeding completed successfully!")
