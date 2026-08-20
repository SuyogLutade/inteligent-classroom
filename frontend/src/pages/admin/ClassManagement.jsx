import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { Plus, Users, School, Layers, UserCheck } from "lucide-react";

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Create form state
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [batch, setBatch] = useState("2022-26");
  const [departmentId, setDepartmentId] = useState("dept-1");
  const [semester, setSemester] = useState(6);
  const [classTeacherId, setClassTeacherId] = useState("");

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await api.classes.getAll();
      setClasses(data);
      const tData = await api.teachers.getAll();
      setTeachers(tData);
      setError("");
    } catch (err) {
      setError("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!id || !name || !section) {
      setError("Please fill all required fields");
      return;
    }

    try {
      await api.classes.create({
        id,
        name,
        section,
        batch,
        department_id: departmentId,
        semester: parseInt(semester),
        class_teacher_id: classTeacherId || null,
      });
      setShowModal(false);
      // Reset form
      setId("");
      setName("");
      setSection("");
      setClassTeacherId("");
      fetchClasses();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create class");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-accent animate-pulse rounded" />
          <div className="h-10 w-32 bg-accent animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-accent animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Class Management</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage academic classrooms</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Class
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-critical/10 text-critical text-sm rounded-lg border border-critical/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => {
          // Health scores mock based on database id
          const healthScore = cls.id === "cls-1" ? 85 : cls.id === "cls-2" ? 72 : 58;
          const healthStatus = healthScore >= 80 ? "healthy" : healthScore >= 70 ? "warning" : "critical";
          const badgeClass =
            healthStatus === "healthy"
              ? "bg-healthy/10 text-healthy border-healthy/20"
              : healthStatus === "warning"
              ? "bg-warning/10 text-warning border-warning/20"
              : "bg-critical/10 text-critical border-critical/20";

          return (
            <Card key={cls.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold">{cls.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Section {cls.section} · Batch {cls.batch}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeClass}`}>
                    Health: {healthScore}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{cls.strength || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Layers className="w-4 h-4 text-violet-500" />
                    <span>Semester {cls.semester}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                    HOD/Advisor: {teachers.find(t => t.id === cls.class_teacher_id)?.name || "Unassigned"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/classes/${cls.id}`)}
                  >
                    View Class
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Class Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-xl animate-scale-in">
            <h2 className="text-lg font-bold mb-4">Create New Classroom</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Class ID (unique)</label>
                <input
                  type="text"
                  placeholder="e.g. cls-4"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Class Name</label>
                <input
                  type="text"
                  placeholder="e.g. CSE-D"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Section</label>
                <input
                  type="text"
                  placeholder="e.g. D"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Class Advisor / Teacher</label>
                <select
                  value={classTeacherId}
                  onChange={(e) => setClassTeacherId(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                >
                  <option value="">Select Class Teacher</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Class</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
