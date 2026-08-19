// cn utility for conditional classnames
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format percentage
export function formatPercent(value, decimals = 1) {
  return `${Number(value).toFixed(decimals)}%`;
}

// Format date
export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Format time
export function formatTime(time) {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

// Get greeting based on time
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

// Get initials from name
export function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Truncate text
export function truncate(str, maxLength = 50) {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

// Get trend arrow
export function getTrendIcon(trend) {
  if (trend > 0) return "↑";
  if (trend < 0) return "↓";
  return "→";
}

// Get trend color class
export function getTrendColor(trend) {
  if (trend > 0) return "text-healthy";
  if (trend < 0) return "text-critical";
  return "text-muted-foreground";
}
