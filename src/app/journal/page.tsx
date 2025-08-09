import JournalList from '@/components/journal-list';

export default function JournalPage() {
  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">
          My Journal
        </h1>
      </div>
      <JournalList />
    </div>
  );
}
