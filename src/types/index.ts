export type Mood = 'ecstatic' | 'happy' | 'neutral' | 'sad' | 'devastated';

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  content: string;
  mood: Mood;
  prompt: string;
  aiReflection?: string;
}
