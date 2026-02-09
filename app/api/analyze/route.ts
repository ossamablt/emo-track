import { NextRequest, NextResponse } from "next/server";
import { analyzeEmotion, summarizeText } from "@/lib/huggingface";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
      return NextResponse.json(
        { error: "Hugging Face API key not configured" },
        { status: 500 }
      );
    }

    const [emotions, summary] = await Promise.all([
      analyzeEmotion(text, apiKey),
      summarizeText(text, apiKey),
    ]);

    const dominantEmotion = emotions[0]?.label || "neutral";

    return NextResponse.json({ emotions, dominantEmotion, summary });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze text" },
      { status: 500 }
    );
  }
}
