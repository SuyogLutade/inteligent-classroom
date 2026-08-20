import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { cn, getInitials } from "../utils/helpers";
import {
  LayoutDashboard, Users, BookOpen, ClipboardList, BarChart2,
  Calendar, Building2, Bell, MessageSquare, LogOut, Menu, X,
  GraduationCap, AlertTriangle, Settings, ChevronRight, BookCheck,
  Map, School
} from "lucide-react";

// Role-based navigation config
const navConfig = {
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Campus View", icon: Map, path: "/admin/campus" },
    { label: "Classes", icon: School, path: "/admin/classes" },
    { label: "Students", icon: GraduationCap, path: "/admin/students" },
    { label: "Faculty", icon: Users, path: "/admin/faculty" },
    { label: "Timetable", icon: Calendar, path: "/admin/timetable" },
    { label: "Rooms", icon: Building2, path: "/admin/rooms" },
    { label: "Analytics", icon: BarChart2, path: "/admin/analytics" },
    { label: "Announcements", icon: Bell, path: "/admin/announcements" },
    { label: "AI Assistant", icon: MessageSquare, path: "/admin/assistant" },
  ],
  teacher: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/teacher" },
    { label: "My Classes", icon: School, path: "/teacher/classes" },
    { label: "Attendance", icon: ClipboardList, path: "/teacher/attendance" },
    { label: "Assignments", icon: BookCheck, path: "/teacher/assignments" },
    { label: "At-Risk Students", icon: AlertTriangle, path: "/teacher/risk" },
    { label: "Performance", icon: BarChart2, path: "/teacher/performance" },
    { label: "Timetable", icon: Calendar, path: "/teacher/timetable" },
    { label: "Announcements", icon: Bell, path: "/teacher/announcements" },
    { label: "AI Assistant", icon: MessageSquare, path: "/teacher/assistant" },
  ],
  student: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/student" },
    { label: "My Attendance", icon: ClipboardList, path: "/student/attendance" },
    { label: "Assignments", icon: BookCheck, path: "/student/assignments" },
    { label: "Performance", icon: BarChart2, path: "/student/performance" },
    { label: "Timetable", icon: Calendar, path: "/student/timetable" },
    { label: "Resources", icon: BookOpen, path: "/student/resources" },
    { label: "Announcements", icon: Bell, path: "/student/announcements" },
    { label: "AI Assistant", icon: MessageSquare, path: "/student/assistant" },
  ],
};

const roleColors = {
  admin: "bg-violet-500",
  teacher: "bg-blue-500",
  student: "bg-emerald-500",
};

const roleLabels = {
  admin: "Administrator",
  teacher: "Teacher",
  student: "Student",
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = navConfig[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">SC</span>
        </div>
        <div>
          <span className="font-bold text-foreground text-sm">SmartClass</span>
          <p className="text-[10px] text-muted-foreground leading-tight">Classroom Intelligence</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path.split("/").length <= 2}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn("sidebar-item", isActive && "active")
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User profile */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent transition-colors">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
            roleColors[user?.role]
          )}>
            {getInitials(user?.name || "U")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{roleLabels[user?.role]}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Sidebar — sticky, never overlaps content */}
      <aside className="hidden lg:flex sidebar flex-col w-64 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex flex-col w-64 bg-card border-r border-border shadow-xl">
            <button
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-accent text-muted-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content — takes remaining width, scrolls independently */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-bold">SC</span>
            </div>
            <span className="font-bold text-sm text-foreground">SmartClass</span>
          </div>
        </header>

        {/* Page content — scrollable */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
