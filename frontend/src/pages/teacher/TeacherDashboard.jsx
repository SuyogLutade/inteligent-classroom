import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { getGreeting } from "../../utils/helpers";
import { StatCard } from "../../components/common/StatCard";
import { ClassHealthCard } from "../../components/common/HealthScore";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/Card";
import { Badge, RiskBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { classrooms as mockClassrooms, students as mockStudents, assignments as mockAssignments, notifications, todaySchedule, teachers, subjects } from "../../data/mockData";
import { calculateRiskScore } from "../../utils/riskScore";
import {
  Users, ClipboardList, BookCheck, AlertTriangle, Clock,
  ArrowRight, Bell, TrendingDown, CheckCircle2, BarChart2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dbStats, setDbStats] = useState(null);
  const [dbAssignments, setDbAssignments] = useState([]);

  useEffect(() => {
    if (user?.id) {
      api.dashboard.getTeacherStats(user.id).then(setDbStats).catch(console.error);
      api.assignments.getAll("", user.id).then(setDbAssignments).catch(console.error);
    }
  }, [user]);

  // Get teacher's classes
  const teacher = teachers.find((t) => t.id === user?.id) || teachers[0];
  const myAssignments = dbAssignments.length > 0
    ? dbAssignments
    : mockAssignments.filter((a) => teacher.subjects.includes(a.subject));
  const myClasses = dbStats
    ? dbStats.classes.map((c) => ({
        ...c,
        // Map keys if needed or keep backend keys
        strength: c.strength,
        healthScore: c.healthScore,
        attendance: c.attendance,
      }))
    : mockClassrooms.filter((c) => teacher.classes.includes(c.id));

  // Get at-risk students
  const riskStudents = dbStats
    ? dbStats.riskStudents
    : mockStudents
        .filter((s) => teacher.classes.includes(s.classroom))
        .map((s) => ({ ...s, risk: calculateRiskScore(s) }))
        .filter((s) => s.risk.level !== "low")
        .sort((a, b) => b.risk.score - a.risk.score);

  // Pending evaluations
  const pendingEvals = dbStats
    ? dbStats.pendingEvaluations
    : mockAssignments
        .filter((a) => teacher.subjects.includes(a.subject))
        .reduce((sum, a) => sum + Math.round(a.submissionRate * 0.6), 0);

  // Today's schedule
  const todaySlots = dbStats
    ? dbStats.todaySchedule
    : (todaySchedule["cls-1"] || []);

  // Performance data for chart
  const perfData = myClasses.map((c) => ({
    name: c.name,
    health: c.healthScore,
    attendance: c.attendance,
    performance: c.academicPerformance || 78,
  }));

  const unreadCount = notifications.teacher.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div {...fadeIn} transition={{ duration: 0.3 }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {getGreeting()}, {teacher.name.replace("Prof. ", "").replace("Dr. ", "").split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              {" · "}
              {todaySlots.length} classes today
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/teacher/attendance")}>
              <ClipboardList className="w-4 h-4" />
              Take Attendance
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick stats */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Classes"
          value={todaySlots.length}
          icon={Clock}
          description="Scheduled for today"
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Pending Evaluations"
          value={pendingEvals}
          icon={BookCheck}
          description="Submissions to mark"
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
          trend={-5}
        />
        <StatCard
          title="At-Risk Students"
          value={riskStudents.length}
          icon={AlertTriangle}
          description="Need intervention"
          iconColor="text-critical"
          iconBg="bg-critical-light"
        />
        <StatCard
          title="Active Assignments"
          value={myAssignments.length}
          icon={BookCheck}
          description="Across my classes"
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
      </motion.div>

      {/* Alert for critical class */}
      {myClasses.some((c) => c.healthStatus === "critical") && (
        <motion.div {...fadeIn} transition={{ delay: 0.15 }} className="alert-critical">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Critical Class Needs Attention</p>
            <p className="text-xs mt-0.5">
              {myClasses.find((c) => c.healthStatus === "critical")?.name} health score is{" "}
              {myClasses.find((c) => c.healthStatus === "critical")?.healthScore}/100.
              Attendance has dropped significantly. <button onClick={() => navigate("/teacher/risk")} className="underline font-medium">View at-risk students →</button>
            </p>
          </div>
        </motion.div>
      )}

      {/* My Classes Health */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">My Class Health</h2>
          <button onClick={() => navigate("/teacher/classes")} className="text-xs text-primary hover:underline flex items-center gap-1">
            Detailed analytics <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {myClasses.map((cls) => (
            <ClassHealthCard
              key={cls.id}
              classroom={cls}
              onClick={() => navigate(`/teacher/classes/${cls.id}`)}
            />
          ))}
        </div>
      </motion.div>

      {/* At-risk students + Today's schedule */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* At-risk students */}
        <motion.div {...fadeIn} transition={{ delay: 0.25 }} className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>At-Risk Students</CardTitle>
                  <CardDescription>{riskStudents.length} students need your attention</CardDescription>
                </div>
                <button onClick={() => navigate("/teacher/risk")} className="text-xs text-primary hover:underline flex items-center gap-1">
                  Full report <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {riskStudents.length === 0 ? (
                <div className="flex items-center gap-2 text-healthy text-sm py-4">
                  <CheckCircle2 className="w-4 h-4" />
                  No at-risk students. All performing well!
                </div>
              ) : (
                <div className="space-y-2">
                  {riskStudents.slice(0, 5).map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/teacher/risk/${s.id}`)}
                    >
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground flex-shrink-0">
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">
                            Attendance: <span className={s.attendance < 65 ? "text-critical font-medium" : "text-warning font-medium"}>{s.attendance}%</span>
                          </span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">
                            Risk: <span className="font-medium">{s.risk.score}</span>
                          </span>
                        </div>
                      </div>
                      <RiskBadge level={s.risk.level} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's schedule */}
        <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Monday, {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {todaySlots.map((slot, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="text-center flex-shrink-0 w-14">
                    <p className="text-xs font-semibold text-foreground">{slot.time}</p>
                    <p className="text-[10px] text-muted-foreground">1hr</p>
                  </div>
                  <div className="h-full w-px bg-border flex-shrink-0 my-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{slot.subject}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{slot.room}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Assignment overview */}
      <motion.div {...fadeIn} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assignment Analytics</CardTitle>
                <CardDescription>Submission rates across your assignments</CardDescription>
              </div>
              <button onClick={() => navigate("/teacher/assignments")} className="text-xs text-primary hover:underline flex items-center gap-1">
                Manage <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myAssignments.map((a) => (
                <div key={a.id} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-foreground truncate">{a.title}</p>
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">{a.submissionRate}%</span>
                        <Badge variant={a.submissionRate >= 80 ? "healthy" : a.submissionRate >= 60 ? "warning" : "critical"}>
                          {a.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${a.submissionRate}%`,
                          backgroundColor: a.submissionRate >= 80 ? "#16a34a" : a.submissionRate >= 60 ? "#d97706" : "#dc2626",
                        }}
                      />
                    </div>
                    {a.submissionRate < 70 && (
                      <p className="text-[10px] text-critical mt-1 font-medium">
                        ⚠ Only {a.submissionRate}% completion — {a.lateSubmissions} late submissions
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
