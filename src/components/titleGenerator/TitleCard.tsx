import { IGeneratedTitle } from "@/types/feature/titleGenerator";
import { cn } from "@/lib/utils";

interface TitleCardProps {
  title: IGeneratedTitle;
  rank: number;
  style?: React.CSSProperties;
}

function getScoreColor(score: number): string {
  if (score >= 9) return "text-yellow-400";
  if (score >= 8) return "text-primary";
  if (score >= 7) return "text-cyan-400";
  return "text-muted-foreground";
}

function getScoreStroke(score: number): string {
  if (score >= 9) return "stroke-yellow-400";
  if (score >= 8) return "stroke-primary";
  if (score >= 7) return "stroke-cyan-400";
  return "stroke-muted-foreground";
}

function getScoreBadgeBg(score: number): string {
  if (score >= 9) return "bg-yellow-400/10 border-yellow-400/30 text-yellow-400";
  if (score >= 8) return "bg-primary/10 border-primary/30 text-primary";
  if (score >= 7) return "bg-cyan-400/10 border-cyan-400/30 text-cyan-400";
  return "bg-white/5 border-white/10 text-muted-foreground";
}

interface ScoreArcProps {
  score: number;
}

const ScoreArc = ({ score }: ScoreArcProps) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const dashOffset = circumference - progress;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center">
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="36"
            cy="36"
            r={radius}
            strokeWidth="4"
            className="stroke-white/10"
            fill="none"
          />
          <circle
            cx="36"
            cy="36"
            r={radius}
            strokeWidth="4"
            className={getScoreStroke(score)}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        </svg>
        <span
          className={cn(
            "absolute text-lg font-bold tabular-nums",
            getScoreColor(score)
          )}
        >
          {score}
        </span>
      </div>
      <span className="text-caption text-xs">/ 10</span>
    </div>
  );
};

export const TitleCard = ({ title, rank, style }: TitleCardProps) => {
  const rankLabel = String(rank).padStart(2, "0");

  return (
    <article
      className="group relative glass-card glass-card-hover rounded-xl overflow-hidden cursor-default animate-fade-in min-h-[104px]"
      style={style}
      aria-label={`Title ${rankLabel}: ${title.title}, score ${title.score} out of 10`}
    >
      {/* Default state */}
      <div className="flex items-center gap-4 p-4 h-full min-h-[104px] transition-opacity duration-300 group-hover:opacity-0">
        <span
          className="text-3xl font-black text-white/10 tabular-nums select-none shrink-0 w-10 text-right"
          aria-hidden="true"
        >
          {rankLabel}
        </span>
        <p className="flex-1 text-sm font-medium text-foreground leading-snug">
          {title.title}
        </p>
        <span
          className={cn(
            "shrink-0 text-xs font-semibold px-2 py-1 rounded-full border tabular-nums",
            getScoreBadgeBg(title.score)
          )}
          aria-hidden="true"
        >
          {title.score}/10
        </span>
      </div>

      {/* Hover reveal overlay */}
      <div
        className="absolute inset-0 flex items-center gap-5 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      >
        <div className="flex-1 min-w-0">
          <p className="text-label text-xs mb-1 uppercase tracking-widest">Why this works</p>
          <p className="text-sm text-foreground leading-relaxed line-clamp-3">
            {title.reason}
          </p>
        </div>
        <div className="shrink-0">
          <ScoreArc score={title.score} />
        </div>
      </div>
    </article>
  );
};

export const TitleCardSkeleton = () => (
  <div className="glass-card rounded-xl p-4 min-h-[104px] flex items-center gap-4 animate-pulse">
    <div className="w-10 h-8 bg-white/5 rounded" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-white/5 rounded w-full" />
      <div className="h-3 bg-white/5 rounded w-2/3" />
    </div>
    <div className="w-12 h-6 bg-white/5 rounded-full" />
  </div>
);
