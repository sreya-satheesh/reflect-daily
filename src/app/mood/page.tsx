import MoodChart from '@/components/mood-chart';

export default function MoodPage() {
    return (
        <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <h1 className="font-headline text-3xl md:text-4xl font-bold">
                    Mood Trends
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Visualize your emotional journey over time.
                </p>
            </div>
            <MoodChart />
        </div>
    );
}
