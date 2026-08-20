import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Plus, Search, Mail, Phone, BookOpen, Clock } from "lucide-react";

export default function FacultyManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  // Create form state
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState("dept-1");
  const [experience, setExperience] = useState(5);
  const [phone, setPhone] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.teachers.getAll(search);
      setTeachers(data);
    } catch (err) {
      setError("Failed to fetch faculty staff list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!id || !name || !email || !phone) {
      setError("All fields are required");
      return;
    }
    try {
      await api.teachers.create({
        id,
        name,
        email,
        password: "teacher123",
        department_id: departmentId,
        experience: parseInt(experience),
        phone,
      });
      setShowModal(false);
      // Reset form
      setId("");
      setName("");
      setEmail("");
      setPhone("");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create teacher");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Faculty Management</h1>
          <p className="text-sm text-muted-foreground">Manage and assign instructors and departments</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Instructor
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-critical/10 text-critical text-sm rounded-lg border border-critical/20">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex bg-card border border-border p-4 rounded-xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search instructors by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border bg-background rounded-lg text-sm"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="p-12 text-center text-muted-foreground">Loading instructors list...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((t) => (
            <Card key={t.id} className="hover:shadow-md transition-shadow">
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-lg">
                    {t.name.replace("Prof. ", "").replace("Dr. ", "")[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{t.name}</h3>
                    <p className="text-xs text-muted-foreground">{t.department}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate">{t.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>{t.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{t.experience} years experience</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex flex-wrap gap-1.5">
                  {t.classes.map((cls, idx) => (
                    <Badge key={idx} variant="outline">{cls}</Badge>
                  ))}
                  {t.classes.length === 0 && (
                    <span className="text-[10px] text-muted-foreground">No classes assigned</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Teacher Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-xl animate-scale-in">
            <h2 className="text-lg font-bold mb-4">Add Instructor</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Instructor ID (unique)</label>
                <input
                  type="text"
                  placeholder="e.g. t-4"
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
                  placeholder="e.g. Prof. Rohit Patil"
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
                  placeholder="name@smartclass.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Department</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                >
                  <option value="dept-1">Computer Science & Engineering</option>
                  <option value="dept-2">Electronics & Communication</option>
                  <option value="dept-3">Mechanical Engineering</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Experience (years)</label>
                <input
                  type="number"
                  placeholder="e.g. 5"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43214"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
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

