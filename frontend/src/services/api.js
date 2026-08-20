import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  // Auth
  auth: {
    login: async (email, password) => {
      const res = await client.post("/api/auth/login", { email, password });
      return res.data;
    },
  },

  // Dashboard
  dashboard: {
    getAdminStats: async () => {
      const res = await client.get("/api/dashboard/admin");
      return res.data;
    },
    getTeacherStats: async (teacherId) => {
      const res = await client.get(`/api/dashboard/teacher/${teacherId}`);
      return res.data;
    },
    getStudentStats: async (studentId) => {
      const res = await client.get(`/api/dashboard/student/${studentId}`);
      return res.data;
    },
  },

  // Classes
  classes: {
    getAll: async () => {
      const res = await client.get("/api/classes");
      return res.data;
    },
    getDetails: async (classId) => {
      const res = await client.get(`/api/classes/${classId}`);
      return res.data;
    },
    create: async (data) => {
      const res = await client.post("/api/classes", data);
      return res.data;
    },
    enrollStudents: async (classId, studentIds) => {
      const res = await client.post(`/api/classes/${classId}/students`, { student_ids: studentIds });
      return res.data;
    },
    unenrollStudent: async (classId, studentId) => {
      const res = await client.delete(`/api/classes/${classId}/students/${studentId}`);
      return res.data;
    },
    assignTeacher: async (classId, teacherId, subjectId, makeClassTeacher = false) => {
      const res = await client.post(`/api/classes/${classId}/teacher`, {
        teacher_id: teacherId,
        subject_id: subjectId,
        make_class_teacher: makeClassTeacher,
      });
      return res.data;
    },
    assignSubject: async (classId, subjectId) => {
      const res = await client.post(`/api/classes/${classId}/subject`, { subject_id: subjectId });
      return res.data;
    },
  },

  // Students
  students: {
    getAll: async (classroomId = "", search = "") => {
      const params = {};
      if (classroomId) params.classroom_id = classroomId;
      if (search) params.search = search;
      const res = await client.get("/api/students", { params });
      return res.data;
    },
    create: async (data) => {
      const res = await client.post("/api/students", data);
      return res.data;
    },
  },

  // Teachers
  teachers: {
    getAll: async (search = "") => {
      const params = {};
      if (search) params.search = search;
      const res = await client.get("/api/teachers", { params });
      return res.data;
    },
    create: async (data) => {
      const res = await client.post("/api/teachers", data);
      return res.data;
    },
  },

  // Rooms
  rooms: {
    getAll: async () => {
      const res = await client.get("/api/rooms");
      return res.data;
    },
    create: async (data) => {
      const res = await client.post("/api/rooms", data);
      return res.data;
    },
  },

  // Timetable
  timetable: {
    getAll: async (classroomId = "", teacherId = "", roomId = "") => {
      const params = {};
      if (classroomId) params.classroom_id = classroomId;
      if (teacherId) params.teacher_id = teacherId;
      if (roomId) params.room_id = roomId;
      const res = await client.get("/api/timetable", { params });
      return res.data;
    },
    create: async (data) => {
      const res = await client.post("/api/timetable", data);
      return res.data;
    },
  },

  // Attendance
  attendance: {
    getRecords: async (classId, subjectId, dateStr) => {
      const res = await client.get("/api/attendance", {
        params: { classroom_id: classId, subject_id: subjectId, date_str: dateStr },
      });
      return res.data;
    },
    saveBatch: async (classId, subjectId, dateStr, records) => {
      const res = await client.post("/api/attendance", {
        class_id: classId,
        subject_id: subjectId,
        date: dateStr,
        records: records.map((r) => ({ student_id: r.studentId, status: r.status })),
      });
      return res.data;
    },
    getStudentRecords: async (studentId) => {
      const res = await client.get(`/api/attendance/student/${studentId}`);
      return res.data;
    },
  },

  // Assignments
  assignments: {
    getAll: async (classroomId = "", teacherId = "", studentId = "") => {
      const params = {};
      if (classroomId) params.classroom_id = classroomId;
      if (teacherId) params.teacher_id = teacherId;
      if (studentId) params.student_id = studentId;
      const res = await client.get("/api/assignments", { params });
      return res.data;
    },
    create: async (data) => {
      const res = await client.post("/api/assignments", data);
      return res.data;
    },
    submit: async (assignmentId, studentId) => {
      const res = await client.post(`/api/assignments/${assignmentId}/submit`, { student_id: studentId });
      return res.data;
    },
    getSubmissions: async (assignmentId) => {
      const res = await client.get(`/api/assignments/${assignmentId}/submissions`);
      return res.data;
    },
    gradeSubmission: async (submissionId, score, feedback = "") => {
      const res = await client.post(`/api/assignments/submissions/${submissionId}/grade`, {
        marks_obtained: parseFloat(score),
        feedback,
      });
      return res.data;
    },
  },

  // Performance
  performance: {
    getRecords: async (classId, subjectId, assessmentName = "") => {
      const params = { classroom_id: classId, subject_id: subjectId };
      if (assessmentName) params.assessment_name = assessmentName;
      const res = await client.get("/api/performance", { params });
      return res.data;
    },
    saveBatch: async (classId, subjectId, assessmentName, maxMarks, teacherId, dateStr, records) => {
      const res = await client.post("/api/performance", {
        class_id: classId,
        subject_id: subjectId,
        assessment_name: assessmentName,
        max_marks: parseFloat(maxMarks),
        teacher_id: teacherId,
        date: dateStr,
        records: records.map((r) => ({ student_id: r.studentId, marks_obtained: parseFloat(r.marksObtained) })),
      });
      return res.data;
    },
    getStudentPerformance: async (studentId) => {
      const res = await client.get(`/api/performance/student/${studentId}`);
      return res.data;
    },
  },

  // Announcements
  announcements: {
    getAll: async (role = "", classroomId = "") => {
      const params = {};
      if (role) params.role = role;
      if (classroomId) params.classroom_id = classroomId;
      const res = await client.get("/api/announcements", { params });
      return res.data;
    },
    create: async (data) => {
      const res = await client.post("/api/announcements", data);
      return res.data;
    },
  },

  // Notifications
  notifications: {
    getAll: async (userId) => {
      const res = await client.get("/api/notifications", { params: { user_id: userId } });
      return res.data;
    },
    create: async (data) => {
      const res = await client.post("/api/notifications", data);
      return res.data;
    },
    markAsRead: async (id) => {
      const res = await client.put(`/api/notifications/${id}/read`);
      return res.data;
    },
  },
};
