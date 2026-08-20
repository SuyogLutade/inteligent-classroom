import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { AlertTriangle, TrendingDown, Clock, Search } from "lucide-react";

export default function StudentRiskPage() {
  const { user } = useAuth();
  const [riskStudents, setRiskStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        setLoading(true);
        const data = await api.dashboard.getTeacherStats(user.id);
        setRiskStudents(data.riskStudents || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchRisk();
    }
  }, [user]);

  const filtered = riskStudents.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">At-Risk Early Warning System</h1>
        <p className="text-sm text-muted-foreground">Explainable risk warnings based on student attendance, submission rates, and performance trends</p>
      </div>

      <div className="flex bg-card border border-border p-4 rounded-xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search at-risk students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border bg-background rounded-lg text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground">Loading warnings...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((s) => (
            <Card key={s.id} className="border-l-4 border-l-critical">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-foreground">{s.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{s.rollNo} · {s.classroom}</p>
                  </div>
                  <Badge variant="critical">Risk: {s.risk.score}%</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-critical" />
                    Detection Reasons:
                  </p>
                  <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                    {s.risk.reasons.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-border space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Recommended Interventions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline">Schedule Academic Counseling</Badge>
                    <Badge variant="outline">Contact Mentor</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 bg-card border border-border p-12 rounded-xl text-center text-muted-foreground">
              No students flagged as at-risk. Great job!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
