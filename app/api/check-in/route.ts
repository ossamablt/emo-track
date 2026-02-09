import { NextRequest, NextResponse } from "next/server";
import { analyzeEmotion } from "@/lib/huggingface";
import { generateAdvice } from "@/lib/advice";

export async function POST(request: NextRequest) {
  try {
    const { text, moodScore, answers } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
      return NextResponse.json(
        { error: "Hugging Face API key not configured" },
        { status: 500 }
      );
    }

    const emotions = await analyzeEmotion(text, apiKey);
    const dominantEmotion = emotions[0]?.label || "neutral";
    const advice = generateAdvice(moodScore, dominantEmotion, answers);

    return NextResponse.json({ emotions, dominantEmotion, advice });
  } catch (error) {
    console.error("Check-in analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze check-in" },
      { status: 500 }
    );
  }
}
