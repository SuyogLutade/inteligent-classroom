import { cn } from "../../utils/helpers";

const variants = {
  healthy: "badge-healthy",
  warning: "badge-warning",
  critical: "badge-critical",
  info: "badge-info",
  default: "badge-default",
};

export function Badge({ variant = "default", className, children, ...props }) {
  return (
    <span className={cn(variants[variant] || variants.default, className)} {...props}>
      {children}
    </span>
  );
}

// Health status badge with dot indicator
export function StatusBadge({ score }) {
  let variant = "critical";
  let label = "Critical";
  if (score >= 70) { variant = "healthy"; label = "Healthy"; }
  else if (score >= 40) { variant = "warning"; label = "Needs Attention"; }

  return (
    <Badge variant={variant}>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1" />
      {label}
    </Badge>
  );
}

// Risk level badge
export function RiskBadge({ level }) {
  const map = {
    high: { variant: "critical", label: "High Risk" },
    medium: { variant: "warning", label: "Medium Risk" },
    low: { variant: "healthy", label: "Low Risk" },
  };
  const { variant, label } = map[level] || map.low;
  return <Badge variant={variant}>{label}</Badge>;
}
