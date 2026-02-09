"use client";

import { JournalEntry, EMOTION_EMOJIS } from "@/lib/types";
import EmotionBadge from "./EmotionBadge";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface EntryCardProps {
  entry: JournalEntry;
  onDelete: (id: string) => void;
}

export default function EntryCard({ entry, onDelete }: EntryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(entry.createdAt);
  const emoji = EMOTION_EMOJIS[entry.dominantEmotion] || "😐";

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 transition-all hover:shadow-lg hover:shadow-violet-500/5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{emoji}</div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {" · "}
              {date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300 mt-0.5">
              Feeling {entry.dominantEmotion}
            </p>
          </div>
        </div>
        <button
          onClick={() => onDelete(entry.id)}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          aria-label="Delete entry"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {expanded ? entry.text : entry.summary || entry.text.slice(0, 150) + (entry.text.length > 150 ? "..." : "")}
      </p>

      {entry.text.length > 150 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
        >
          {expanded ? (
            <>Show less <ChevronUp className="w-3 h-3" /></>
          ) : (
            <>Read more <ChevronDown className="w-3 h-3" /></>
          )}
        </button>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {entry.emotions.slice(0, 3).map((e) => (
          <EmotionBadge key={e.label} label={e.label} score={e.score} size="sm" />
        ))}
      </div>
    </div>
  );
}
