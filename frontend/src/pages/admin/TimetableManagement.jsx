import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Calendar, Plus, Clock, MapPin, User, AlertTriangle } from "lucide-react";

export default function TimetableManagement() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  // Create form state
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const fetchData = async () => {
    try {
      setLoading(true);
      const tt = await api.timetable.getAll(filterClass);
      setTimetable(tt);
      
      const cList = await api.classes.getAll();
      setClasses(cList);
      
      const tList = await api.teachers.getAll();
      setTeachers(tList);
      
      const rList = await api.rooms.getAll();
      setRooms(rList);

      // Populate dummy subjects list
      setSubjects([
        { id: "sub-1", name: "Data Structures & Algorithms" },
        { id: "sub-2", name: "Database Management Systems" },
        { id: "sub-3", name: "Operating Systems" },
        { id: "sub-4", name: "Computer Networks" },
        { id: "sub-5", name: "Software Engineering" },
        { id: "sub-6", name: "Machine Learning" }
      ]);
    } catch (err) {
      setError("Failed to fetch timetable slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterClass]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!classId || !subjectId || !teacherId || !roomId) {
      setError("All scheduling fields are required");
      return;
    }
    try {
      await api.timetable.create({
        class_id: classId,
        subject_id: subjectId,
        teacher_id: teacherId,
        room_id: roomId,
        day,
        start_time: startTime,
        end_time: endTime
      });
      setShowModal(false);
      setClassId("");
      setSubjectId("");
      setTeacherId("");
      setRoomId("");
      setError("");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Conflict detected: Room/Teacher double booked");
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Timetable Management</h1>
          <p className="text-sm text-muted-foreground">Schedule classes, assign rooms, and resolve conflicts</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Schedule Slot
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-critical/10 text-critical text-sm rounded-lg border border-critical/20 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter by class */}
      <div className="flex bg-card border border-border p-4 rounded-xl items-center gap-3">
        <label className="text-sm font-semibold">Filter Classroom Schedule:</label>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="p-2 border border-border bg-background rounded-lg text-sm min-w-[200px]"
        >
          <option value="">All Classrooms</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground animate-pulse">Loading schedules...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {days.map((d) => {
            const slots = timetable.filter(s => s.day === d);
            
            return (
              <Card key={d}>
                <CardHeader className="py-3 border-b border-border bg-accent/20">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-primary" />
                    {d}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {slots.map((s) => (
                      <div key={s.id} className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-accent/10 ${s.hasConflict ? 'bg-critical/5 border-l-4 border-l-critical' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{s.startTime} - {s.endTime}</p>
                            <p className="text-xs text-muted-foreground">Academic Hour</p>
                          </div>
                        </div>

                        <div className="flex-1 max-w-sm">
                          <p className="font-bold text-sm text-foreground">{s.subject}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3 text-primary" />
                            {s.teacher}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-violet-500" />
                            <span>Room: <strong>{s.room}</strong></span>
                          </div>
                          <Badge variant="outline">{s.classroom}</Badge>
                          {s.hasConflict && (
                            <Badge variant="critical" className="flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="w-3 h-3" />
                              Conflict ({s.conflictType})
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {slots.length === 0 && (
                      <p className="text-xs text-center py-6 text-muted-foreground italic">No slots scheduled for {d}.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Schedule Slot Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-xl animate-scale-in">
            <h2 className="text-lg font-bold mb-4">Schedule Timetable Slot</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Select Day</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Classroom</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                    required
                  >
                    <option value="">Select Classroom</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Room</label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                >
                  <option value="">Select Room</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Subject</label>
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

              <div>
                <label className="block text-xs font-medium mb-1">Instructor</label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                >
                  <option value="">Select Instructor</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
