import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Calendar, Save, CheckCircle, AlertTriangle } from "lucide-react";

export default function AttendancePage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Selection
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [dateStr, setDateStr] = useState(new Date().toISOString().split("T")[0]);
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const stats = await api.dashboard.getTeacherStats(user.id);
        setClasses(stats.classes || []);
        
        // Fetch all subjects for this teacher
        const tList = await api.teachers.getAll();
        const tSelf = tList.find(t => t.id === user.id);
        
        // Match mock/seed subject names to codes
        const mockSubs = [
          { id: "sub-1", name: "Data Structures & Algorithms", code: "DSA" },
          { id: "sub-2", name: "Database Management Systems", code: "DBMS" },
          { id: "sub-3", name: "Operating Systems", code: "OS" },
          { id: "sub-4", name: "Computer Networks", code: "CN" },
          { id: "sub-5", name: "Software Engineering", code: "SE" },
          { id: "sub-6", name: "Machine Learning", code: "ML" }
        ];
        
        const mySubs = mockSubs.filter(s => tSelf?.subjects?.includes(s.name) || tSelf?.subjects?.includes(s.id));
        setSubjects(mySubs.length > 0 ? mySubs : mockSubs.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    if (user?.id) {
      fetchMetadata();
    }
  }, [user]);

  const loadAttendance = async () => {
    if (!selectedClass || !selectedSubject || !dateStr) return;
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const list = await api.attendance.getRecords(selectedClass, selectedSubject, dateStr);
      setRecords(list);
    } catch (err) {
      setError("Failed to load attendance list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [selectedClass, selectedSubject, dateStr]);

  const handleStatusChange = (studentId, newStatus) => {
    setRecords(records.map(r => r.studentId === studentId ? { ...r, status: newStatus } : r));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");
      await api.attendance.saveBatch(selectedClass, selectedSubject, dateStr, records);
      setMessage("Attendance records saved successfully!");
    } catch (err) {
      setError("Failed to save attendance records");
    } finally {
      setSaving(false);
    }
  };

  const markAll = (status) => {
    setRecords(records.map(r => ({ ...r, status })));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Attendance Management</h1>
        <p className="text-sm text-muted-foreground">Select a class, subject, and date to record daily student attendance</p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-card border border-border p-4 rounded-xl">
        <div>
          <label className="block text-xs font-semibold mb-1">Classroom</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-2 border border-border bg-background rounded-lg text-sm"
          >
            <option value="">Select Class</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2 border border-border bg-background rounded-lg text-sm"
          >
            <option value="">Select Subject</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Date</label>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full p-2 border border-border bg-background rounded-lg text-sm"
          />
        </div>
      </div>

      {message && (
        <div className="p-3 bg-healthy/10 text-healthy text-sm rounded-lg border border-healthy/20 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-critical/10 text-critical text-sm rounded-lg border border-critical/20 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {selectedClass && selectedSubject ? (
        <Card>
          <CardHeader className="py-3 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-3">
            <CardTitle className="text-base font-bold">Student Attendance Sheet</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => markAll("Present")}>
                Mark All Present
              </Button>
              <Button variant="outline" size="sm" onClick={() => markAll("Absent")}>
                Mark All Absent
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-muted-foreground">Loading student list...</div>
            ) : (
              <div className="divide-y divide-border">
                {records.map((r) => (
                  <div key={r.studentId} className="p-4 flex items-center justify-between hover:bg-accent/10">
                    <div>
                      <p className="font-semibold text-sm">{r.studentName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{r.rollNo}</p>
                    </div>

                    <div className="flex gap-2">
                      {["Present", "Absent", "Late"].map((st) => {
                        const active = r.status === st;
                        const btnClass =
                          st === "Present"
                            ? active ? "bg-healthy text-white" : "text-healthy hover:bg-healthy/10"
                            : st === "Absent"
                            ? active ? "bg-critical text-white" : "text-critical hover:bg-critical/10"
                            : active ? "bg-warning text-white" : "text-warning hover:bg-warning/10";
                        return (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(r.studentId, st)}
                            className={`px-3 py-1.5 rounded-lg border border-border text-xs font-semibold transition-colors ${btnClass}`}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {records.length === 0 && (
                  <p className="text-sm text-center py-12 text-muted-foreground italic">
                    Select criteria above to load students list.
                  </p>
                )}
              </div>
            )}
            
            {records.length > 0 && (
              <div className="p-4 border-t border-border flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Attendance"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="bg-card border border-border p-12 rounded-xl text-center text-muted-foreground">
          Please select a classroom and subject from the list to load student attendance sheet.
        </div>
      )}
    </div>
  );
}
