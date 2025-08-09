"use client";

import { useState, useEffect, useCallback } from 'react';
import type { JournalEntry } from '@/types';

const JOURNAL_STORAGE_KEY = 'reflect-daily-journal';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem(JOURNAL_STORAGE_KEY);
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries).sort((a: JournalEntry, b: JournalEntry) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    } catch (error) {
      console.error("Failed to load journal entries from local storage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLocalStorage = (updatedEntries: JournalEntry[]) => {
    try {
      const sortedEntries = updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(sortedEntries));
    } catch (error) {
      console.error("Failed to save journal entries to local storage", error);
    }
  };

  const addEntry = useCallback((newEntry: Omit<JournalEntry, 'id' | 'date'>) => {
    const entry: JournalEntry = {
      ...newEntry,
      id: new Date().toISOString() + Math.random(),
      date: new Date().toISOString(),
    };
    setEntries(prevEntries => {
        const updatedEntries = [entry, ...prevEntries];
        updateLocalStorage(updatedEntries);
        return updatedEntries;
    });
    return entry;
  }, []);
  
  const updateEntry = useCallback((id: string, updatedContent: Partial<JournalEntry>) => {
    setEntries(prevEntries => {
        const updatedEntries = prevEntries.map(entry => 
          entry.id === id ? { ...entry, ...updatedContent } : entry
        );
        updateLocalStorage(updatedEntries);
        return updatedEntries;
    });
  }, []);


  const getEntry = useCallback((id: string) => {
    return entries.find(entry => entry.id === id);
  }, [entries]);

  const getPastEntries = useCallback((excludeId?: string): JournalEntry[] => {
    return entries.filter(entry => entry.id !== excludeId);
  }, [entries]);

  const exportEntries = useCallback(() => {
    const fileContent = entries
      .map(entry => {
        return `Date: ${new Date(entry.date).toLocaleString()}\nPrompt: ${entry.prompt}\nMood: ${entry.mood}\n\n${entry.content}\n\nAI Reflection: ${entry.aiReflection || 'N/A'}\n\n---\n\n`;
      })
      .join('');
    
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reflect-daily-journal-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [entries]);

  return { entries, loading, addEntry, getEntry, updateEntry, getPastEntries, exportEntries };
}
