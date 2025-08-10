import { getDailyPrompt } from '@/lib/prompts';
import JournalForm from '@/components/journal-form';

export default function HomePage() {
  const dailyPrompt = getDailyPrompt();

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-500 mt-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-2 mt-8">
        Today's Reflection
      </h1>
      <p className="text-muted-foreground mb-8 text-lg">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <JournalForm prompt={dailyPrompt} />
    </div>
  );
}
