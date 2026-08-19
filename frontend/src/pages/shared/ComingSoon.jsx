import { Construction } from "lucide-react";

// Placeholder for pages being built in upcoming phases
export default function ComingSoon({ title = "Coming Soon", description }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm text-center">
        {description || "This section is being implemented in the next phase. Check back soon!"}
      </p>
    </div>
  );
}
