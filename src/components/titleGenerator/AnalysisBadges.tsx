import { ITitleGeneratorAnalysis } from "@/types/feature/titleGenerator";
import { cn } from "@/lib/utils";

interface AnalysisBadgesProps {
  analysis: ITitleGeneratorAnalysis;
}

interface BadgeProps {
  label: string;
  value: string;
  className?: string;
}

const Badge = ({ label, value, className }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs",
      className
    )}
  >
    <span className="text-label uppercase tracking-wider font-medium">{label}</span>
    <span className="text-foreground font-semibold">{value}</span>
  </span>
);

export const AnalysisBadges = ({ analysis }: AnalysisBadgesProps) => {
  return (
    <div
      className="flex flex-wrap gap-2 mb-6"
      role="region"
      aria-label="Content analysis metadata"
    >
      <Badge
        label="Topic"
        value={analysis.topic}
        className="bg-primary/10 border-primary/20"
      />
      <Badge
        label="Emotion"
        value={analysis.emotion}
        className="bg-cyan-400/10 border-cyan-400/20"
      />
      <Badge
        label="Intent"
        value={analysis.intent}
        className="bg-yellow-400/10 border-yellow-400/20"
      />
      {analysis.keywords.slice(0, 4).map((keyword) => (
        <Badge
          key={keyword}
          label="kw"
          value={keyword}
          className="bg-white/5 border-white/10"
        />
      ))}
    </div>
  );
};
