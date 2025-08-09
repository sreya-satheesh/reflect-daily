'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useJournal } from '@/hooks/use-journal';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Laugh, Smile, Meh, Frown, Angry } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Mood } from '@/types';

const moodIcons: Record<Mood, React.ComponentType<{ className?: string }>> = {
  ecstatic: Laugh,
  happy: Smile,
  neutral: Meh,
  sad: Frown,
  devastated: Angry,
};

export default function JournalList() {
  const { entries, loading, exportEntries } = useJournal();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = useMemo(() => {
    if (!searchTerm) return entries;
    return entries.filter(
      (entry) =>
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.prompt.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [entries, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search entries by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-card"
        />
        <Button onClick={exportEntries} variant="outline" className="bg-card">
          <Download className="mr-2 h-4 w-4" />
          Export All Entries
        </Button>
      </div>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-card">
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
              <CardFooter>
                 <Skeleton className="h-6 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredEntries.length === 0 && (
        <Card className="text-center py-12 bg-card/80">
            <CardContent>
                <h3 className="text-xl font-semibold">No entries found</h3>
                <p className="text-muted-foreground mt-2">
                    {searchTerm ? "Try a different search term." : "Start by writing your first journal entry."}
                </p>
                <Button asChild className="mt-4">
                    <Link href="/">Write Today's Entry</Link>
                </Button>
            </CardContent>
        </Card>
      )}

      {!loading && filteredEntries.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry) => {
            const MoodIcon = moodIcons[entry.mood];
            return (
              <Card key={entry.id} className="flex flex-col bg-card hover:border-accent transition-colors duration-300 shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-headline text-xl">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                        })}
                      </CardTitle>
                      <CardDescription>
                        {new Date(entry.date).getFullYear()}
                      </CardDescription>
                    </div>
                    {MoodIcon && <MoodIcon className="h-8 w-8 text-muted-foreground" title={entry.mood} />}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="font-semibold text-muted-foreground italic mb-2 line-clamp-1">"{entry.prompt}"</p>
                  <p className="line-clamp-3 text-foreground/80">{entry.content}</p>
                </CardContent>
                <CardFooter>
                   <Button asChild variant="link" className="px-0">
                      <Link href={`/journal/${entry.id}`}>Read more &rarr;</Link>
                   </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
