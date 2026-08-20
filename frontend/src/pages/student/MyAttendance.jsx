import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Calendar, AlertCircle } from "lucide-react";

export default function MyAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overall, setOverall] = useState(85.0);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const stats = await api.dashboard.getStudentStats(user.id);
        setOverall(stats.student.attendance);
        const list = await api.attendance.getStudentRecords(user.id);
        setRecords(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchAttendance();
    }
  }, [user]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Attendance Records</h1>
          <p className="text-sm text-muted-foreground">Monitor your course attendance stats and requirements</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Overall Rate</p>
          <div className="text-2xl font-bold flex items-center gap-1.5 mt-0.5">
            <Badge variant={overall >= 75 ? "healthy" : "critical"} className="text-base py-1">
              {overall}%
            </Badge>
          </div>
        </div>
      </div>

      {overall < 75 && (
        <div className="p-3 bg-critical/10 text-critical text-sm rounded-lg border border-critical/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Your attendance is below the 75% requirement. Please contact your instructor.</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-muted-foreground animate-pulse">Loading records...</div>
      ) : (
        <Card>
          <CardHeader className="py-3 border-b border-border">
            <CardTitle className="text-base font-bold">Daily Attendance History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
              {records.map((r) => (
                <div key={r.id} className="p-4 flex items-center justify-between hover:bg-accent/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{r.subject}</p>
                      <p className="text-xs text-muted-foreground">{r.date} · Code: {r.subjectCode}</p>
                    </div>
                  </div>

                  <Badge variant={r.status === "Present" ? "healthy" : (r.status === "Late" ? "warning" : "critical")}>
                    {r.status}
                  </Badge>
                </div>
              ))}
              {records.length === 0 && (
                <p className="text-sm text-center py-12 text-muted-foreground italic">No attendance records found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
