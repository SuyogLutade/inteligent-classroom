import { cn, getTrendColor, getTrendIcon } from "../../utils/helpers";
import { Card } from "../ui/Card";

export function StatCard({ title, value, description, icon: Icon, trend, trendLabel, iconColor = "text-primary", iconBg = "bg-primary/10", className }) {
  return (
    <Card className={cn("stat-card", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground truncate">{description}</p>
          )}
          {trend !== undefined && (
            <div className={cn("mt-1.5 flex items-center gap-1 text-xs font-medium", getTrendColor(trend))}>
              <span>{getTrendIcon(trend)}</span>
              <span>{Math.abs(trend)}% {trendLabel || "vs last month"}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ml-4", iconBg)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        )}
      </div>
    </Card>
  );
}

export function AlertStatCard({ count, label, severity = "warning", icon: Icon }) {
  const colors = {
    critical: { bg: "bg-critical-light", text: "text-critical-foreground", icon: "text-critical" },
    warning: { bg: "bg-warning-light", text: "text-warning-foreground", icon: "text-warning" },
    info: { bg: "bg-info-light", text: "text-info-foreground", icon: "text-info" },
  };
  const c = colors[severity] || colors.warning;

  return (
    <div className={cn("rounded-xl border p-4 flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity", c.bg)}>
      {Icon && <Icon className={cn("w-5 h-5 flex-shrink-0", c.icon)} />}
      <div>
        <p className={cn("text-xl font-bold tabular-nums", c.text)}>{count}</p>
        <p className={cn("text-xs font-medium", c.text)}>{label}</p>
      </div>
    </div>
  );
}
