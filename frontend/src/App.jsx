import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";

// Layouts
import AppLayout from "./layouts/AppLayout";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";

// Shared pages
import AIAssistantPage from "./pages/shared/AIAssistantPage";
import ComingSoon from "./pages/shared/ComingSoon";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ClassManagement from "./pages/admin/ClassManagement";
import ClassDetail from "./pages/admin/ClassDetail";
import StudentManagement from "./pages/admin/StudentManagement";
import FacultyManagement from "./pages/admin/FacultyManagement";
import RoomManagement from "./pages/admin/RoomManagement";
import TimetableManagement from "./pages/admin/TimetableManagement";

// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import ClassesPage from "./pages/teacher/ClassesPage";
import AttendancePage from "./pages/teacher/AttendancePage";
import AssignmentsPage from "./pages/teacher/AssignmentsPage";
import PerformancePage from "./pages/teacher/PerformancePage";
import StudentRiskPage from "./pages/teacher/StudentRiskPage";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import MyAttendance from "./pages/student/MyAttendance";
import MyAssignments from "./pages/student/MyAssignments";
import MyPerformance from "./pages/student/MyPerformance";
import MyTimetable from "./pages/student/MyTimetable";

// Role-based private route guard
function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-sm">SC</span>
          </div>
          <p className="text-sm text-muted-foreground">Loading SmartClass...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to correct role dashboard
    const redirects = { admin: "/admin", teacher: "/teacher", student: "/student" };
    return <Navigate to={redirects[user.role] || "/login"} replace />;
  }

  return children;
}

// Root redirect based on role
function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  const redirects = { admin: "/admin", teacher: "/teacher", student: "/student" };
  return <Navigate to={redirects[user.role] || "/login"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RootRedirect />} />

      {/* ─── ADMIN ROUTES ─────────────────────────────── */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="campus" element={<ComingSoon title="Campus View" description="Visual room-by-room campus overview with real-time status. Coming in Phase 8." />} />
        <Route path="classes" element={<ClassManagement />} />
        <Route path="classes/:id" element={<ClassDetail />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="faculty" element={<FacultyManagement />} />
        <Route path="timetable" element={<TimetableManagement />} />
        <Route path="rooms" element={<RoomManagement />} />
        <Route path="analytics" element={<ComingSoon title="Institution Analytics" description="In-depth analytics across all departments. Coming in Phase 9." />} />
        <Route path="announcements" element={<ComingSoon title="Announcements" description="Manage institutional announcements. Coming in Phase 4." />} />
        <Route path="assistant" element={<AIAssistantPage />} />
      </Route>

      {/* ─── TEACHER ROUTES ───────────────────────────── */}
      <Route
        path="/teacher"
        element={
          <PrivateRoute allowedRoles={["teacher"]}>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="classes/:id" element={<ClassDetail />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="risk" element={<StudentRiskPage />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="timetable" element={<MyTimetable />} />
        <Route path="announcements" element={<ComingSoon title="Announcements" description="Create and manage announcements. Coming in Phase 4." />} />
        <Route path="assistant" element={<AIAssistantPage />} />
      </Route>

      {/* ─── STUDENT ROUTES ───────────────────────────── */}
      <Route
        path="/student"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="attendance" element={<MyAttendance />} />
        <Route path="assignments" element={<MyAssignments />} />
        <Route path="performance" element={<MyPerformance />} />
        <Route path="timetable" element={<MyTimetable />} />
        <Route path="resources" element={<ComingSoon title="Study Resources" description="Notes and study materials from teachers. Coming in Phase 6." />} />
        <Route path="announcements" element={<ComingSoon title="Announcements" description="Institutional and class announcements. Coming in Phase 4." />} />
        <Route path="assistant" element={<AIAssistantPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
