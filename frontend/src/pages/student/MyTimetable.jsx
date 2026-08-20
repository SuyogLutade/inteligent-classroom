import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";

export default function MyTimetable() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        // Student's classroom id is in user.classroom
        const data = await api.timetable.getAll(user.classroom);
        setTimetable(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchTimetable();
    }
  }, [user]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Timetable</h1>
        <p className="text-sm text-muted-foreground">View your weekly academic lecture schedule and room allocations</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground animate-pulse">Loading schedule...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {days.map((d) => {
            const slots = timetable.filter(s => s.day === d);
            
            return (
              <Card key={d}>
                <CardHeader className="py-3 border-b border-border bg-accent/20">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {d}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {slots.map((s) => (
                      <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-accent/10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{s.startTime} - {s.endTime}</p>
                            <p className="text-xs text-muted-foreground">Academic Session</p>
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
                        </div>
                      </div>
                    ))}
                    {slots.length === 0 && (
                      <p className="text-xs text-center py-6 text-muted-foreground italic">No classes scheduled for {d}.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
