import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { ClipboardList, CheckCircle, Clock } from "lucide-react";

export default function MyAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await api.assignments.getAll("", "", user.id);
      setAssignments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAssignments();
    }
  }, [user]);

  const handleSubmit = async (asgnId) => {
    try {
      setSubmittingId(asgnId);
      await api.assignments.submit(asgnId, user.id);
      fetchAssignments();
    } catch (err) {
      alert("Failed to submit assignment");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading assignments list...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Assignments</h1>
        <p className="text-sm text-muted-foreground">View pending academic tasks, submit work, and review grades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((a) => {
          const isSubmitted = !!a.submission;
          const status = a.submission?.status || a.status;

          return (
            <Card key={a.id} className={isSubmitted ? "border-l-4 border-l-healthy" : "border-l-4 border-l-warning"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{a.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.subject} · {a.teacherName}</p>
                  </div>
                  <Badge variant={status}>{status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">{a.description || "No instructions provided."}</p>
                
                <div className="text-xs text-muted-foreground flex justify-between items-center border-t border-border pt-3">
                  <span>Due: <strong>{a.dueDate}</strong></span>
                  <span>Max Marks: <strong>{a.maxMarks}</strong></span>
                </div>

                {/* Submissions logic */}
                {isSubmitted ? (
                  <div className="p-3 bg-accent/20 rounded-lg text-xs space-y-1.5">
                    <p className="font-semibold text-foreground flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-healthy" /> Submitted successfully
                    </p>
                    {a.submission.status === "evaluated" ? (
                      <div className="space-y-1">
                        <p className="font-bold text-primary">Score: {a.submission.marksObtained} / {a.maxMarks}</p>
                        <p className="italic text-muted-foreground">Feedback: "{a.submission.feedback || 'None'}"</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">Waiting for instructor evaluation.</p>
                    )}
                  </div>
                ) : (
                  <div className="pt-2">
                    <Button
                      onClick={() => handleSubmit(a.id)}
                      disabled={submittingId === a.id}
                      className="w-full flex items-center justify-center gap-1.5"
                    >
                      <ClipboardList className="w-4 h-4" />
                      {submittingId === a.id ? "Submitting..." : "Submit Assignment"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {assignments.length === 0 && (
          <div className="col-span-2 bg-card border border-border p-12 rounded-xl text-center text-muted-foreground">
            No assignments currently active. You're fully caught up!
          </div>
        )}
      </div>
    </div>
  );
}
