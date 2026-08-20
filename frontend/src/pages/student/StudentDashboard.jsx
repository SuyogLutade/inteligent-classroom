import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { getGreeting, formatTime } from "../../utils/helpers";
import { StatCard } from "../../components/common/StatCard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { students as mockStudents, subjects as mockSubjects, assignments as mockAssignments, notifications, todaySchedule, classrooms as mockClassrooms } from "../../data/mockData";
import { calculateRiskScore } from "../../utils/riskScore";
import {
  ClipboardList, BookCheck, BarChart2, AlertTriangle,
  Clock, Target, BookOpen, ArrowRight, TrendingUp, TrendingDown,
  Star, Bell, CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dbStats, setDbStats] = useState(null);

  useEffect(() => {
    if (user?.id) {
      api.dashboard.getStudentStats(user.id).then(setDbStats).catch(console.error);
    }
  }, [user]);

  // Get student data
  const student = dbStats
    ? {
        ...dbStats.student,
        classroom: dbStats.classroom?.id || "cls-1",
        assignmentCompletion: 85, // mock/fixed for dashboard visual consistency
      }
    : (mockStudents.find((s) => s.id === user?.id) || mockStudents[0]);

  const classroom = dbStats
    ? {
        ...dbStats.classroom,
        strength: 60,
      }
    : mockClassrooms.find((c) => c.id === student.classroom);

  const risk = calculateRiskScore(student);

  // Get student's today schedule
  const todayClasses = dbStats
    ? dbStats.todaySchedule
    : (todaySchedule[student.classroom] || todaySchedule["cls-1"]);

  // Get student's subjects
  const mySubjects = dbStats
    ? dbStats.subjects.map((s) => ({
        ...s,
        avg: s.average,
        trend: s.average > 75 ? 5 : -4,
        marks: [s.average - 5, s.average, s.average + 2],
      }))
    : Object.entries(student.subjects || {}).map(([subId, data]) => ({
        ...mockSubjects.find((s) => s.id === subId),
        ...data,
        subjectId: subId,
      }));

  // Focus subject (weakest/most declining)
  const focusSubject = mockSubjects.find((s) => s.id === student.focusSubject) || mockSubjects[0];

  // Pending assignments
  const pendingAssignments = dbStats
    ? dbStats.pendingAssignments.slice(0, 3)
    : mockAssignments.filter((a) => a.classroom === student.classroom && a.status === "active").slice(0, 3);

  // Performance trend data
  const perfTrend = mySubjects.slice(0, 3).map((s) => ({
    name: s.code || s.name?.slice(0, 4),
    score: s.avg,
    trend: s.trend,
  }));

  // Performance chart from marks history
  const chartData = (mySubjects[0]?.marks || [70, 72, 74]).map((val, i) => ({
    test: `Test ${i + 1}`,
    score: val,
  }));

  const unreadNotifs = notifications.student.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Personalized header */}
      <motion.div {...fadeIn} transition={{ duration: 0.3 }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {getGreeting()}, {student.name.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              {" · "}
              {classroom?.name} · Semester {classroom?.semester}
            </p>
          </div>
          {unreadNotifs > 0 && (
            <button className="relative p-2 rounded-lg hover:bg-accent transition-colors" onClick={() => navigate("/student/announcements")}>
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-critical text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifs}
              </span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Attendance warning if below threshold */}
      {student.attendance < 75 && (
        <motion.div {...fadeIn} transition={{ delay: 0.05 }} className="alert-warning">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Attendance Warning</p>
            <p className="text-xs mt-0.5">
              Your overall attendance is <strong>{student.attendance}%</strong> — below the required 75% threshold.
              {student.consecutiveAbsences > 0 && ` You have ${student.consecutiveAbsences} consecutive absences.`}
              {" "}<button onClick={() => navigate("/student/attendance")} className="underline font-medium">View attendance →</button>
            </p>
          </div>
        </motion.div>
      )}

      {/* Quick stats */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${student.attendance}%`}
          icon={ClipboardList}
          description="Required: 75%"
          iconColor={student.attendance < 75 ? "text-critical" : "text-healthy"}
          iconBg={student.attendance < 75 ? "bg-critical-light" : "bg-healthy-light"}
          trend={student.attendance < 75 ? -3 : 2}
        />
        <StatCard
          title="Pending Assignments"
          value={pendingAssignments.length}
          icon={BookCheck}
          description="Due this week"
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        />
        <StatCard
          title="Avg Performance"
          value={`${Math.round(mySubjects.reduce((s, sub) => s + sub.avg, 0) / (mySubjects.length || 1))}%`}
          icon={BarChart2}
          description="Across all subjects"
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          trend={student.performanceTrend}
        />
        <StatCard
          title="Risk Level"
          value={risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}
          icon={AlertTriangle}
          description={`Risk score: ${risk.score}/100`}
          iconColor={risk.level === "high" ? "text-critical" : risk.level === "medium" ? "text-warning" : "text-healthy"}
          iconBg={risk.level === "high" ? "bg-critical-light" : risk.level === "medium" ? "bg-warning-light" : "bg-healthy-light"}
        />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* MY FOCUS — The star feature */}
        {focusSubject && (
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50/50 to-violet-50/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle>My Focus</CardTitle>
                    <CardDescription>AI-identified priority area</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-primary/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Priority Subject</p>
                      <p className="text-lg font-bold text-foreground mt-0.5">{focusSubject.name}</p>
                      <p className="text-xs text-muted-foreground">{focusSubject.code}</p>
                    </div>
                    <Badge variant="critical">Needs Focus</Badge>
                  </div>
                  <div className="mt-3 p-3 bg-warning-light rounded-lg">
                    <p className="text-xs text-warning-foreground">
                      💡 Your last two {focusSubject.code} assessments are below your average. 
                      Assignment {pendingAssignments[0]?.title?.slice(0, 30)} is due soon.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Recommended Actions</p>
                  <div className="space-y-2">
                    {[
                      { icon: BookCheck, text: `Complete ${pendingAssignments[0]?.title || "pending assignment"}`, urgent: true },
                      { icon: BookOpen, text: `Review ${focusSubject.code} study materials` },
                      { icon: ClipboardList, text: `Attend next ${focusSubject.code} class` },
                    ].map((action, i) => (
                      <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-border hover:bg-muted/30 cursor-pointer transition-colors">
                        <action.icon className={`w-3.5 h-3.5 flex-shrink-0 ${action.urgent ? "text-critical" : "text-muted-foreground"}`} />
                        <p className={`text-xs ${action.urgent ? "font-medium text-foreground" : "text-muted-foreground"}`}>{action.text}</p>
                        {action.urgent && <Badge variant="critical" className="ml-auto">Urgent</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Today's classes */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Today's Classes</CardTitle>
              <CardDescription>{todayClasses.length} classes scheduled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {todayClasses.map((slot, i) => {
                const now = new Date();
                const [h, m] = slot.time.split(":").map(Number);
                const slotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
                const isPast = slotTime < now;
                const isCurrent = !isPast && slotTime - now < 3600000; // within 1hr

                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? "border-primary/30 bg-primary/5"
                        : isPast
                        ? "border-border bg-muted/20 opacity-60"
                        : "border-border hover:bg-muted/30"
                    }`}
                  >
                    <div className="text-right w-12 flex-shrink-0">
                      <p className="text-xs font-bold text-foreground">{slot.time}</p>
                    </div>
                    <div className="w-px bg-border self-stretch flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{slot.subject}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{slot.teacher}</p>
                      <p className="text-[10px] text-muted-foreground">{slot.room}</p>
                    </div>
                    {isCurrent && <Badge variant="info">Now</Badge>}
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Subject performance */}
        <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Latest scores</CardDescription>
                </div>
                <button onClick={() => navigate("/student/performance")} className="text-xs text-primary hover:underline flex items-center gap-1">
                  Details <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mySubjects.map((sub) => (
                <div key={sub.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{sub.code}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs flex items-center gap-0.5 ${sub.trend > 0 ? "text-healthy" : "text-critical"}`}>
                        {sub.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(sub.trend)}%
                      </span>
                      <span className="text-xs font-bold text-foreground w-8 text-right">{sub.avg}%</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${sub.avg}%`,
                        backgroundColor: sub.avg >= 75 ? "#16a34a" : sub.avg >= 60 ? "#d97706" : "#dc2626",
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent notifications */}
      <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>{unreadNotifs} unread</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {notifications.student.slice(0, 4).map((n) => (
                <div key={n.id} className={`flex items-start gap-3 py-3 first:pt-0 last:pb-0 ${!n.read ? "opacity-100" : "opacity-60"}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    n.severity === "critical" ? "bg-critical" : n.severity === "warning" ? "bg-warning" : "bg-info"
                  }`} />
                  <div className="flex-1">
                    <p className="text-xs text-foreground leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                  {!n.read && (
                    <Badge variant={n.severity === "critical" ? "critical" : n.severity === "warning" ? "warning" : "info"}>
                      New
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
