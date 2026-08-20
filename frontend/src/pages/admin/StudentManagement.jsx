import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Plus, Search, User, Filter } from "lucide-react";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  // Create form state
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [phone, setPhone] = useState("");
  const [classroomId, setClassroomId] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const sData = await api.students.getAll(filterClass, search);
      setStudents(sData);
      const cData = await api.classes.getAll();
      setClasses(cData);
    } catch (err) {
      setError("Failed to fetch students data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterClass, search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!id || !name || !email || !rollNo || !phone) {
      setError("All fields are required");
      return;
    }
    try {
      await api.students.create({
        id,
        name,
        email,
        password: "student123",
        roll_no: rollNo,
        classroom_id: classroomId || null,
        phone,
      });
      setShowModal(false);
      // Reset form
      setId("");
      setName("");
      setEmail("");
      setRollNo("");
      setPhone("");
      setClassroomId("");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create student");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Student Management</h1>
          <p className="text-sm text-muted-foreground">Manage and track student profiles and enrollment</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Student
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-critical/10 text-critical text-sm rounded-lg border border-critical/20">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students by name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border bg-background rounded-lg text-sm"
          />
        </div>
        <div className="w-full sm:w-48 relative">
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border bg-background rounded-lg text-sm appearance-none"
          >
            <option value="">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <Card>
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading student records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-accent text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Roll No</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Attendance</th>
                  <th className="px-6 py-3">Risk Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-accent/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {s.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono">{s.rollNo}</td>
                    <td className="px-6 py-4">{s.classroom}</td>
                    <td className="px-6 py-4 text-muted-foreground">{s.phone}</td>
                    <td className="px-6 py-4">
                      <Badge variant={s.attendance >= 75 ? "healthy" : "critical"}>
                        {s.attendance}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={s.isHighRisk ? "critical" : "healthy"}>
                        {s.isHighRisk ? "High Risk" : "Low Risk"}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                      No student records found matching the query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-xl animate-scale-in">
            <h2 className="text-lg font-bold mb-4">Add New Student</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Student ID (unique)</label>
                <input
                  type="text"
                  placeholder="e.g. stu-25"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@student.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Roll Number</label>
                <input
                  type="text"
                  placeholder="e.g. CSE22A025"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 99000 11025"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Assigned Class (optional)</label>
                <select
                  value={classroomId}
                  onChange={(e) => setClassroomId(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                >
                  <option value="">Select Classroom</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Record</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
