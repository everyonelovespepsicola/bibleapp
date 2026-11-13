import { test, expect } from 'vitest';
import kjvData from '../public/kjv.json';

test('Audit all 31,102 verses across all 66 books for untagged words', () => {
  let totalVerses = 0;
  let totalTaggedTokens = 0;
  const untaggedFrequency: Record<string, number> = {};

  for (const book of kjvData.books) {
    for (const chap of book.chapters) {
      for (const v of chap.verses) {
        totalVerses++;
        const st = (v as any).strongsText || '';
        const matches = st.match(/\[[HG]\d+\]/g) || [];
        totalTaggedTokens += matches.length;

        // Remove tagged words: e.g. "word[H1234]"
        let unmarked = st.replace(/[a-zA-Z’'*\\-]+\s*\[[HG]\d+\]/g, ' ');
        unmarked = unmarked.replace(/\[[HG]\d+\]/g, ' ');
        unmarked = unmarked.replace(/[\*.,:;?!()\[\]"'“”’—–\-0-9]/g, ' ');

        const words = unmarked.split(/\s+/).filter(Boolean);
        for (const w of words) {
          const lower = w.toLowerCase();
          untaggedFrequency[lower] = (untaggedFrequency[lower] || 0) + 1;
        }
      }
    }
  }

  expect(totalVerses).toBe(31102);
  expect(totalTaggedTokens).toBeGreaterThan(700000);
  
  // Sort and display top remaining words
  const sorted = Object.entries(untaggedFrequency).sort((a, b) => b[1] - a[1]);
  console.log(`Audited ${totalVerses} verses.`);
  console.log(`Total tagged words: ${totalTaggedTokens}`);
  console.log(`Remaining untagged tokens: ${sorted.reduce((acc, curr) => acc + curr[1], 0)}`);
  console.log('Top 20 most frequent untagged words:', sorted.slice(0, 20));
});

