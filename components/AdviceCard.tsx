import { Sparkles } from "lucide-react";

interface AdviceCardProps {
  advice: string;
}

export default function AdviceCard({ advice }: AdviceCardProps) {
  const paragraphs = advice.split("\n\n").filter(Boolean);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Personalized Advice
        </h3>
      </div>
      <div className="space-y-3">
        {paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
