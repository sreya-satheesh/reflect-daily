'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useJournal } from '@/hooks/use-journal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Laugh, Smile, Meh, Frown, Angry, Wand2 } from 'lucide-react';
import type { Mood } from '@/types';

const moodDetails: Record<Mood, { icon: React.ComponentType<{ className?: string }>, label: string }> = {
  ecstatic: { icon: Laugh, label: 'Ecstatic' },
  happy: { icon: Smile, label: 'Happy' },
  neutral: { icon: Meh, label: 'Neutral' },
  sad: { icon: Frown, label: 'Sad' },
  devastated: { icon: Angry, label: 'Devastated' },
};

export default function JournalEntryPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { getEntry, loading } = useJournal();
    const entry = getEntry(id);

    if (loading) {
        return <EntrySkeleton />;
    }

    if (!entry) {
        return (
            <div className="text-center py-12 max-w-md mx-auto">
                <Card className="bg-card/80">
                    <CardHeader>
                        <CardTitle>Entry Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">The journal entry you are looking for does not exist.</p>
                        <Button asChild className="mt-4">
                            <Link href="/journal">Back to Journal</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const MoodIcon = moodDetails[entry.mood].icon;

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Journal
            </Button>
            <Card className="bg-card/50">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="font-headline text-3xl">
                                {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </CardTitle>
                            <CardDescription>
                                {new Date(entry.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground" title={moodDetails[entry.mood].label}>
                            <MoodIcon className="h-8 w-8" />
                            <span className="font-semibold hidden sm:inline">{moodDetails[entry.mood].label}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8 py-6">
                    <div>
                        <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider mb-2">Prompt</h3>
                        <p className="italic text-lg">"{entry.prompt}"</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider mb-2">My Reflection</h3>
                        <div className="text-base leading-relaxed whitespace-pre-wrap">{entry.content}</div>
                    </div>

                    {entry.aiReflection && (
                        <div>
                            <h3 className="font-semibold text-primary-foreground/90 text-sm uppercase tracking-wider mb-2 flex items-center">
                               <Wand2 className="mr-2 h-4 w-4 text-primary" /> AI Suggested Reflection
                            </h3>
                            <Alert className="bg-primary/10 border-primary/20">
                                <AlertDescription className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                    {entry.aiReflection}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


function EntrySkeleton() {
    return (
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-10 w-48 mb-4" />
        <Card className="bg-card/50">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-8 py-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
}
