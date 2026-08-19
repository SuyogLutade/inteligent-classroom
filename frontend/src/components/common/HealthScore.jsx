import { getHealthColor, getHealthLabel, getHealthStatus } from "../../utils/healthScore";
import { cn } from "../../utils/helpers";

// Circular SVG health score ring
export function HealthScoreRing({ score, size = 120, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const dashOffset = circumference - (progress / 100) * circumference;
  const color = getHealthColor(score);
  const status = getHealthStatus(score);

  return (
    <div className="health-score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums" style={{ color }}>{score}</span>
        <span className="text-xs text-muted-foreground font-medium">/ 100</span>
      </div>
    </div>
  );
}

// Horizontal health score bar
export function HealthScoreBar({ score, showLabel = true }) {
  const color = getHealthColor(score);
  const label = getHealthLabel(score);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1.5 text-xs">
          <span className="font-medium text-foreground">{label}</span>
          <span className="font-bold tabular-nums" style={{ color }}>{score}/100</span>
        </div>
      )}
      <div className="progress-bar">
        <div
          className="progress-fill transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// Full health score card for classroom view
export function ClassHealthCard({ classroom, onClick }) {
  const { healthScore, name, attendance, assignmentCompletion, academicPerformance, participation, trend } = classroom;
  const status = getHealthStatus(healthScore);
  const statusLabels = { healthy: "Healthy", warning: "Needs Attention", critical: "Critical" };
  const statusColors = { healthy: "text-healthy", warning: "text-warning-score", critical: "text-critical" };

  const metrics = [
    { label: "Attendance", value: attendance },
    { label: "Assignments", value: assignmentCompletion },
    { label: "Performance", value: academicPerformance },
    { label: "Participation", value: participation },
  ];

  return (
    <div
      className="card p-5 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <div className={cn("flex items-center gap-1.5 mt-1 text-sm font-medium", statusColors[status])}>
            <span className="w-2 h-2 rounded-full bg-current" />
            {statusLabels[status]}
          </div>
        </div>
        <HealthScoreRing score={healthScore} size={80} strokeWidth={7} />
      </div>

      {/* Mini metric bars */}
      <div className="space-y-2">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-24 flex-shrink-0">{m.label}</span>
            <div className="progress-bar flex-1">
              <div
                className="progress-fill"
                style={{
                  width: `${m.value}%`,
                  backgroundColor: m.value >= 75 ? "#16a34a" : m.value >= 60 ? "#d97706" : "#dc2626",
                }}
              />
            </div>
            <span className="text-xs font-medium text-foreground w-8 text-right">{m.value}%</span>
          </div>
        ))}
      </div>

      {trend !== 0 && (
        <div className={cn("mt-3 text-xs font-medium flex items-center gap-1", trend > 0 ? "text-healthy" : "text-critical")}>
          <span>{trend > 0 ? "↑" : "↓"}</span>
          <span>{Math.abs(trend)} points {trend > 0 ? "improvement" : "decline"} this month</span>
        </div>
      )}
    </div>
  );
}
