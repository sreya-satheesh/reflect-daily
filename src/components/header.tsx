import Link from 'next/link';
import { BookOpenText, BarChart3, Feather } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Feather className="h-7 w-7 text-accent" />
          <span className="font-headline text-2xl font-bold text-foreground">
            Reflect Daily
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2 text-sm sm:text-base">
              <Feather className="h-5 w-5" />
              <span className="hidden sm:inline">New Entry</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/journal" className="flex items-center gap-2 text-sm sm:text-base">
              <BookOpenText className="h-5 w-5" />
              <span className="hidden sm:inline">My Journal</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/mood" className="flex items-center gap-2 text-sm sm:text-base">
              <BarChart3 className="h-5 w-5" />
              <span className="hidden sm:inline">Mood Trends</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
