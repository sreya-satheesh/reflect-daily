'use client';

import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useJournal } from '@/hooks/use-journal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Mood } from '@/types';
import Link from 'next/link';
import { Button } from './ui/button';

const moodOrder: Mood[] = ['ecstatic', 'happy', 'neutral', 'sad', 'devastated'];
const moodColors: Record<Mood, string> = {
  ecstatic: 'hsl(var(--chart-1))',
  happy: 'hsl(var(--chart-2))',
  neutral: 'hsl(var(--chart-3))',
  sad: 'hsl(var(--chart-4))',
  devastated: 'hsl(var(--chart-5))',
};

export default function MoodChart() {
  const { entries, loading } = useJournal();

  const moodData = useMemo(() => {
    const moodCounts: Record<Mood, number> = {
      ecstatic: 0,
      happy: 0,
      neutral: 0,
      sad: 0,
      devastated: 0,
    };
    entries.forEach(entry => {
      moodCounts[entry.mood]++;
    });

    return moodOrder.map(mood => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      count: moodCounts[mood],
      fill: moodColors[mood],
    }));
  }, [entries]);

  const totalEntries = useMemo(() => entries.length, [entries]);

  if (loading) {
    return (
      <Card className="bg-card/50">
        <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[350px]" />
        </CardContent>
      </Card>
    );
  }
  
  if (totalEntries < 1) {
    return (
        <Card className="text-center py-12 bg-card/80">
            <CardContent>
                <h3 className="text-xl font-semibold">Not enough data</h3>
                <p className="text-muted-foreground mt-2">
                    Log your mood in new entries to see your trends here.
                </p>
                <Button asChild className="mt-4">
                    <Link href="/">Write Today's Entry</Link>
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle>Your Moods at a Glance</CardTitle>
        <CardDescription>A summary of your {totalEntries} logged moods.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moodData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ 
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                 {moodData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
