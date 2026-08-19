/**
 * SmartClass Demo Data
 * Realistic seed data for hackathon demonstration
 * All analytics are calculated from this data — not randomly generated
 */

// ─── DEPARTMENTS ─────────────────────────────────────────────────────────────
export const departments = [
  { id: "dept-1", name: "Computer Science & Engineering", code: "CSE", hod: "Dr. Priya Nair" },
  { id: "dept-2", name: "Electronics & Communication", code: "ECE", hod: "Dr. Ramesh Gupta" },
  { id: "dept-3", name: "Mechanical Engineering", code: "ME", hod: "Prof. Suresh Patel" },
];

// ─── SUBJECTS ─────────────────────────────────────────────────────────────────
export const subjects = [
  { id: "sub-1", name: "Data Structures & Algorithms", code: "DSA", department: "dept-1", credits: 4 },
  { id: "sub-2", name: "Database Management Systems", code: "DBMS", department: "dept-1", credits: 3 },
  { id: "sub-3", name: "Operating Systems", code: "OS", department: "dept-1", credits: 3 },
  { id: "sub-4", name: "Computer Networks", code: "CN", department: "dept-1", credits: 3 },
  { id: "sub-5", name: "Software Engineering", code: "SE", department: "dept-1", credits: 3 },
  { id: "sub-6", name: "Machine Learning", code: "ML", department: "dept-1", credits: 4 },
];

// ─── TEACHERS ─────────────────────────────────────────────────────────────────
export const teachers = [
  {
    id: "t-1",
    name: "Prof. Arjun Sharma",
    email: "arjun.sharma@smartclass.edu",
    password: "teacher123",
    subjects: ["sub-1", "sub-6"],
    department: "dept-1",
    classes: ["cls-1", "cls-2"],
    experience: 8,
    phone: "+91 98765 43210",
  },
  {
    id: "t-2",
    name: "Dr. Meera Krishnan",
    email: "meera.k@smartclass.edu",
    password: "teacher123",
    subjects: ["sub-2", "sub-3"],
    department: "dept-1",
    classes: ["cls-1", "cls-3"],
    experience: 12,
    phone: "+91 98765 43211",
  },
  {
    id: "t-3",
    name: "Prof. Vikram Singh",
    email: "vikram.singh@smartclass.edu",
    password: "teacher123",
    subjects: ["sub-4", "sub-5"],
    department: "dept-1",
    classes: ["cls-2", "cls-3"],
    experience: 6,
    phone: "+91 98765 43212",
  },
];

// ─── CLASSROOMS ───────────────────────────────────────────────────────────────
export const classrooms = [
  {
    id: "cls-1",
    name: "CSE-A",
    section: "A",
    batch: "2022-26",
    department: "dept-1",
    semester: 6,
    strength: 60,
    classTeacher: "t-1",
    // Health metrics (used for classroom health score calculation)
    attendance: 91,
    assignmentCompletion: 86,
    academicPerformance: 78,
    participation: 88,
    trend: +3, // month-over-month health score change
    healthScore: 85,
    healthStatus: "healthy",
  },
  {
    id: "cls-2",
    name: "CSE-B",
    section: "B",
    batch: "2022-26",
    department: "dept-1",
    semester: 6,
    strength: 58,
    classTeacher: "t-2",
    attendance: 79,
    assignmentCompletion: 71,
    academicPerformance: 68,
    participation: 70,
    trend: -4,
    healthScore: 72,
    healthStatus: "warning",
  },
  {
    id: "cls-3",
    name: "CSE-C",
    section: "C",
    batch: "2022-26",
    department: "dept-1",
    semester: 6,
    strength: 55,
    classTeacher: "t-3",
    attendance: 64,
    assignmentCompletion: 54,
    academicPerformance: 58,
    participation: 52,
    trend: -9,
    healthScore: 58,
    healthStatus: "critical",
  },
];

// ─── STUDENTS ─────────────────────────────────────────────────────────────────
export const students = [
  // CSE-A Students (mostly healthy)
  {
    id: "stu-1",
    name: "Rahul Sharma",
    email: "rahul.sharma@student.edu",
    password: "student123",
    rollNo: "CSE22A001",
    classroom: "cls-1",
    phone: "+91 99000 11001",
    attendance: 62,
    consecutiveAbsences: 4,
    assignmentCompletion: 71,
    missedAssignments: 2,
    performanceTrend: -12,
    subjects: {
      "sub-1": { marks: [72, 68, 65], avg: 68, trend: -7 },
      "sub-2": { marks: [58, 55, 52], avg: 55, trend: -6 },
      "sub-3": { marks: [74, 72, 70], avg: 72, trend: -4 },
      "sub-4": { marks: [80, 78, 75], avg: 78, trend: -5 },
      "sub-5": { marks: [71, 68, 66], avg: 68, trend: -5 },
    },
    // For hackathon demo: this is the "focus" student for teacher dashboard
    isHighRisk: true,
    focusSubject: "sub-2",
  },
  {
    id: "stu-2",
    name: "Priya Mehta",
    email: "priya.mehta@student.edu",
    password: "student123",
    rollNo: "CSE22A002",
    classroom: "cls-1",
    phone: "+91 99000 11002",
    attendance: 94,
    consecutiveAbsences: 0,
    assignmentCompletion: 96,
    missedAssignments: 0,
    performanceTrend: +8,
    subjects: {
      "sub-1": { marks: [85, 88, 91], avg: 88, trend: +6 },
      "sub-2": { marks: [82, 86, 89], avg: 86, trend: +7 },
      "sub-3": { marks: [79, 83, 86], avg: 83, trend: +7 },
      "sub-4": { marks: [88, 90, 93], avg: 90, trend: +5 },
      "sub-5": { marks: [84, 87, 90], avg: 87, trend: +6 },
    },
    isHighRisk: false,
    focusSubject: null,
  },
  {
    id: "stu-3",
    name: "Aryan Kapoor",
    email: "aryan.kapoor@student.edu",
    password: "student123",
    rollNo: "CSE22A003",
    classroom: "cls-1",
    phone: "+91 99000 11003",
    attendance: 78,
    consecutiveAbsences: 1,
    assignmentCompletion: 82,
    missedAssignments: 1,
    performanceTrend: -3,
    subjects: {
      "sub-1": { marks: [76, 74, 73], avg: 74, trend: -3 },
      "sub-2": { marks: [70, 71, 69], avg: 70, trend: -1 },
      "sub-3": { marks: [68, 70, 72], avg: 70, trend: +4 },
      "sub-4": { marks: [73, 72, 70], avg: 72, trend: -3 },
      "sub-5": { marks: [75, 74, 72], avg: 74, trend: -3 },
    },
    isHighRisk: false,
    focusSubject: "sub-2",
  },
  {
    id: "stu-4",
    name: "Sneha Reddy",
    email: "sneha.reddy@student.edu",
    password: "student123",
    rollNo: "CSE22A004",
    classroom: "cls-1",
    phone: "+91 99000 11004",
    attendance: 88,
    consecutiveAbsences: 0,
    assignmentCompletion: 90,
    missedAssignments: 0,
    performanceTrend: +5,
    subjects: {
      "sub-1": { marks: [82, 84, 86], avg: 84, trend: +4 },
      "sub-2": { marks: [78, 80, 83], avg: 80, trend: +5 },
      "sub-3": { marks: [75, 78, 80], avg: 78, trend: +5 },
      "sub-4": { marks: [82, 85, 87], avg: 85, trend: +5 },
      "sub-5": { marks: [80, 83, 85], avg: 83, trend: +5 },
    },
    isHighRisk: false,
    focusSubject: null,
  },
  // CSE-C Students (critical class)
  {
    id: "stu-5",
    name: "Amit Verma",
    email: "amit.verma@student.edu",
    password: "student123",
    rollNo: "CSE22C001",
    classroom: "cls-3",
    phone: "+91 99000 11005",
    attendance: 55,
    consecutiveAbsences: 6,
    assignmentCompletion: 42,
    missedAssignments: 4,
    performanceTrend: -18,
    subjects: {
      "sub-1": { marks: [60, 52, 44], avg: 52, trend: -16 },
      "sub-2": { marks: [55, 48, 40], avg: 48, trend: -15 },
      "sub-3": { marks: [58, 50, 45], avg: 51, trend: -13 },
      "sub-4": { marks: [62, 55, 48], avg: 55, trend: -14 },
      "sub-5": { marks: [64, 57, 50], avg: 57, trend: -14 },
    },
    isHighRisk: true,
    focusSubject: "sub-2",
  },
  {
    id: "stu-6",
    name: "Divya Nair",
    email: "divya.nair@student.edu",
    password: "student123",
    rollNo: "CSE22C002",
    classroom: "cls-3",
    phone: "+91 99000 11006",
    attendance: 61,
    consecutiveAbsences: 3,
    assignmentCompletion: 58,
    missedAssignments: 3,
    performanceTrend: -10,
    subjects: {
      "sub-1": { marks: [65, 61, 57], avg: 61, trend: -8 },
      "sub-2": { marks: [60, 56, 52], avg: 56, trend: -8 },
      "sub-3": { marks: [63, 59, 56], avg: 59, trend: -7 },
      "sub-4": { marks: [67, 63, 60], avg: 63, trend: -7 },
      "sub-5": { marks: [65, 62, 59], avg: 62, trend: -6 },
    },
    isHighRisk: true,
    focusSubject: "sub-2",
  },
];

// ─── ROOMS ────────────────────────────────────────────────────────────────────
export const rooms = [
  {
    id: "room-1", name: "Room 101", building: "Block A", floor: 1,
    capacity: 60, type: "Classroom",
    equipment: ["Projector", "Whiteboard", "AC"],
    utilization: 89, currentClass: "CSE-A", status: "active",
  },
  {
    id: "room-2", name: "Room 102", building: "Block A", floor: 1,
    capacity: 60, type: "Classroom",
    equipment: ["Projector", "Whiteboard", "AC"],
    utilization: 72, currentClass: "CSE-B", status: "active",
  },
  {
    id: "room-3", name: "Room 103", building: "Block A", floor: 1,
    capacity: 40, type: "Seminar Hall",
    equipment: ["Projector", "Sound System", "AC"],
    utilization: 34, currentClass: null, status: "available",
  },
  {
    id: "room-4", name: "Room 201", building: "Block B", floor: 2,
    capacity: 60, type: "Classroom",
    equipment: ["Smartboard", "Whiteboard", "AC"],
    utilization: 96, currentClass: "CSE-C", status: "active",
  },
  {
    id: "room-5", name: "Room 202", building: "Block B", floor: 2,
    capacity: 80, type: "Lecture Hall",
    equipment: ["Dual Projectors", "Mic System", "AC"],
    utilization: 81, currentClass: null, status: "available",
  },
  {
    id: "room-6", name: "Lab 301", building: "Block C", floor: 3,
    capacity: 30, type: "Computer Lab",
    equipment: ["30 PCs", "Server", "AC", "Projector"],
    utilization: 68, currentClass: "Practical Batch A", status: "active",
  },
  {
    id: "room-7", name: "Room 207", building: "Block B", floor: 2,
    capacity: 40, type: "Classroom",
    equipment: ["Whiteboard", "Fan"],
    utilization: 28, currentClass: null, status: "available",
  },
  {
    id: "room-8", name: "Room 301", building: "Block C", floor: 3,
    capacity: 60, type: "Classroom",
    equipment: ["Projector", "Whiteboard", "AC"],
    utilization: 35, currentClass: null, status: "maintenance",
  },
];

// ─── TIMETABLE ────────────────────────────────────────────────────────────────
// hasConflict: true for demo conflict detection
export const timetableSlots = [
  // Monday
  { id: "tt-1", day: "Monday", startTime: "09:00", endTime: "10:00", subject: "sub-1", teacher: "t-1", classroom: "cls-1", room: "room-1", hasConflict: false },
  { id: "tt-2", day: "Monday", startTime: "10:00", endTime: "11:00", subject: "sub-2", teacher: "t-2", classroom: "cls-1", room: "room-1", hasConflict: false },
  { id: "tt-3", day: "Monday", startTime: "11:00", endTime: "12:00", subject: "sub-4", teacher: "t-3", classroom: "cls-2", room: "room-2", hasConflict: false },
  // CONFLICT: t-1 is assigned to two classes at 11:00 AM
  { id: "tt-4", day: "Monday", startTime: "11:00", endTime: "12:00", subject: "sub-6", teacher: "t-1", classroom: "cls-2", room: "room-4", hasConflict: true, conflictWith: "tt-5", conflictType: "faculty" },
  { id: "tt-5", day: "Monday", startTime: "11:00", endTime: "12:00", subject: "sub-1", teacher: "t-1", classroom: "cls-3", room: "room-2", hasConflict: true, conflictWith: "tt-4", conflictType: "faculty" },
  { id: "tt-6", day: "Monday", startTime: "14:00", endTime: "15:00", subject: "sub-3", teacher: "t-2", classroom: "cls-3", room: "room-4", hasConflict: false },
  { id: "tt-7", day: "Monday", startTime: "15:00", endTime: "16:00", subject: "sub-5", teacher: "t-3", classroom: "cls-1", room: "room-1", hasConflict: false },
  // Tuesday
  { id: "tt-8", day: "Tuesday", startTime: "09:00", endTime: "10:00", subject: "sub-2", teacher: "t-2", classroom: "cls-2", room: "room-2", hasConflict: false },
  { id: "tt-9", day: "Tuesday", startTime: "10:00", endTime: "11:00", subject: "sub-1", teacher: "t-1", classroom: "cls-3", room: "room-4", hasConflict: false },
  { id: "tt-10", day: "Tuesday", startTime: "11:00", endTime: "12:00", subject: "sub-3", teacher: "t-2", classroom: "cls-1", room: "room-1", hasConflict: false },
  // ROOM CONFLICT: room-2 is used for two classes at 14:00
  { id: "tt-11", day: "Tuesday", startTime: "14:00", endTime: "15:00", subject: "sub-4", teacher: "t-3", classroom: "cls-1", room: "room-2", hasConflict: true, conflictWith: "tt-12", conflictType: "room" },
  { id: "tt-12", day: "Tuesday", startTime: "14:00", endTime: "15:00", subject: "sub-5", teacher: "t-1", classroom: "cls-2", room: "room-2", hasConflict: true, conflictWith: "tt-11", conflictType: "room" },
  // Wednesday
  { id: "tt-13", day: "Wednesday", startTime: "09:00", endTime: "10:00", subject: "sub-1", teacher: "t-1", classroom: "cls-1", room: "room-1", hasConflict: false },
  { id: "tt-14", day: "Wednesday", startTime: "10:00", endTime: "11:00", subject: "sub-3", teacher: "t-2", classroom: "cls-2", room: "room-2", hasConflict: false },
  { id: "tt-15", day: "Wednesday", startTime: "11:00", endTime: "12:00", subject: "sub-5", teacher: "t-3", classroom: "cls-3", room: "room-4", hasConflict: false },
  { id: "tt-16", day: "Wednesday", startTime: "14:00", endTime: "15:00", subject: "sub-6", teacher: "t-1", classroom: "cls-1", room: "room-1", hasConflict: false },
  // Thursday
  { id: "tt-17", day: "Thursday", startTime: "09:00", endTime: "10:00", subject: "sub-2", teacher: "t-2", classroom: "cls-3", room: "room-4", hasConflict: false },
  { id: "tt-18", day: "Thursday", startTime: "10:00", endTime: "11:00", subject: "sub-4", teacher: "t-3", classroom: "cls-1", room: "room-1", hasConflict: false },
  { id: "tt-19", day: "Thursday", startTime: "11:00", endTime: "12:00", subject: "sub-1", teacher: "t-1", classroom: "cls-2", room: "room-2", hasConflict: false },
  // Friday
  { id: "tt-20", day: "Friday", startTime: "09:00", endTime: "10:00", subject: "sub-5", teacher: "t-3", classroom: "cls-2", room: "room-2", hasConflict: false },
  { id: "tt-21", day: "Friday", startTime: "10:00", endTime: "11:00", subject: "sub-3", teacher: "t-2", classroom: "cls-1", room: "room-1", hasConflict: false },
  { id: "tt-22", day: "Friday", startTime: "11:00", endTime: "12:00", subject: "sub-6", teacher: "t-1", classroom: "cls-3", room: "room-4", hasConflict: false },
];

// ─── ASSIGNMENTS ──────────────────────────────────────────────────────────────
export const assignments = [
  {
    id: "asgn-1",
    title: "Binary Search Tree Implementation",
    subject: "sub-1",
    classroom: "cls-1",
    teacher: "t-1",
    dueDate: "2026-08-25",
    createdAt: "2026-08-15",
    maxMarks: 100,
    submissionRate: 88,
    avgScore: 74,
    lateSubmissions: 8,
    status: "active",
    description: "Implement a full BST with insert, delete, and search operations in C++.",
  },
  {
    id: "asgn-2",
    title: "SQL Query Optimization",
    subject: "sub-2",
    classroom: "cls-1",
    teacher: "t-2",
    dueDate: "2026-08-20",
    createdAt: "2026-08-10",
    maxMarks: 50,
    submissionRate: 76,
    avgScore: 62,
    lateSubmissions: 12,
    status: "active",
    description: "Optimize the given set of SQL queries and explain your approach.",
  },
  {
    id: "asgn-3",
    title: "Process Scheduling Simulation",
    subject: "sub-3",
    classroom: "cls-1",
    teacher: "t-2",
    dueDate: "2026-08-22",
    createdAt: "2026-08-12",
    maxMarks: 75,
    submissionRate: 91,
    avgScore: 78,
    lateSubmissions: 4,
    status: "active",
    description: "Simulate FCFS, SJF and Round Robin scheduling algorithms.",
  },
  {
    id: "asgn-4",
    title: "ER Diagram for E-Commerce System",
    subject: "sub-2",
    classroom: "cls-3",
    teacher: "t-2",
    dueDate: "2026-08-18",
    createdAt: "2026-08-08",
    maxMarks: 100,
    submissionRate: 54,
    avgScore: 48,
    lateSubmissions: 18,
    status: "overdue",
    description: "Design a complete ER diagram for an e-commerce system with at least 8 entities.",
  },
  {
    id: "asgn-5",
    title: "Network Protocol Analysis",
    subject: "sub-4",
    classroom: "cls-2",
    teacher: "t-3",
    dueDate: "2026-08-28",
    createdAt: "2026-08-18",
    maxMarks: 50,
    submissionRate: 68,
    avgScore: 58,
    lateSubmissions: 7,
    status: "active",
    description: "Analyze TCP/IP handshake using Wireshark and document observations.",
  },
];

// ─── ATTENDANCE HISTORY (monthly trends) ─────────────────────────────────────
export const attendanceTrend = {
  "cls-1": [
    { month: "Mar", attendance: 88 },
    { month: "Apr", attendance: 90 },
    { month: "May", attendance: 92 },
    { month: "Jun", attendance: 91 },
    { month: "Jul", attendance: 93 },
    { month: "Aug", attendance: 91 },
  ],
  "cls-2": [
    { month: "Mar", attendance: 85 },
    { month: "Apr", attendance: 84 },
    { month: "May", attendance: 82 },
    { month: "Jun", attendance: 80 },
    { month: "Jul", attendance: 81 },
    { month: "Aug", attendance: 79 },
  ],
  "cls-3": [
    { month: "Mar", attendance: 82 },
    { month: "Apr", attendance: 78 },
    { month: "May", attendance: 74 },
    { month: "Jun", attendance: 70 },
    { month: "Jul", attendance: 67 },
    { month: "Aug", attendance: 64 },
  ],
};

// ─── PERFORMANCE TREND ────────────────────────────────────────────────────────
export const performanceTrend = {
  "cls-1": [
    { assessment: "Test 1", avg: 74 },
    { assessment: "Test 2", avg: 76 },
    { assessment: "Test 3", avg: 78 },
    { assessment: "Mid-sem", avg: 77 },
    { assessment: "Test 4", avg: 79 },
    { assessment: "Test 5", avg: 78 },
  ],
  "cls-2": [
    { assessment: "Test 1", avg: 72 },
    { assessment: "Test 2", avg: 71 },
    { assessment: "Test 3", avg: 70 },
    { assessment: "Mid-sem", avg: 69 },
    { assessment: "Test 4", avg: 68 },
    { assessment: "Test 5", avg: 68 },
  ],
  "cls-3": [
    { assessment: "Test 1", avg: 70 },
    { assessment: "Test 2", avg: 67 },
    { assessment: "Test 3", avg: 63 },
    { assessment: "Mid-sem", avg: 61 },
    { assessment: "Test 4", avg: 59 },
    { assessment: "Test 5", avg: 58 },
  ],
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notifications = {
  admin: [
    { id: "n-1", type: "timetable", message: "Room 102 has a scheduling conflict on Tuesday at 14:00", time: "10 min ago", read: false, severity: "warning" },
    { id: "n-2", type: "attendance", message: "CSE-C attendance dropped below 65% this week", time: "1 hr ago", read: false, severity: "critical" },
    { id: "n-3", type: "system", message: "3 timetable conflicts detected across campus", time: "2 hr ago", read: false, severity: "warning" },
    { id: "n-4", type: "performance", message: "CSE-C classroom health score dropped to 58 (Critical)", time: "3 hr ago", read: true, severity: "critical" },
    { id: "n-5", type: "system", message: "Monthly analytics report is ready for review", time: "5 hr ago", read: true, severity: "info" },
  ],
  teacher: [
    { id: "n-6", type: "attendance", message: "7 students in CSE-B have attendance below 75%", time: "30 min ago", read: false, severity: "warning" },
    { id: "n-7", type: "assignment", message: "Assignment 4 (ER Diagram) has only 54% completion — deadline passed", time: "1 hr ago", read: false, severity: "critical" },
    { id: "n-8", type: "attendance", message: "Rahul Sharma has 4 consecutive absences", time: "2 hr ago", read: false, severity: "warning" },
    { id: "n-9", type: "academic", message: "18 submissions pending evaluation for Binary Search Tree assignment", time: "3 hr ago", read: true, severity: "info" },
  ],
  student: [
    { id: "n-10", type: "attendance", message: "Your DBMS attendance is 68% — below the 75% required threshold", time: "1 hr ago", read: false, severity: "warning" },
    { id: "n-11", type: "assignment", message: "SQL Query Optimization assignment due in 1 day", time: "2 hr ago", read: false, severity: "warning" },
    { id: "n-12", type: "academic", message: "Your DBMS score has declined in the last two assessments", time: "1 day ago", read: true, severity: "info" },
    { id: "n-13", type: "system", message: "Welcome to SmartClass! Your dashboard is ready.", time: "3 days ago", read: true, severity: "info" },
  ],
};

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
export const announcements = [
  {
    id: "ann-1",
    title: "Mid-Semester Examination Schedule",
    content: "Mid-semester examinations for Semester 6 will be conducted from September 10–18. Detailed schedule will be shared by each department.",
    author: "Admin",
    createdAt: "2026-08-18",
    priority: "high",
    targetRole: "all",
  },
  {
    id: "ann-2",
    title: "DBMS Lab Session Rescheduled",
    content: "The DBMS practical session scheduled for Friday (Aug 23) has been rescheduled to Saturday (Aug 24) due to a faculty event. Attendance will be marked.",
    author: "Dr. Meera Krishnan",
    createdAt: "2026-08-19",
    priority: "medium",
    targetRole: "student",
  },
  {
    id: "ann-3",
    title: "Faculty Development Program",
    content: "All teaching faculty are requested to attend the FDP on 'Modern Teaching Methodologies' on August 24, 2026 from 10 AM to 4 PM in Seminar Hall 103.",
    author: "Admin",
    createdAt: "2026-08-17",
    priority: "medium",
    targetRole: "teacher",
  },
];

// ─── AI ASSISTANT RULES ────────────────────────────────────────────────────────
// Rule-based response patterns using actual data
export const aiRules = {
  patterns: [
    {
      keywords: ["attention", "risk", "need help", "struggling"],
      role: "teacher",
      response: (data) => {
        const highRisk = data.students.filter((s) => s.isHighRisk);
        return `${highRisk.length} students currently have high risk status: ${highRisk.map((s) => s.name).join(", ")}. Rahul Sharma is the highest priority with attendance at 62% and 4 consecutive absences.`;
      },
    },
    {
      keywords: ["cse-c", "critical", "declined", "why"],
      role: "all",
      response: () =>
        "CSE-C's classroom health has declined to 58 (Critical) due to: attendance dropping from 82% to 64% over 5 months, assignment completion falling to 54%, and average performance declining across the last 3 assessments. Immediate intervention is recommended.",
    },
    {
      keywords: ["underutilized", "room", "empty", "available"],
      role: "admin",
      response: (data) => {
        const underused = data.rooms.filter((r) => r.utilization < 40);
        return `${underused.length} rooms have utilization below 40%: ${underused.map((r) => `${r.name} (${r.utilization}%)`).join(", ")}. Consider reassigning classes from overused rooms.`;
      },
    },
    {
      keywords: ["focus", "study", "improve", "weak", "priority"],
      role: "student",
      response: (data, user) => {
        const student = data.students.find((s) => s.id === user?.id) || data.students[0];
        const focusSub = subjects.find((s) => s.id === student.focusSubject);
        return `Based on your recent performance, ${focusSub?.name || "DBMS"} is your highest priority subject. Your scores have declined over the last two assessments. Focus on completing Assignment 2 and reviewing normalization topics before the next test.`;
      },
    },
    {
      keywords: ["attendance", "below", "threshold", "low"],
      role: "all",
      response: (data) => {
        const atRisk = data.students.filter((s) => s.attendance < 75);
        return `${atRisk.length} students have attendance below 75%: ${atRisk.slice(0, 3).map((s) => `${s.name} (${s.attendance}%)`).join(", ")}${atRisk.length > 3 ? ` and ${atRisk.length - 3} more` : ""}.`;
      },
    },
    {
      keywords: ["conflict", "timetable", "clash", "schedule"],
      role: "admin",
      response: (data) => {
        const conflicts = data.timetable.filter((t) => t.hasConflict);
        const uniqueConflicts = Math.ceil(conflicts.length / 2);
        return `${uniqueConflicts} timetable conflicts detected: 1 faculty conflict (Prof. Arjun Sharma assigned to two classes on Monday 11:00 AM) and 1 room conflict (Room 102 double-booked on Tuesday 14:00). Resolve by reassigning one session to Room 103 or 207.`;
      },
    },
    {
      keywords: ["health", "class", "classes", "need attention"],
      role: "all",
      response: () =>
        "2 classes currently need attention: CSE-B (Health Score: 72 — Needs Attention, attendance declining) and CSE-C (Health Score: 58 — Critical, attendance at 64%, assignment completion at 54%). CSE-A is performing well at 85.",
    },
  ],
};

// ─── ADMIN STATS ──────────────────────────────────────────────────────────────
export const adminStats = {
  totalStudents: 4821,
  totalFaculty: 214,
  activeClasses: 126,
  totalRooms: 82,
  overallAttendance: 87.4,
  assignmentCompletion: 81.2,
  facultyUtilization: 76.8,
  avgPerformance: 74.3,
  alerts: {
    attendanceRisks: 14,
    performanceRisks: 9,
    timetableConflicts: 3,
    roomConflicts: 2,
    facultyIssues: 8,
  },
};

// ─── TODAY'S TIMETABLE (for current user's view) ──────────────────────────────
export const todaySchedule = {
  "cls-1": [
    { time: "09:00", subject: "Data Structures & Algorithms", teacher: "Prof. Arjun Sharma", room: "Room 101" },
    { time: "10:00", subject: "Database Management Systems", teacher: "Dr. Meera Krishnan", room: "Room 101" },
    { time: "11:00", subject: "Machine Learning", teacher: "Prof. Arjun Sharma", room: "Room 101" },
    { time: "14:00", subject: "Operating Systems", teacher: "Dr. Meera Krishnan", room: "Room 101" },
    { time: "15:00", subject: "Software Engineering", teacher: "Prof. Vikram Singh", room: "Room 101" },
  ],
  "cls-3": [
    { time: "09:00", subject: "Database Management Systems", teacher: "Dr. Meera Krishnan", room: "Room 201" },
    { time: "10:00", subject: "Data Structures & Algorithms", teacher: "Prof. Arjun Sharma", room: "Room 201" },
    { time: "14:00", subject: "Operating Systems", teacher: "Dr. Meera Krishnan", room: "Room 201" },
  ],
};
