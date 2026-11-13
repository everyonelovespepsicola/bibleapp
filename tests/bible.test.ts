import { test, expect } from 'vitest';
import { parseVerseReference, parseMultipleReferences } from './src/utils/referenceParser';
import { searchBible } from './src/utils/searchEngine';
import kjvData from './public/kjv.json';

test('Parse verse references with colon and space', () => {
  const q1 = parseVerseReference('john 3:4-10');
  expect(q1).not.toBeNull();
  expect(q1?.bookName).toBe('John');
  expect(q1?.chapter).toBe(3);
  expect(q1?.startVerse).toBe(4);
  expect(q1?.endVerse).toBe(10);

  const q2 = parseVerseReference('john 3 4-10');
  expect(q2).not.toBeNull();
  expect(q2?.bookName).toBe('John');
  expect(q2?.chapter).toBe(3);
  expect(q2?.startVerse).toBe(4);
  expect(q2?.endVerse).toBe(10);

  const q3 = parseVerseReference('1 john 1:9');
  expect(q3?.bookName).toBe('1 John');
  expect(q3?.chapter).toBe(1);
  expect(q3?.startVerse).toBe(9);
});

test('Search John 3:4-10 pulls exact verses', () => {
  const result1 = searchBible(kjvData as any, 'john 3:4-10');
  expect(result1.type).toBe('reference');
  expect(result1.count).toBe(7); // verses 4, 5, 6, 7, 8, 9, 10
  expect(result1.verses[0].verse).toBe(4);
  expect(result1.verses[result1.verses.length - 1].verse).toBe(10);

  const result2 = searchBible(kjvData as any, 'john 3 4-10');
  expect(result2.type).toBe('reference');
  expect(result2.count).toBe(7);
  expect(result2.verses[0].verse).toBe(4);
  expect(result2.verses[result2.verses.length - 1].verse).toBe(10);
});

test('Search multiple references at once separated by semicolon', () => {
  const query = 'Genesis 1:1; John 3:16; Romans 8:28; Psalm 23:1; Matthew 5:3';
  const parsed = parseMultipleReferences(query);
  expect(parsed.length).toBe(5);

  const result = searchBible(kjvData as any, query);
  expect(result.type).toBe('reference');
  expect(result.count).toBe(5);
  expect(result.verses.map((v) => v.reference)).toEqual([
    'Genesis 1:1',
    'John 3:16',
    'Romans 8:28',
    'Psalms 23:1',
    'Matthew 5:3',
  ]);
});

test('Word / Keyword search for "light world"', () => {
  const result = searchBible(kjvData as any, 'light world');
  expect(result.type).toBe('keyword');
  expect(result.verses.length).toBeGreaterThan(0);
  const hasMatt514 = result.verses.some((v) => v.reference === 'Matthew 5:14');
  expect(hasMatt514).toBe(true);
});
