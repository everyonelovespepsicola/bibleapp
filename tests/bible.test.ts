import { test, expect } from 'vitest';
import { parseVerseReference, parseMultipleReferences } from './src/utils/referenceParser';
import { searchBible } from './src/utils/searchEngine';
import kjvData from './public/kjv.json';

test('Parse verse references with colon and space and abbreviations', () => {
  const q1 = parseVerseReference('john 3:4-10');
  expect(q1?.bookName).toBe('John');
  expect(q1?.chapter).toBe(3);
  expect(q1?.startVerse).toBe(4);
  expect(q1?.endVerse).toBe(10);

  const q2 = parseVerseReference('mat 13 12');
  expect(q2?.bookName).toBe('Matthew');
  expect(q2?.chapter).toBe(13);
  expect(q2?.startVerse).toBe(12);

  const q3 = parseVerseReference('joh 113');
  expect(q3?.bookName).toBe('John');
  expect(q3?.chapter).toBe(1);
  expect(q3?.startVerse).toBe(13);

  const q4 = parseVerseReference('1 cor 13 4-8');
  expect(q4?.bookName).toBe('1 Corinthians');
  expect(q4?.chapter).toBe(13);
  expect(q4?.startVerse).toBe(4);
  expect(q4?.endVerse).toBe(8);
});

test('Search John 3:4-10 pulls exact verses', () => {
  const result1 = searchBible(kjvData as any, 'john 3:4-10');
  expect(result1.type).toBe('reference');
  expect(result1.count).toBe(7);
  expect(result1.verses[0].verse).toBe(4);
  expect(result1.verses[result1.verses.length - 1].verse).toBe(10);
});

test('Search abbreviated list of verses all at once', () => {
  const query = 'mat 13 12; joh 1 13; rom 8 28; gen 1 1; psa 23 1';
  const result = searchBible(kjvData as any, query);
  expect(result.type).toBe('reference');
  expect(result.count).toBe(5);
  expect(result.verses.map((v) => v.reference)).toEqual([
    'Matthew 13:12',
    'John 1:13',
    'Romans 8:28',
    'Genesis 1:1',
    'Psalms 23:1',
  ]);
});

test('Word / Keyword search for "light world"', () => {
  const result = searchBible(kjvData as any, 'light world');
  expect(result.type).toBe('keyword');
  expect(result.verses.length).toBeGreaterThan(0);
  const hasMatt514 = result.verses.some((v) => v.reference === 'Matthew 5:14');
  expect(hasMatt514).toBe(true);
});
