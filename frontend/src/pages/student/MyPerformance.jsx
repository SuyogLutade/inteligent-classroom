import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Award, TrendingUp, TrendingDown, BookOpen } from "lucide-react";

export default function MyPerformance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        const list = await api.performance.getStudentPerformance(user.id);
        setRecords(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchPerformance();
    }
  }, [user]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Performance Analytics</h1>
        <p className="text-sm text-muted-foreground">Monitor subject averages, assessment histories, and performance trends</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground">Loading performance data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {records.map((r) => {
            const trendClass = r.trend > 0 ? "text-healthy" : (r.trend < 0 ? "text-critical" : "text-muted-foreground");
            const TrendIcon = r.trend > 0 ? TrendingUp : TrendingDown;

            return (
              <Card key={r.subjectId}>
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-base font-bold flex justify-between items-center">
                    <span className="truncate max-w-[200px]">{r.subjectName}</span>
                    <Badge variant="outline">{r.subjectCode}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex justify-between items-center bg-accent/20 p-3 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Subject Average</p>
                      <p className="text-xl font-bold mt-0.5 text-foreground">{r.average}%</p>
                    </div>
                    {r.trend !== 0 && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Recent Trend</p>
                        <span className={`inline-flex items-center gap-1 text-sm font-bold mt-0.5 ${trendClass}`}>
                          <TrendIcon className="w-4 h-4" />
                          {r.trend > 0 ? `+${r.trend}` : r.trend}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground">Assessment History</p>
                    <div className="divide-y divide-border">
                      {r.marks.map((m, idx) => (
                        <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                          <span className="font-medium text-foreground">{m.assessment}</span>
                          <span className="font-bold text-primary">{m.score} / {m.max}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {records.length === 0 && (
            <div className="col-span-2 bg-card border border-border p-12 rounded-xl text-center text-muted-foreground">
              No performance records or grades released yet. Check back soon.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
