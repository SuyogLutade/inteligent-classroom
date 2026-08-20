import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Users, BookOpen } from "lucide-react";

export default function ClassesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const data = await api.dashboard.getTeacherStats(user.id);
        setClasses(data.classes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchClasses();
    }
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading classes...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Assigned Classes</h1>
        <p className="text-sm text-muted-foreground">Select a classroom to view detailed performance, attendance, and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold">{cls.name}</CardTitle>
                <Badge variant={cls.healthStatus}>{cls.healthScore}/100</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-muted-foreground space-y-2">
                <div className="flex justify-between">
                  <span>Enrolled Students:</span>
                  <span className="font-semibold text-foreground">{cls.strength} students</span>
                </div>
                <div className="flex justify-between">
                  <span>Overall Attendance:</span>
                  <span className="font-semibold text-foreground">{cls.attendance}%</span>
                </div>
              </div>
              <Button
                onClick={() => navigate(`/admin/classes/${cls.id}`)}
                className="w-full mt-2"
                variant="outline"
              >
                Open Class Details
              </Button>
            </CardContent>
          </Card>
        ))}
        {classes.length === 0 && (
          <p className="text-sm text-muted-foreground italic">No classes currently assigned to you.</p>
        )}
      </div>
    </div>
  );
}
