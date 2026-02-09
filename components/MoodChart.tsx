"use client";

import { JournalEntry, EMOTION_COLORS } from "@/lib/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MoodChartProps {
  entries: JournalEntry[];
}

export default function MoodChart({ entries }: MoodChartProps) {
  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-600 text-sm">
        Write your first entry to see mood trends
      </div>
    );
  }

  // Group entries by date and average emotion scores
  const dateMap = new Map<string, Record<string, number[]>>();

  [...entries].reverse().forEach((entry) => {
    const date = new Date(entry.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!dateMap.has(date)) dateMap.set(date, {});
    const dayData = dateMap.get(date)!;

    entry.emotions.forEach((e) => {
      if (!dayData[e.label]) dayData[e.label] = [];
      dayData[e.label].push(e.score);
    });
  });

  const chartData = Array.from(dateMap.entries()).map(([date, emotions]) => {
    const point: Record<string, string | number> = { date };
    Object.entries(emotions).forEach(([emotion, scores]) => {
      point[emotion] = Math.round(
        (scores.reduce((a, b) => a + b, 0) / scores.length) * 100
      );
    });
    return point;
  });

  const emotionKeys = ["joy", "sadness", "anger", "fear", "surprise", "disgust"];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={chartData}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          stroke="#9CA3AF"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          stroke="#9CA3AF"
          domain={[0, 100]}
          width={35}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(17, 24, 39, 0.9)",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "12px",
          }}
        />
        {emotionKeys.map((emotion) => (
          <Area
            key={emotion}
            type="monotone"
            dataKey={emotion}
            stroke={EMOTION_COLORS[emotion]}
            fill={EMOTION_COLORS[emotion]}
            fillOpacity={0.1}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
