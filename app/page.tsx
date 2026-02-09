"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PenLine, TrendingUp, BookOpen, Flame } from "lucide-react";
import { JournalEntry, EMOTION_EMOJIS } from "@/lib/types";
import { getEntries } from "@/lib/storage";
import MoodChart from "@/components/MoodChart";
import EmotionBadge from "@/components/EmotionBadge";

export default function Dashboard() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEntries(getEntries());
  }, []);

  if (!mounted) return null;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Stats
  const totalEntries = entries.length;
  const moodCounts: Record<string, number> = {};
  entries.forEach((e) => {
    moodCounts[e.dominantEmotion] = (moodCounts[e.dominantEmotion] || 0) + 1;
  });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  // Streak: consecutive days with entries
  let streak = 0;
  if (entries.length > 0) {
    const checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toDateString();
      const hasEntry = entries.some(
        (e) => new Date(e.createdAt).toDateString() === dateStr
      );
      if (hasEntry) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{today}</p>
        </div>
        <Link
          href="/journal"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/20"
        >
          <PenLine className="w-4 h-4" />
          New Entry
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalEntries}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Entries
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{streak}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Day Streak
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-xl">
              {topMood ? EMOTION_EMOJIS[topMood[0]] || "😐" : "—"}
            </div>
            <div>
              <p className="text-2xl font-bold capitalize">
                {topMood ? topMood[0] : "—"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Top Mood
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Chart */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          <h2 className="font-semibold">Mood Trends</h2>
        </div>
        <MoodChart entries={entries} />
      </div>

      {/* Recent Entries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Entries</h2>
          {entries.length > 3 && (
            <Link
              href="/history"
              className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No entries yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Start writing to track your mood
            </p>
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-sm font-medium hover:bg-violet-200 dark:hover:bg-violet-500/30 transition-colors"
            >
              <PenLine className="w-4 h-4" />
              Write your first entry
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.slice(0, 3).map((entry) => {
              const date = new Date(entry.createdAt);
              return (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {EMOTION_EMOJIS[entry.dominantEmotion] || "😐"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      {" · "}
                      {date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {entry.text}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {entry.emotions.slice(0, 2).map((e) => (
                      <EmotionBadge
                        key={e.label}
                        label={e.label}
                        score={e.score}
                        size="sm"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
