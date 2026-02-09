export function generateAdvice(
  moodScore: number,
  dominantEmotion: string,
  answers: Record<string, { question: string; answer: string; value: number }>
): string {
  const tips: string[] = [];

  // Score-based general advice
  if (moodScore <= 33) {
    tips.push(
      "It sounds like you're going through a tough time. Remember, it's okay to not be okay. Consider reaching out to someone you trust."
    );
  } else if (moodScore <= 55) {
    tips.push(
      "Things seem a bit rough today. Small positive actions can shift your mood — even a short walk or a favorite song can help."
    );
  } else if (moodScore <= 74) {
    tips.push(
      "You're doing alright! There's room to feel even better. Focus on what went well today and build on it."
    );
  } else {
    tips.push(
      "You're in a great headspace! Keep doing what you're doing. Consider journaling about what made today so good."
    );
  }

  // Answer-specific advice
  if (answers["sleep"]?.value <= 2) {
    tips.push(
      "Your sleep needs attention. Try a consistent bedtime, limit screens 1 hour before bed, and keep your room cool and dark."
    );
  }

  if (answers["energy"]?.value <= 2) {
    tips.push(
      "Low energy can affect everything. Stay hydrated, take a short walk outside, or try a 20-minute power nap if possible."
    );
  }

  if (answers["stress"]?.value <= 2) {
    tips.push(
      "High stress detected. Try box breathing (4 seconds in, 4 hold, 4 out, 4 hold), or write down what's bothering you to get it out of your head."
    );
  }

  if (answers["social"]?.value <= 2) {
    tips.push(
      "Social connection matters for wellbeing. Even a quick message to a friend or a short chat with a colleague can make a difference."
    );
  }

  if (answers["satisfaction"]?.value <= 2) {
    tips.push(
      "Today didn't feel great overall. Tomorrow is a fresh start — try setting one small, achievable goal to build momentum."
    );
  }

  // Emotion-specific advice
  const emotionAdvice: Record<string, string> = {
    sadness:
      "When sadness is present, be gentle with yourself. Acknowledge the feeling without judgment — it will pass.",
    anger:
      "Feeling angry is natural. Channel that energy into something physical like exercise, or write down what triggered it.",
    fear:
      "Anxiety and fear can be managed. Ground yourself: name 5 things you can see, 4 you can touch, 3 you can hear.",
    joy:
      "Joy is your dominant emotion — wonderful! Take a moment to savor it and remember what contributed to this feeling.",
    surprise:
      "Something unexpected shaped your mood today. Take time to process and reflect on how it makes you feel.",
    disgust:
      "Something didn't sit right with you. Identifying the specific trigger can help you set boundaries for next time.",
    neutral:
      "You're in a balanced state. This is a good foundation — consider what would make tomorrow even better.",
  };

  if (emotionAdvice[dominantEmotion]) {
    tips.push(emotionAdvice[dominantEmotion]);
  }

  return tips.join("\n\n");
}
