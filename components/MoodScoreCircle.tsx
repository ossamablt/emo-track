"use client";

import { useEffect, useState } from "react";

interface MoodScoreCircleProps {
  score: number;
}

function getScoreColor(score: number): string {
  if (score <= 33) return "#F87171";
  if (score <= 55) return "#FBBF24";
  if (score <= 74) return "#60A5FA";
  return "#34D399";
}

function getScoreLabel(score: number): string {
  if (score <= 33) return "Low";
  if (score <= 55) return "Below Average";
  if (score <= 74) return "Good";
  return "Great";
}

export default function MoodScoreCircle({ score }: MoodScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  // Animate score counting up
  useEffect(() => {
    let current = 0;
    const step = score / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-gray-200 dark:text-gray-800"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-bold"
            style={{ color }}
          >
            {animatedScore}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            out of 100
          </span>
        </div>
      </div>
      <span
        className="text-sm font-semibold px-3 py-1 rounded-full"
        style={{
          backgroundColor: `${color}15`,
          color,
        }}
      >
        {label}
      </span>
    </div>
  );
}
