import { cn } from "../../utils/helpers";

// Skeleton block
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("skeleton", className)}
      {...props}
    />
  );
}

// Stat card skeleton
export function StatCardSkeleton() {
  return (
    <div className="stat-card space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3 border-b border-border">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Card skeleton
export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="card p-6 space-y-3">
      <Skeleton className="h-5 w-40" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 w-${i === lines - 1 ? "3/4" : "full"}`} />
      ))}
    </div>
  );
}
