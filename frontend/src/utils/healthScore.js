/**
 * Classroom Health Score Calculator
 * Weights: Attendance 30% | Assignments 20% | Performance 30% | Participation 20%
 */

const WEIGHTS = {
  attendance: 0.30,
  assignmentCompletion: 0.20,
  academicPerformance: 0.30,
  participation: 0.20,
};

const THRESHOLDS = {
  healthy: 70,
  warning: 40,
};

export function calculateHealthScore({ attendance, assignmentCompletion, academicPerformance, participation }) {
  const score =
    (attendance * WEIGHTS.attendance) +
    (assignmentCompletion * WEIGHTS.assignmentCompletion) +
    (academicPerformance * WEIGHTS.academicPerformance) +
    (participation * WEIGHTS.participation);

  return Math.round(Math.min(100, Math.max(0, score)));
}

export function getHealthStatus(score) {
  if (score >= THRESHOLDS.healthy) return "healthy";
  if (score >= THRESHOLDS.warning) return "warning";
  return "critical";
}

export function getHealthLabel(score) {
  const status = getHealthStatus(score);
  if (status === "healthy") return "Healthy";
  if (status === "warning") return "Needs Attention";
  return "Critical";
}

export function getHealthColor(score) {
  const status = getHealthStatus(score);
  if (status === "healthy") return "#16a34a";
  if (status === "warning") return "#d97706";
  return "#dc2626";
}

export function generateHealthInsight({ score, trend, attendance, assignmentCompletion, academicPerformance }) {
  const status = getHealthStatus(score);
  const issues = [];

  if (attendance < 75) issues.push("attendance has fallen below 75%");
  if (assignmentCompletion < 70) issues.push("assignment completion is low");
  if (academicPerformance < 65) issues.push("academic performance is declining");
  if (trend < -5) issues.push("overall health is trending downward");

  if (status === "healthy" && issues.length === 0) {
    return "This classroom is performing well across all metrics. Keep up the good work!";
  }

  if (issues.length > 0) {
    const trendText = trend < 0 ? ` Health has decreased by ${Math.abs(trend)} points this month.` : "";
    return `Classroom health is ${getHealthLabel(score).toLowerCase()} because ${issues.join(" and ")}.${trendText}`;
  }

  return `Classroom health score is ${score}/100. Monitor closely.`;
}
