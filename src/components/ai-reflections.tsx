'use client';

import { useState } from 'react';
import type { JournalEntry } from '@/types';
import { useJournal } from '@/hooks/use-journal';
import { suggestReflections } from '@/ai/flows/suggest-reflections';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function AiReflections({ entry }: { entry: JournalEntry }) {
  const { getPastEntries, updateEntry } = useJournal();
  const [isLoading, setIsLoading] = useState(false);
  const [reflection, setReflection] = useState<string | null>(entry.aiReflection || null);
  const { toast } = useToast();

  const handleSuggestReflections = async () => {
    setIsLoading(true);
    try {
      const pastEntries = getPastEntries(entry.id);
      const pastEntriesText = pastEntries
        .slice(0, 5) // Limit to most recent 5 for context window
        .map(e => `On ${new Date(e.date).toLocaleDateString()}, I felt ${e.mood} and wrote: ${e.content}`)
        .join('\n\n');

      const result = await suggestReflections({
        currentEntry: entry.content,
        pastEntries: pastEntriesText || "No past entries.",
      });

      const newReflection = result.suggestedReflections;
      setReflection(newReflection);
      updateEntry(entry.id, { aiReflection: newReflection });
      
      toast({
        title: "Reflections Generated",
        description: "AI has suggested some points for deeper reflection.",
      });

    } catch (error) {
      console.error("Failed to get AI reflections", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Could not generate AI reflections. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-headline text-2xl font-bold">Deeper Reflections</h3>
      {!reflection && (
        <>
        <p className="text-muted-foreground">
          Based on your past entries, AI can suggest connections and themes you might want to explore further.
        </p>
        <Button onClick={handleSuggestReflections} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Suggest Reflections
        </Button>
        </>
      )}

      {reflection && (
        <Alert className="bg-primary/10 border-primary/20">
          <Wand2 className="h-4 w-4 text-primary" />
          <AlertTitle className="font-semibold text-primary-foreground">AI Suggested Reflection</AlertTitle>
          <AlertDescription className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {reflection}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
