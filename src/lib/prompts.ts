export const prompts = [
  "What was the highlight of your day, and why did it stand out?",
  "Describe a challenge you faced today and how you handled it.",
  "What is something you're grateful for today?",
  "Write about a moment of kindness you witnessed or experienced.",
  "What's on your mind right now? Let your thoughts flow freely.",
  "If you could give your past self one piece of advice, what would it be?",
  "Describe a smell, sound, or taste that brought you comfort today.",
  "What is one thing you did today to take care of your well-being?",
  "Reflect on a recent dream you had. What feelings or images linger?",
  "What is a goal you're working towards, and what's one small step you took today?",
  "Write about something that made you laugh today.",
  "What are you looking forward to tomorrow?",
  "Describe a conversation that was meaningful to you today.",
  "What is a limiting belief you're ready to let go of?",
  "Write about a place, real or imagined, where you feel completely at peace.",
  "What did you learn today, about yourself or the world?",
  "How did you show love to someone (or yourself) today?",
  "If your feelings today were a landscape, what would it look like?",
  "What is a simple pleasure that you enjoyed today?",
  "Write a letter to someone you miss, without the intention of sending it.",
  "What is one assumption you made today? How could you see it differently?",
  "Describe a moment of beauty you noticed in nature.",
  "What is a fear that holds you back, and how can you face it?",
  "Reflect on your energy levels throughout the day. What patterns do you notice?",
  "What is a song that captures your current mood?",
  "If you had an extra hour today, how would you have spent it?",
  "What is one thing you can forgive yourself for?",
  "Write about a childhood memory that came to mind recently.",
  "How can you be more present in your daily life?",
  "What does success look like to you, beyond external achievements?",
  "What is a boundary you are proud of setting recently?"
];

export function getDailyPrompt(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return prompts[dayOfYear % prompts.length];
}
