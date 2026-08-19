/**
 * Student Risk Score Calculator
 * Explainable, rule-based risk detection system
 */

export function calculateRiskScore(student) {
  let score = 0;
  const reasons = [];
  const actions = [];

  // Attendance risk (max 35 points)
  if (student.attendance < 60) {
    score += 35;
    reasons.push(`Attendance critically low at ${student.attendance}%`);
    actions.push("Contact student immediately");
    actions.push("Notify guardian/mentor");
  } else if (student.attendance < 75) {
    score += 20;
    reasons.push(`Attendance below required 75% threshold (${student.attendance}%)`);
    actions.push("Send attendance warning");
  } else if (student.attendance < 85) {
    score += 8;
  }

  // Consecutive absences (max 20 points)
  if (student.consecutiveAbsences >= 4) {
    score += 20;
    reasons.push(`${student.consecutiveAbsences} consecutive absences`);
    actions.push("Schedule a meeting with the student");
  } else if (student.consecutiveAbsences >= 2) {
    score += 10;
    reasons.push(`${student.consecutiveAbsences} consecutive absences`);
  }

  // Assignment completion (max 25 points)
  if (student.assignmentCompletion < 50) {
    score += 25;
    reasons.push(`Assignment completion very low at ${student.assignmentCompletion}%`);
    actions.push("Review pending assignments with student");
  } else if (student.assignmentCompletion < 70) {
    score += 15;
    reasons.push(`Assignment completion below average (${student.assignmentCompletion}%)`);
  } else if (student.assignmentCompletion < 85) {
    score += 5;
  }

  // Performance trend (max 20 points)
  if (student.performanceTrend <= -15) {
    score += 20;
    reasons.push(`Performance declining sharply (${student.performanceTrend}% trend)`);
    actions.push("Schedule academic counselling session");
  } else if (student.performanceTrend <= -8) {
    score += 12;
    reasons.push(`Performance declining (${student.performanceTrend}% trend)`);
  } else if (student.performanceTrend <= -3) {
    score += 5;
  }

  // Missing assignments (bonus risk)
  if (student.missedAssignments >= 3) {
    score += 10;
    reasons.push(`${student.missedAssignments} assignments not submitted`);
  } else if (student.missedAssignments >= 1) {
    score += 5;
    reasons.push(`${student.missedAssignments} assignment(s) missing`);
  }

  score = Math.min(100, score);

  // Default actions
  if (actions.length === 0 && score > 30) {
    actions.push("Monitor student progress closely");
  }
  if (score > 60 && !actions.includes("Notify guardian/mentor")) {
    actions.push("Notify mentor");
  }

  return {
    score,
    level: getRiskLevel(score),
    reasons,
    actions,
  };
}

export function getRiskLevel(score) {
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

export function getRiskLabel(level) {
  if (level === "high") return "High Risk";
  if (level === "medium") return "Medium Risk";
  return "Low Risk";
}

export function getRiskColor(level) {
  if (level === "high") return "#dc2626";
  if (level === "medium") return "#d97706";
  return "#16a34a";
}

export function getRiskBadgeClass(level) {
  if (level === "high") return "badge-critical";
  if (level === "medium") return "badge-warning";
  return "badge-healthy";
}
