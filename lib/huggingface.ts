import { EmotionScore } from "./types";

const EMOTION_MODEL = "j-hartmann/emotion-english-distilroberta-base";
const SUMMARY_MODEL = "facebook/bart-large-cnn";

export async function analyzeEmotion(
  text: string,
  apiKey: string
): Promise<EmotionScore[]> {
  const response = await fetch(
    `https://router.huggingface.co/hf-inference/models/${EMOTION_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Emotion analysis failed: ${error}`);
  }

  const result = await response.json();
  // The model returns [[{label, score}, ...]]
  const emotions: EmotionScore[] = result[0] || result;
  return emotions.sort((a: EmotionScore, b: EmotionScore) => b.score - a.score);
}

export async function summarizeText(
  text: string,
  apiKey: string
): Promise<string> {
  if (text.split(" ").length < 30) {
    return text.slice(0, 150) + (text.length > 150 ? "..." : "");
  }

  const response = await fetch(
    `https://router.huggingface.co/hf-inference/models/${SUMMARY_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters: { max_length: 100, min_length: 20 },
      }),
    }
  );

  if (!response.ok) {
    // Fallback: return truncated text if summarization fails
    return text.slice(0, 150) + "...";
  }

  const result = await response.json();
  return result[0]?.summary_text || text.slice(0, 150) + "...";
}
