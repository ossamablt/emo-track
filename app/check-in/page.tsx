"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Save, RotateCcw } from "lucide-react";
import { CHECKIN_QUESTIONS, QuizAnswer } from "@/lib/checkin-questions";
import { EmotionScore } from "@/lib/types";
import { saveCheckIn, generateId } from "@/lib/storage";
import ProgressBar from "@/components/ProgressBar";
import MoodScoreCircle from "@/components/MoodScoreCircle";
import EmotionBadge from "@/components/EmotionBadge";
import AdviceCard from "@/components/AdviceCard";

type Phase = "quiz" | "analyzing" | "results";

interface CheckInResult {
  moodScore: number;
  emotions: EmotionScore[];
  dominantEmotion: string;
  advice: string;
}

function calculateMoodScore(answers: Record<string, QuizAnswer>): number {
  const values = Object.values(answers).map((a) => a.value);
  const sum = values.reduce((acc, v) => acc + v, 0);
  const maxPossible = values.length * 5;
  return Math.round((sum / maxPossible) * 100);
}

function buildAnalysisText(answers: Record<string, QuizAnswer>): string {
  const parts = CHECKIN_QUESTIONS.map((q) => {
    const answer = answers[q.id];
    return `${q.question} ${answer.text}.`;
  });
  return `Mood check-in: ${parts.join(" ")}`;
}

export default function CheckInPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [phase, setPhase] = useState<Phase>("quiz");
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [error, setError] = useState("");

  const currentQuestion = CHECKIN_QUESTIONS[step];
  const selectedAnswer = answers[currentQuestion?.id];
  const isLastQuestion = step === CHECKIN_QUESTIONS.length - 1;

  const handleSelect = (answer: QuizAnswer) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setPhase("analyzing");
    setError("");

    const moodScore = calculateMoodScore(answers);
    const text = buildAnalysisText(answers);

    const formattedAnswers: Record<string, { question: string; answer: string; value: number }> = {};
    CHECKIN_QUESTIONS.forEach((q) => {
      const a = answers[q.id];
      formattedAnswers[q.id] = { question: q.question, answer: a.text, value: a.value };
    });

    try {
      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, moodScore, answers: formattedAnswers }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setResult({
        moodScore,
        emotions: data.emotions,
        dominantEmotion: data.dominantEmotion,
        advice: data.advice,
      });
      setPhase("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("quiz");
    }
  };

  const handleSave = () => {
    if (!result) return;

    const formattedAnswers: Record<string, { question: string; answer: string; value: number }> = {};
    CHECKIN_QUESTIONS.forEach((q) => {
      const a = answers[q.id];
      formattedAnswers[q.id] = { question: q.question, answer: a.text, value: a.value };
    });

    saveCheckIn({
      id: generateId(),
      type: "check-in",
      moodScore: result.moodScore,
      answers: formattedAnswers,
      emotions: result.emotions,
      dominantEmotion: result.dominantEmotion,
      advice: result.advice,
      createdAt: new Date().toISOString(),
    });

    router.push("/");
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setPhase("quiz");
    setResult(null);
    setError("");
  };

  // === ANALYZING PHASE ===
  if (phase === "analyzing") {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center animate-pulse-glow mb-6">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <h2 className="text-lg font-semibold mb-1">Analyzing your mood...</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          AI is processing your answers
        </p>
      </div>
    );
  }

  // === RESULTS PHASE ===
  if (phase === "results" && result) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold">Your Mood Results</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Based on your check-in answers
          </p>
        </div>

        {/* Score Circle */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 flex justify-center">
          <MoodScoreCircle score={result.moodScore} />
        </div>

        {/* Emotions */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Detected Emotions
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.emotions.map((e) => (
              <EmotionBadge key={e.label} label={e.label} score={e.score} />
            ))}
          </div>
        </div>

        {/* Advice */}
        <AdviceCard advice={result.advice} />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Results
          </button>
        </div>
      </div>
    );
  }

  // === QUIZ PHASE ===
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Daily Check-in</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Answer a few questions to check your mood
        </p>
      </div>

      <ProgressBar current={step} total={CHECKIN_QUESTIONS.length} />

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Question Card */}
      <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h2 className="text-lg font-semibold text-center mb-6">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.answers.map((answer) => {
            const isSelected = selectedAnswer?.value === answer.value;
            return (
              <button
                key={answer.value}
                onClick={() => handleSelect(answer)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-500/15"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <span className="text-2xl">{answer.emoji}</span>
                <span
                  className={`text-sm font-medium ${
                    isSelected
                      ? "text-violet-700 dark:text-violet-300"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {answer.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
        >
          {isLastQuestion ? "See Results" : "Next"}
          {!isLastQuestion && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
