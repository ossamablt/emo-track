export interface QuizAnswer {
  text: string;
  emoji: string;
  value: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: QuizAnswer[];
}

export const CHECKIN_QUESTIONS: QuizQuestion[] = [
  {
    id: "sleep",
    question: "How did you sleep last night?",
    answers: [
      { text: "Terribly", emoji: "😫", value: 1 },
      { text: "Poorly", emoji: "😴", value: 2 },
      { text: "Okay", emoji: "😐", value: 3 },
      { text: "Well", emoji: "😊", value: 4 },
      { text: "Amazingly", emoji: "🤩", value: 5 },
    ],
  },
  {
    id: "energy",
    question: "What's your energy level right now?",
    answers: [
      { text: "Exhausted", emoji: "🪫", value: 1 },
      { text: "Low", emoji: "😪", value: 2 },
      { text: "Moderate", emoji: "🙂", value: 3 },
      { text: "Energetic", emoji: "💪", value: 4 },
      { text: "Supercharged", emoji: "⚡", value: 5 },
    ],
  },
  {
    id: "stress",
    question: "How stressed are you feeling?",
    answers: [
      { text: "Overwhelmed", emoji: "🤯", value: 1 },
      { text: "Very stressed", emoji: "😰", value: 2 },
      { text: "Somewhat", emoji: "😕", value: 3 },
      { text: "Fairly calm", emoji: "😌", value: 4 },
      { text: "Totally relaxed", emoji: "🧘", value: 5 },
    ],
  },
  {
    id: "social",
    question: "How were your social interactions today?",
    answers: [
      { text: "Isolated", emoji: "🏚️", value: 1 },
      { text: "Disconnected", emoji: "😶", value: 2 },
      { text: "Neutral", emoji: "🤝", value: 3 },
      { text: "Pleasant", emoji: "😄", value: 4 },
      { text: "Wonderful", emoji: "🥰", value: 5 },
    ],
  },
  {
    id: "satisfaction",
    question: "How satisfied are you with today overall?",
    answers: [
      { text: "Very unsatisfied", emoji: "😞", value: 1 },
      { text: "Unsatisfied", emoji: "😒", value: 2 },
      { text: "Neutral", emoji: "😐", value: 3 },
      { text: "Satisfied", emoji: "😊", value: 4 },
      { text: "Very satisfied", emoji: "🌟", value: 5 },
    ],
  },
];
