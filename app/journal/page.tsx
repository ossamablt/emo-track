"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Save, Loader2, AlertCircle } from "lucide-react";
import { EmotionScore } from "@/lib/types";
import { saveEntry, generateId } from "@/lib/storage";
import EmotionBadge from "@/components/EmotionBadge";

export default function JournalPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [emotions, setEmotions] = useState<EmotionScore[]>([]);
  const [dominantEmotion, setDominantEmotion] = useState("");
  const [summary, setSummary] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (text.trim().length < 10) {
      setError("Please write at least 10 characters to analyze");
      return;
    }

    setAnalyzing(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setEmotions(data.emotions);
      setDominantEmotion(data.dominantEmotion);
      setSummary(data.summary);
      setAnalyzed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = () => {
    const entry = {
      id: generateId(),
      text,
      emotions,
      dominantEmotion,
      summary,
      createdAt: new Date().toISOString(),
    };

    saveEntry(entry);
    router.push("/");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Write in your journal</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Express your thoughts and let AI analyze your mood
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (analyzed) {
              setAnalyzed(false);
              setEmotions([]);
            }
          }}
          placeholder="How are you feeling today? Write about your day, your thoughts, anything on your mind..."
          className="w-full h-48 bg-transparent resize-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 leading-relaxed"
        />

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400">
            {text.length} characters
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || text.trim().length < 10}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Mood
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            {error.includes("API key") && (
              <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                Add your Hugging Face API key to .env.local file
              </p>
            )}
          </div>
        </div>
      )}

      {analyzed && emotions.length > 0 && (
        <div className="mt-6 space-y-4 animate-in">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Detected Emotions
            </h2>
            <div className="flex flex-wrap gap-2">
              {emotions.map((e) => (
                <EmotionBadge key={e.label} label={e.label} score={e.score} />
              ))}
            </div>
          </div>

          {summary && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                AI Summary
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {summary}
              </p>
            </div>
          )}

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Entry
          </button>
        </div>
      )}
    </div>
  );
}
