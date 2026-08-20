import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { getGreeting } from "../../utils/helpers";
import { StatCard, AlertStatCard } from "../../components/common/StatCard";
import { ClassHealthCard } from "../../components/common/HealthScore";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import {
  adminStats as mockAdminStats, classrooms, notifications, announcements, rooms, timetableSlots
} from "../../data/mockData";
import {
  Users, GraduationCap, Building2, BarChart2, AlertTriangle,
  Calendar, Bell, TrendingDown, MapPin, CheckCircle2, Clock,
  ArrowRight, Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from "recharts";

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

// Attendance data for quick chart
const attendanceData = [
  { month: "Mar", avg: 88 },
  { month: "Apr", avg: 87 },
  { month: "May", avg: 85 },
  { month: "Jun", avg: 84 },
  { month: "Jul", avg: 85 },
  { month: "Aug", avg: 87 },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dbStats, setDbStats] = useState(null);

  useEffect(() => {
    api.dashboard.getAdminStats().then(setDbStats).catch(console.error);
  }, []);

  const adminStats = dbStats || mockAdminStats;
  const unread = notifications.admin.filter((n) => !n.read);
  const conflicts = timetableSlots.filter((s) => s.hasConflict);
  const uniqueConflicts = adminStats.alerts?.timetableConflicts || Math.ceil(conflicts.length / 2);
  const underutilizedRooms = rooms.filter((r) => r.utilization < 40);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div {...fadeIn} transition={{ duration: 0.3 }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {getGreeting()}, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Smart Campus Overview — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/assistant")}>
            <Zap className="w-4 h-4" />
            Ask AI Assistant
          </Button>
        </div>
      </motion.div>

      {/* Alert banner if there are critical issues */}
      {unread.some(n => n.severity === "critical") && (
        <motion.div {...fadeIn} transition={{ delay: 0.05 }} className="alert-critical">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Attention Required</p>
            <p className="text-xs mt-0.5">
              CSE-C classroom health is critical (58/100). {uniqueConflicts} timetable conflicts detected.
              <button onClick={() => navigate("/admin/classes")} className="ml-1.5 underline font-medium">View details →</button>
            </p>
          </div>
        </motion.div>
      )}

      {/* Main stats */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={adminStats.totalStudents.toLocaleString()}
          icon={GraduationCap}
          description="Across all departments"
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Faculty Members"
          value={adminStats.totalFaculty}
          icon={Users}
          description="Active teaching staff"
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
        <StatCard
          title="Active Classes"
          value={adminStats.activeClasses}
          icon={Building2}
          description="This semester"
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Total Rooms"
          value={adminStats.totalRooms}
          icon={MapPin}
          description="Campus-wide"
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        />
      </motion.div>

      {/* Key metrics row */}
      <motion.div {...fadeIn} transition={{ delay: 0.15 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${adminStats.overallAttendance}%`}
          trend={+1.2}
          icon={CheckCircle2}
          iconColor="text-healthy"
          iconBg="bg-healthy-light"
        />
        <StatCard
          title="Assignment Completion"
          value={`${adminStats.assignmentCompletion}%`}
          trend={-2.1}
          icon={BarChart2}
          iconColor="text-warning"
          iconBg="bg-warning-light"
        />
        <StatCard
          title="Avg Performance"
          value={`${adminStats.avgPerformance}%`}
          trend={-0.8}
          icon={TrendingDown}
          iconColor="text-warning"
          iconBg="bg-warning-light"
        />
        <StatCard
          title="Faculty Utilization"
          value={`${adminStats.facultyUtilization}%`}
          trend={+3.4}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
      </motion.div>

      {/* Alerts row */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Active Alerts
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <AlertStatCard count={adminStats.alerts.attendanceRisks} label="Attendance Risks" severity="critical" icon={AlertTriangle} />
          <AlertStatCard count={adminStats.alerts.performanceRisks} label="Performance Risks" severity="warning" icon={TrendingDown} />
          <AlertStatCard count={uniqueConflicts} label="Timetable Conflicts" severity="warning" icon={Calendar} />
          <AlertStatCard count={adminStats.alerts.roomConflicts} label="Room Conflicts" severity="warning" icon={Building2} />
          <AlertStatCard count={underutilizedRooms.length} label="Underutilized Rooms" severity="info" icon={MapPin} />
        </div>
      </motion.div>

      {/* Two column: Classroom health + chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Classroom Health Cards */}
        <motion.div {...fadeIn} transition={{ delay: 0.25 }} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Classroom Health Overview</h2>
            <button
              onClick={() => navigate("/admin/classes")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {classrooms.map((cls) => (
              <ClassHealthCard
                key={cls.id}
                classroom={cls}
                onClick={() => navigate(`/admin/classes/${cls.id}`)}
              />
            ))}
          </div>
        </motion.div>

        {/* Attendance trend chart */}
        <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
              <CardDescription>Campus-wide 6-month average</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={attendanceData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[80, 92]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v}%`, "Avg Attendance"]} />
                  <Area type="monotone" dataKey="avg" stroke="#2563eb" strokeWidth={2} fill="url(#attGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Timetable conflicts + Recent notifications */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Timetable conflicts */}
        <motion.div {...fadeIn} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Timetable Conflicts</CardTitle>
                  <CardDescription>{uniqueConflicts} conflicts detected</CardDescription>
                </div>
                <button onClick={() => navigate("/admin/timetable")} className="text-xs text-primary hover:underline flex items-center gap-1">
                  View timetable <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {uniqueConflicts === 0 ? (
                <div className="flex items-center gap-2 text-healthy text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  No conflicts detected. Schedule is clean.
                </div>
              ) : (
                <>
                  <div className="alert-warning rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold">Faculty Conflict — Monday 11:00 AM</p>
                        <p className="text-xs mt-0.5 text-warning-foreground/80">
                          Prof. Arjun Sharma is assigned to both CSE-B (ML) and CSE-C (DSA) simultaneously.
                        </p>
                        <p className="text-xs mt-1 font-medium">Suggestion: Move CSE-C to 12:00 PM using Room 103</p>
                      </div>
                    </div>
                  </div>
                  <div className="alert-warning rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold">Room Conflict — Tuesday 14:00</p>
                        <p className="text-xs mt-0.5 text-warning-foreground/80">
                          Room 102 is double-booked for CSE-A (CN) and CSE-B (SE).
                        </p>
                        <p className="text-xs mt-1 font-medium">Suggestion: Reassign CSE-B to Room 207 (available)</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent notifications */}
        <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Notifications</CardTitle>
                  <CardDescription>{unread.length} unread</CardDescription>
                </div>
                <Bell className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {notifications.admin.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-muted/50 ${!n.read ? "bg-blue-50/50" : ""}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    n.severity === "critical" ? "bg-critical" : n.severity === "warning" ? "bg-warning" : "bg-info"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                  {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Underutilized rooms quick view */}
      {underutilizedRooms.length > 0 && (
        <motion.div {...fadeIn} transition={{ delay: 0.45 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Underutilized Rooms</CardTitle>
                  <CardDescription>Rooms with less than 40% utilization — consider reassigning classes</CardDescription>
                </div>
                <button onClick={() => navigate("/admin/rooms")} className="text-xs text-primary hover:underline flex items-center gap-1">
                  All rooms <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {underutilizedRooms.map((room) => (
                  <div key={room.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">{room.name}</p>
                      <p className="text-xs text-muted-foreground">{room.type} · Cap: {room.capacity}</p>
                    </div>
                    <Badge variant="warning" className="ml-auto">{room.utilization}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
