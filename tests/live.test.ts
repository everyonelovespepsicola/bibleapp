import { describe, it, expect } from 'vitest';
import { testLiveSiteEgwIndex, testLiveBookAvailability } from './liveSiteTester';

describe('Live Site Production Verification Suite', () => {
  it('fetches live egw_verse_index.json and verifies public domain count', async () => {
    const res = await testLiveSiteEgwIndex();
    console.log(`Live Unique Verses Indexed: ${res.uniqueVerses}`);
    console.log(`Live Verse Citations Sample:`, res.sampleVersesFound);

    // Verify 4,000+ public domain indexed verses are live
    expect(res.uniqueVerses).toBeGreaterThan(4000);
    expect(res.sampleVersesFound['Genesis 1:1']).toBeGreaterThanOrEqual(1);
    expect(res.sampleVersesFound['John 3:16']).toBeGreaterThan(10);
  }, 20000);

  it('verifies primary public domain books are live and healthy on GitHub Pages', async () => {
    const booksToTest = ['da', 'gc', 'sc', 'pp', 'pk', 'ed', 'mh'];
    for (const b of booksToTest) {
      const info = await testLiveBookAvailability(b);
      console.log(`Live Book [${b}]: "${info.title}" (${info.year}) — ${info.chaptersCount} chapters`);
      expect(info.status).toBe(200);
      expect(info.year).toBeLessThanOrEqual(1923);
      expect(info.chaptersCount).toBeGreaterThan(10);
    }
  }, 30000);
});
