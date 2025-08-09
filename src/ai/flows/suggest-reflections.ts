'use server';

/**
 * @fileOverview Uses AI to suggest additional reflections based on past journal entries.
 *
 * - suggestReflections - A function that suggests reflections based on past journal entries.
 * - SuggestReflectionsInput - The input type for the suggestReflections function.
 * - SuggestReflectionsOutput - The return type for the suggestReflections function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestReflectionsInputSchema = z.object({
  pastEntries: z
    .string()
    .describe('The user\'s past journal entries.'),
  currentEntry: z
    .string()
    .describe('The user\'s current journal entry.'),
});
export type SuggestReflectionsInput = z.infer<typeof SuggestReflectionsInputSchema>;

const SuggestReflectionsOutputSchema = z.object({
  suggestedReflections: z
    .string()
    .describe('AI suggested reflections on past journal entries.'),
});
export type SuggestReflectionsOutput = z.infer<typeof SuggestReflectionsOutputSchema>;

export async function suggestReflections(input: SuggestReflectionsInput): Promise<SuggestReflectionsOutput> {
  return suggestReflectionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReflectionsPrompt',
  input: {schema: SuggestReflectionsInputSchema},
  output: {schema: SuggestReflectionsOutputSchema},
  prompt: `You are a mindfulness assistant that helps users gain deeper insights into their thoughts and feelings.

  Based on the user\'s past journal entries and current entry, suggest additional reflections that the user can consider and add to their daily writing.

  Past Entries: {{{pastEntries}}}

  Current Entry: {{{currentEntry}}}

  Suggested Reflections:`,
});

const suggestReflectionsFlow = ai.defineFlow(
  {
    name: 'suggestReflectionsFlow',
    inputSchema: SuggestReflectionsInputSchema,
    outputSchema: SuggestReflectionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
