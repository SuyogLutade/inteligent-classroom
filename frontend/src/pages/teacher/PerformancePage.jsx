import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Save, CheckCircle, AlertTriangle } from "lucide-react";

export default function PerformancePage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Selection
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [assessmentName, setAssessmentName] = useState("Internal Assessment 1");
  const [maxMarks, setMaxMarks] = useState(100);
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
        
        setSubjects([
          { id: "sub-1", name: "Data Structures & Algorithms" },
          { id: "sub-2", name: "Database Management Systems" },
          { id: "sub-3", name: "Operating Systems" },
          { id: "sub-4", name: "Computer Networks" },
          { id: "sub-5", name: "Software Engineering" },
          { id: "sub-6", name: "Machine Learning" }
        ]);
      } catch (err) {
        console.error(err);
      }
    };
    if (user?.id) {
      fetchMetadata();
    }
  }, [user]);

  const loadStudents = async () => {
    if (!selectedClass || !selectedSubject || !assessmentName) return;
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const list = await api.performance.getRecords(selectedClass, selectedSubject, assessmentName);
      setRecords(list.map(r => ({
        studentId: r.studentId,
        studentName: r.studentName,
        rollNo: r.rollNo,
        marksObtained: r.marksObtained !== null ? r.marksObtained : ""
      })));
      if (list.length > 0 && list[0].maxMarks) {
        setMaxMarks(list[0].maxMarks);
      }
    } catch (err) {
      setError("Failed to load student lists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [selectedClass, selectedSubject, assessmentName]);

  const handleScoreChange = (studentId, val) => {
    setRecords(records.map(r => r.studentId === studentId ? { ...r, marksObtained: val } : r));
  };

  const handleSave = async () => {
    // Validate scores are below max
    const invalid = records.some(r => parseFloat(r.marksObtained) > parseFloat(maxMarks));
    if (invalid) {
      setError(`Some scores exceed maximum allowed marks (${maxMarks})`);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");
      await api.performance.saveBatch(
        selectedClass,
        selectedSubject,
        assessmentName,
        maxMarks,
        user.id,
        dateStr,
        records.filter(r => r.marksObtained !== "").map(r => ({
          studentId: r.studentId,
          marksObtained: parseFloat(r.marksObtained)
        }))
      );
      setMessage("Performance records saved successfully!");
    } catch (err) {
      setError("Failed to save performance records");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Academic Performance Entry</h1>
        <p className="text-sm text-muted-foreground">Select criteria to enter grading scores for students assessments</p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-card border border-border p-4 rounded-xl">
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
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Assessment Name</label>
          <select
            value={assessmentName}
            onChange={(e) => setAssessmentName(e.target.value)}
            className="w-full p-2 border border-border bg-background rounded-lg text-sm"
          >
            <option value="Internal Assessment 1">Internal Assessment 1</option>
            <option value="Internal Assessment 2">Internal Assessment 2</option>
            <option value="Internal Assessment 3">Internal Assessment 3</option>
            <option value="Mid-Semester Exam">Mid-Semester Exam</option>
            <option value="End-Semester Exam">End-Semester Exam</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Max Score</label>
          <input
            type="number"
            value={maxMarks}
            onChange={(e) => setMaxMarks(e.target.value)}
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
          <CardHeader className="py-3 border-b border-border">
            <CardTitle className="text-base font-bold">Performance Entry Sheet</CardTitle>
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

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Marks"
                        value={r.marksObtained}
                        onChange={(e) => handleScoreChange(r.studentId, e.target.value)}
                        className="w-20 p-2 border border-border bg-background rounded-lg text-sm text-center font-semibold"
                        max={maxMarks}
                        min="0"
                      />
                      <span className="text-sm font-semibold text-muted-foreground">/ {maxMarks}</span>
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
                  {saving ? "Saving..." : "Save Marks"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="bg-card border border-border p-12 rounded-xl text-center text-muted-foreground">
          Please select classroom and subject from the list to load grading performance sheet.
        </div>
      )}
    </div>
  );
}
