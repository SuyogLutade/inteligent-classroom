import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Plus, BookOpen, Clock, FileText, Check, AlertCircle } from "lucide-react";

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Creation form state
  const [showCreate, setShowCreate] = useState(false);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxMarks, setMaxMarks] = useState(100);

  // Submissions view state
  const [selectedAsgn, setSelectedAsgn] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  
  // Grading form state
  const [gradingSubId, setGradingSubId] = useState(null);
  const [gradeScore, setGradeScore] = useState("");
  const [gradeFeedback, setGradeFeedback] = useState("");

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await api.assignments.getAll("", user.id);
      setAssignments(data);
      
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
      setError("Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAssignments();
    }
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!id || !title || !classroomId || !subjectId || !dueDate) {
      setError("All fields are required");
      return;
    }
    try {
      await api.assignments.create({
        id,
        title,
        description,
        class_id: classroomId,
        subject_id: subjectId,
        teacher_id: user.id,
        due_date: dueDate,
        max_marks: parseInt(maxMarks)
      });
      setShowCreate(false);
      // Reset form
      setId("");
      setTitle("");
      setDescription("");
      setClassroomId("");
      setSubjectId("");
      setDueDate("");
      fetchAssignments();
    } catch (err) {
      setError("Failed to create assignment");
    }
  };

  const handleViewSubmissions = async (asgn) => {
    setSelectedAsgn(asgn);
    setGradingSubId(null);
    try {
      setLoadingSubs(true);
      const list = await api.assignments.getSubmissions(asgn.id);
      setSubmissions(list);
    } catch (err) {
      setError("Failed to load submissions list");
    } finally {
      setLoadingSubs(false);
    }
  };

  const handleGrade = async (e) => {
    e.preventDefault();
    if (!gradingSubId || !gradeScore) return;
    try {
      await api.assignments.gradeSubmission(gradingSubId, gradeScore, gradeFeedback);
      setGradingSubId(null);
      setGradeScore("");
      setGradeFeedback("");
      // Reload submissions list
      const list = await api.assignments.getSubmissions(selectedAsgn.id);
      setSubmissions(list);
    } catch (err) {
      setError("Failed to submit evaluation");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Assignment Intelligence</h1>
          <p className="text-sm text-muted-foreground">Distribute, evaluate, and track student assignments</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Assignment
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-critical/10 text-critical text-sm rounded-lg border border-critical/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-muted-foreground animate-pulse font-semibold">Loading assignments...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of assignments */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold">Assigned Tasks ({assignments.length})</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {assignments.map((a) => (
                <Card
                  key={a.id}
                  onClick={() => handleViewSubmissions(a)}
                  className={`cursor-pointer hover:border-primary transition-colors ${selectedAsgn?.id === a.id ? 'border-primary shadow-sm bg-accent/20' : ''}`}
                >
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm text-foreground truncate max-w-[150px]">{a.title}</h3>
                        <Badge>{a.subjectCode}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.classroom}</p>
                    </div>

                    <div className="text-xs text-muted-foreground flex justify-between items-center border-t border-border pt-2">
                      <span>Due: <strong>{a.dueDate}</strong></span>
                      <span>Submissions: <strong>{a.submissionRate}%</strong></span>
                    </div>
                  </div>
                </Card>
              ))}
              {assignments.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No assignments created yet.</p>
              )}
            </div>
          </div>

          {/* Submissions Detail */}
          <div className="lg:col-span-2">
            {selectedAsgn ? (
              <Card className="h-full">
                <CardHeader className="border-b border-border py-4">
                  <CardTitle className="text-base font-bold flex justify-between items-center">
                    <span>Submissions for: {selectedAsgn.title}</span>
                    <Badge variant={selectedAsgn.status}>{selectedAsgn.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {loadingSubs ? (
                    <div className="p-12 text-center text-muted-foreground">Loading student submissions...</div>
                  ) : (
                    <div className="divide-y divide-border">
                      {submissions.map((sub) => (
                        <div key={sub.studentId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-sm">{sub.studentName}</p>
                            <p className="text-xs text-muted-foreground font-mono">{sub.rollNo}</p>
                            {sub.submittedAt && (
                              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-primary" /> Submitted at {sub.submittedAt.split(" ")[0]}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            {sub.status === "evaluated" ? (
                              <div className="text-right">
                                <Badge variant="healthy" className="flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Evaluated
                                </Badge>
                                <p className="text-xs font-bold text-foreground mt-1">{sub.marksObtained} / {selectedAsgn.maxMarks}</p>
                              </div>
                            ) : sub.status === "submitted" ? (
                              <div>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setGradingSubId(sub.submissionId);
                                    setGradeScore("");
                                    setGradeFeedback("");
                                  }}
                                >
                                  Grade Submission
                                </Button>
                              </div>
                            ) : (
                              <Badge variant="critical" className="flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> Missing
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="bg-card border border-border p-12 rounded-xl text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                <FileText className="w-12 h-12 text-muted-foreground/60 mb-2" />
                <p>Select an assignment from the list on the left to evaluate student submissions.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {gradingSubId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-xl animate-scale-in">
            <h2 className="text-lg font-bold mb-4 font-bold">Grade Student Submission</h2>
            <form onSubmit={handleGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Score Obtained (out of {selectedAsgn?.maxMarks})</label>
                <input
                  type="number"
                  placeholder="e.g. 85"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Feedback</label>
                <textarea
                  placeholder="Provide brief feedback to the student..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm h-24"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setGradingSubId(null)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Grade</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-xl animate-scale-in">
            <h2 className="text-lg font-bold mb-4">Create Assignment Task</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Assignment ID (unique)</label>
                <input
                  type="text"
                  placeholder="e.g. asgn-6"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Assignment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Red Black Trees"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Description / Instructions</label>
                <textarea
                  placeholder="Describe the instructions for this assignment..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Classroom</label>
                  <select
                    value={classroomId}
                    onChange={(e) => setClassroomId(e.target.value)}
                    className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                    required
                  >
                    <option value="">Select Classroom</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Max Score</label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Task</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
