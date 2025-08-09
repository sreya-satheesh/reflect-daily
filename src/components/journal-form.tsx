'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Laugh, Smile, Meh, Frown, Angry } from 'lucide-react';
import type { Mood, JournalEntry } from '@/types';
import { useJournal } from '@/hooks/use-journal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import AiReflections from './ai-reflections';

const journalFormSchema = z.object({
  content: z.string().min(10, { message: 'Please write at least 10 characters to reflect.' }),
  mood: z.enum(['ecstatic', 'happy', 'neutral', 'sad', 'devastated']),
});

type JournalFormValues = z.infer<typeof journalFormSchema>;

const moodOptions: { value: Mood; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'ecstatic', label: 'Ecstatic', icon: Laugh },
  { value: 'happy', label: 'Happy', icon: Smile },
  { value: 'neutral', label: 'Neutral', icon: Meh },
  { value: 'sad', label: 'Sad', icon: Frown },
  { value: 'devastated', label: 'Devastated', icon: Angry },
];

export default function JournalForm({ prompt }: { prompt: string }) {
  const { addEntry } = useJournal();
  const { toast } = useToast();
  const [submittedEntry, setSubmittedEntry] = useState<JournalEntry | null>(null);

  const form = useForm<JournalFormValues>({
    resolver: zodResolver(journalFormSchema),
    defaultValues: {
      content: '',
      mood: 'neutral',
    },
  });

  function onSubmit(data: JournalFormValues) {
    const newEntry = addEntry({ ...data, prompt });
    setSubmittedEntry(newEntry);
    toast({
      title: "Entry Saved",
      description: "Your reflection for today has been saved.",
    });
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="font-headline text-2xl font-semibold">"{prompt}"</CardTitle>
        <CardDescription>Use this prompt to start your reflection. Or, write about whatever is on your mind.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">How are you feeling?</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2 sm:gap-4 pt-2">
                      {moodOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={cn(
                            'p-2 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            field.value === option.value
                              ? 'bg-accent/80 scale-110'
                              : 'hover:bg-accent/40'
                          )}
                          aria-label={option.label}
                          title={option.label}
                          disabled={!!submittedEntry}
                        >
                          <option.icon className="w-8 h-8 text-foreground/80" />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Your Journal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Let your thoughts flow..."
                      className="min-h-[300px] text-base leading-relaxed bg-card"
                      {...field}
                      disabled={!!submittedEntry}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!submittedEntry && (
              <Button type="submit" size="lg" className="font-headline" disabled={form.formState.isSubmitting}>
                Save Entry
              </Button>
            )}
          </form>
        </Form>
        {submittedEntry && (
           <div className="mt-12 animate-in fade-in duration-500">
             <AiReflections entry={submittedEntry} />
           </div>
        )}
      </CardContent>
    </Card>
  );
}
