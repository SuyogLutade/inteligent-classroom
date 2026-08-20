import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  Users, BookOpen, Clock, AlertTriangle, ArrowLeft, Plus, Trash2, Calendar
} from "lucide-react";

export default function ClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Selection data for assignments/modals
  const [allStudents, setAllStudents] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [allRooms, setAllRooms] = useState([]);

  // Modals state
  const [showAddStudents, setShowAddStudents] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");

  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [assignTeacherId, setAssignTeacherId] = useState("");
  const [assignSubjectId, setAssignSubjectId] = useState("");

  const [showAddSubject, setShowAddSubject] = useState(false);
  const [addSubjectId, setAddSubjectId] = useState("");

  const [showScheduleSlot, setShowScheduleSlot] = useState(false);
  const [slotDay, setSlotDay] = useState("Monday");
  const [slotStartTime, setSlotStartTime] = useState("09:00");
  const [slotEndTime, setSlotEndTime] = useState("10:00");
  const [slotSubjectId, setSlotSubjectId] = useState("");
  const [slotTeacherId, setSlotTeacherId] = useState("");
  const [slotRoomId, setSlotRoomId] = useState("");

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const data = await api.classes.getDetails(id);
      setDetails(data);

      // Load reference lists
      const students = await api.students.getAll();
      setAllStudents(students);
      const teachers = await api.teachers.getAll();
      setAllTeachers(teachers);
      const subjects = await api.classes.getDetails(id).then(res => res.subjects); // assigned ones
      
      // Load all institution subjects/rooms for selectors
      const allSub = await api.classes.getAll().then(() => [
        { id: "sub-1", name: "Data Structures & Algorithms" },
        { id: "sub-2", name: "Database Management Systems" },
        { id: "sub-3", name: "Operating Systems" },
        { id: "sub-4", name: "Computer Networks" },
        { id: "sub-5", name: "Software Engineering" },
        { id: "sub-6", name: "Machine Learning" }
      ]);
      setAllSubjects(allSub);
      
      const rooms = await api.rooms.getAll();
      setAllRooms(rooms);
    } catch (err) {
      setError("Failed to load classroom details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetails();
  }, [id]);

  const handleEnrollStudents = async () => {
    if (selectedStudentIds.length === 0) return;
    try {
      await api.classes.enrollStudents(id, selectedStudentIds);
      setShowAddStudents(false);
      setSelectedStudentIds([]);
      fetchClassDetails();
    } catch (err) {
      setError("Failed to enroll students");
    }
  };

  const handleRemoveStudent = async (studentId, studentName) => {
    if (!confirm(`Remove ${studentName} from this class?`)) return;
    try {
      await api.classes.unenrollStudent(id, studentId);
      fetchClassDetails();
    } catch (err) {
      setError("Failed to remove student");
    }
  };

  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    if (!assignTeacherId || !assignSubjectId) return;
    try {
      await api.classes.assignTeacher(id, assignTeacherId, assignSubjectId);
      setShowAddTeacher(false);
      fetchClassDetails();
    } catch (err) {
      setError("Failed to assign teacher");
    }
  };

  const handleAssignSubject = async (e) => {
    e.preventDefault();
    if (!addSubjectId) return;
    try {
      await api.classes.assignSubject(id, addSubjectId);
      setShowAddSubject(false);
      fetchClassDetails();
    } catch (err) {
      setError("Failed to assign subject");
    }
  };

  const handleScheduleSlot = async (e) => {
    e.preventDefault();
    if (!slotSubjectId || !slotTeacherId || !slotRoomId) return;
    try {
      await api.timetable.create({
        class_id: id,
        subject_id: slotSubjectId,
        teacher_id: slotTeacherId,
        room_id: slotRoomId,
        day: slotDay,
        start_time: slotStartTime,
        end_time: slotEndTime
      });
      setShowScheduleSlot(false);
      fetchClassDetails();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to schedule slot due to conflict");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading class details...</div>;
  }

  if (!details) {
    return <div className="p-8 text-center text-critical">Classroom details not found.</div>;
  }

  // Candidates for enrollment (students not in this classroom)
  const enrollmentCandidates = allStudents.filter(
    (s) => s.classroomId !== id && s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-accent rounded-lg text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{details.name}</h1>
            <Badge variant={details.healthScore >= 80 ? "healthy" : (details.healthScore >= 70 ? "warning" : "critical")}>
              Health: {details.healthScore}/100
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Semester {details.semester} · {details.department}</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-critical/10 text-critical text-sm rounded-lg border border-critical/20">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-px overflow-x-auto">
        {["overview", "students", "teachers", "subjects", "timetable"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground font-semibold uppercase">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {details.strength}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground font-semibold uppercase">Class Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Badge variant={details.attendance >= 75 ? "healthy" : "critical"}>
                  {details.attendance}%
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground font-semibold uppercase">Class Advisor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold truncate">
                {details.classTeacher}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground font-semibold uppercase">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold text-healthy">
                Active Session
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === "students" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Enrolled Students ({details.students.length})</h2>
            <Button onClick={() => setShowAddStudents(true)} size="sm">
              <Plus className="w-4 h-4 mr-1.5" /> Add Students
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-accent text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-3">Roll No</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Attendance</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {details.students.map((stu) => (
                    <tr key={stu.id} className="hover:bg-accent/40">
                      <td className="px-6 py-4 font-mono font-medium">{stu.rollNo}</td>
                      <td className="px-6 py-4 font-semibold">{stu.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{stu.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={stu.attendance >= 75 ? "healthy" : "critical"}>
                          {stu.attendance}%
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStudent(stu.id, stu.name)}
                          className="text-critical hover:bg-critical/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {details.students.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                        No students enrolled in this classroom yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Teachers Tab */}
      {activeTab === "teachers" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Assigned Instructors</h2>
            <Button onClick={() => setShowAddTeacher(true)} size="sm">
              <Plus className="w-4 h-4 mr-1.5" /> Assign Teacher
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {details.teachers.map((t) => (
              <Card key={t.id}>
                <CardHeader>
                  <CardTitle className="text-base font-bold">{t.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-muted-foreground truncate">Email: {t.email}</p>
                  <p className="text-muted-foreground">Phone: {t.phone}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Subjects Tab */}
      {activeTab === "subjects" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Assigned Subjects</h2>
            <Button onClick={() => setShowAddSubject(true)} size="sm">
              <Plus className="w-4 h-4 mr-1.5" /> Add Subject
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {details.subjects.map((sub) => (
              <Card key={sub.id}>
                <CardHeader>
                  <CardTitle className="text-base font-bold flex justify-between">
                    <span>{sub.name}</span>
                    <Badge>{sub.code}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Credits: {sub.credits}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Timetable Tab */}
      {activeTab === "timetable" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Class Timetable Schedule</h2>
            <Button onClick={() => setShowScheduleSlot(true)} size="sm">
              <Plus className="w-4 h-4 mr-1.5" /> Schedule Slot
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-accent text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-3">Day</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Subject</th>
                    <th className="px-6 py-3">Teacher</th>
                    <th className="px-6 py-3">Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {details.timetable.map((slot) => (
                    <tr key={slot.id} className="hover:bg-accent/40">
                      <td className="px-6 py-4 font-semibold">{slot.day}</td>
                      <td className="px-6 py-4 font-mono">{slot.startTime} - {slot.endTime}</td>
                      <td className="px-6 py-4">{slot.subject}</td>
                      <td className="px-6 py-4">{slot.teacher}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{slot.room}</Badge>
                      </td>
                    </tr>
                  ))}
                  {details.timetable.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                        No timetable slots scheduled yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Enroll Students Modal */}
      {showAddStudents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-lg shadow-xl animate-scale-in">
            <h2 className="text-lg font-bold mb-3">Add Students to {details.name}</h2>
            <input
              type="text"
              placeholder="Search students by name or roll number..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full p-2 border border-border bg-background rounded-lg text-sm mb-4"
            />
            
            <div className="max-h-60 overflow-y-auto divide-y divide-border mb-4 border border-border rounded-lg">
              {enrollmentCandidates.map((s) => (
                <label key={s.id} className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStudentIds.includes(s.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudentIds([...selectedStudentIds, s.id]);
                      } else {
                        setSelectedStudentIds(selectedStudentIds.filter(id => id !== s.id));
                      }
                    }}
                    className="rounded border-border text-primary"
                  />
                  <div>
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{s.rollNo}</p>
                  </div>
                </label>
              ))}
              {enrollmentCandidates.length === 0 && (
                <p className="text-sm text-center py-8 text-muted-foreground">No students available for enrollment.</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => { setShowAddStudents(false); setSelectedStudentIds([]); }}>
                Cancel
              </Button>
              <Button onClick={handleEnrollStudents} disabled={selectedStudentIds.length === 0}>
                Add Selected Students ({selectedStudentIds.length})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Teacher Modal */}
      {showAddTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-xl animate-scale-in">
            <h2 className="text-lg font-bold mb-4">Assign Teacher & Subject</h2>
            <form onSubmit={handleAssignTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Select Instructor</label>
                <select
                  value={assignTeacherId}
                  onChange={(e) => setAssignTeacherId(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                >
                  <option value="">Select Instructor</option>
                  {allTeachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Select Subject</label>
                <select
                  value={assignSubjectId}
                  onChange={(e) => setAssignSubjectId(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                >
                  <option value="">Select Subject</option>
                  {details.subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowAddTeacher(false)}>
                  Cancel
                </Button>
                <Button type="submit">Assign</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-xl animate-scale-in">
            <h2 className="text-lg font-bold mb-4">Add Subject to Class</h2>
            <form onSubmit={handleAssignSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Select Subject</label>
                <select
                  value={addSubjectId}
                  onChange={(e) => setAddSubjectId(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                >
                  <option value="">Select Subject</option>
                  {allSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowAddSubject(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Subject</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Timetable Slot Modal */}
      {showScheduleSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-xl animate-scale-in">
            <h2 className="text-lg font-bold mb-4">Schedule Timetable Slot</h2>
            <form onSubmit={handleScheduleSlot} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Day</label>
                  <select
                    value={slotDay}
                    onChange={(e) => setSlotDay(e.target.value)}
                    className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Room Assignment</label>
                  <select
                    value={slotRoomId}
                    onChange={(e) => setSlotRoomId(e.target.value)}
                    className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                    required
                  >
                    <option value="">Select Room</option>
                    {allRooms.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    value={slotStartTime}
                    onChange={(e) => setSlotStartTime(e.target.value)}
                    className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    value={slotEndTime}
                    onChange={(e) => setSlotEndTime(e.target.value)}
                    className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Subject</label>
                <select
                  value={slotSubjectId}
                  onChange={(e) => setSlotSubjectId(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                >
                  <option value="">Select Subject</option>
                  {details.subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Instructor</label>
                <select
                  value={slotTeacherId}
                  onChange={(e) => setSlotTeacherId(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                >
                  <option value="">Select Instructor</option>
                  {allTeachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowScheduleSlot(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule Slot</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
