import { EMOTION_COLORS, EMOTION_EMOJIS } from "@/lib/types";

interface EmotionBadgeProps {
  label: string;
  score: number;
  size?: "sm" | "md";
}

export default function EmotionBadge({ label, score, size = "md" }: EmotionBadgeProps) {
  const color = EMOTION_COLORS[label] || "#9CA3AF";
  const emoji = EMOTION_EMOJIS[label] || "😐";
  const percentage = Math.round(score * 100);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium border ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}40`,
        color: color,
      }}
    >
      <span>{emoji}</span>
      <span className="capitalize">{label}</span>
      <span className="opacity-70">{percentage}%</span>
    </span>
  );
}
