export interface EmotionScore {
  label: string;
  score: number;
}

export interface JournalEntry {
  id: string;
  text: string;
  emotions: EmotionScore[];
  dominantEmotion: string;
  summary: string;
  createdAt: string;
}

export interface MoodDataPoint {
  date: string;
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
  disgust: number;
}

export const EMOTION_COLORS: Record<string, string> = {
  joy: "#FBBF24",
  sadness: "#60A5FA",
  anger: "#F87171",
  fear: "#A78BFA",
  surprise: "#34D399",
  disgust: "#FB923C",
  neutral: "#9CA3AF",
};

export const EMOTION_EMOJIS: Record<string, string> = {
  joy: "😊",
  sadness: "😢",
  anger: "😠",
  fear: "😰",
  surprise: "😲",
  disgust: "🤢",
  neutral: "😐",
};
