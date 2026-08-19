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

// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";

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
        <Route path="classes" element={<ComingSoon title="Class Management" description="Manage all classes, view classroom health details, enrollment. Coming in Phase 4." />} />
        <Route path="classes/:id" element={<ComingSoon title="Class Detail" description="Detailed classroom analytics, student list, performance. Coming in Phase 4." />} />
        <Route path="students" element={<ComingSoon title="Student Management" description="View and manage all students. Coming in Phase 4." />} />
        <Route path="faculty" element={<ComingSoon title="Faculty Management" description="View and manage faculty. Coming in Phase 4." />} />
        <Route path="timetable" element={<ComingSoon title="Timetable Management" description="Smart timetable with conflict detection. Coming in Phase 8." />} />
        <Route path="rooms" element={<ComingSoon title="Room Management" description="Room utilization analytics and management. Coming in Phase 8." />} />
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
        <Route path="classes" element={<ComingSoon title="My Classes" description="Detailed class views with health score breakdown. Coming in Phase 4." />} />
        <Route path="classes/:id" element={<ComingSoon title="Class Detail" description="Detailed analytics for specific class. Coming in Phase 4." />} />
        <Route path="attendance" element={<ComingSoon title="Attendance Management" description="QR-based smart attendance with analytics. Coming in Phase 5." />} />
        <Route path="assignments" element={<ComingSoon title="Assignment Management" description="Create, manage, and evaluate assignments. Coming in Phase 6." />} />
        <Route path="risk" element={<ComingSoon title="At-Risk Students" description="Early warning system with explainable risk scores. Coming in Phase 11." />} />
        <Route path="risk/:id" element={<ComingSoon title="Student Risk Detail" description="Detailed student risk profile and intervention recommendations. Coming in Phase 11." />} />
        <Route path="performance" element={<ComingSoon title="Performance Analytics" description="Class performance trends and subject analytics. Coming in Phase 7." />} />
        <Route path="timetable" element={<ComingSoon title="My Timetable" description="Personal schedule view. Coming in Phase 8." />} />
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
        <Route path="attendance" element={<ComingSoon title="My Attendance" description="Detailed attendance history and trends. Coming in Phase 5." />} />
        <Route path="assignments" element={<ComingSoon title="Assignments" description="View, submit, and track assignments. Coming in Phase 6." />} />
        <Route path="performance" element={<ComingSoon title="My Performance" description="Subject-wise marks, trends, and recommendations. Coming in Phase 7." />} />
        <Route path="timetable" element={<ComingSoon title="My Timetable" description="Weekly class schedule. Coming in Phase 8." />} />
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
