import { findBookMeta } from './books';
import type { VerseReferenceQuery } from '../types/bible';

/**
 * Parses user input queries like:
 * - "john 3:16", "joh 3 16", "jn 3 16"
 * - "mat 13 12", "mt 13 12"
 * - "joh 1 13" or "joh 1:13"
 * - "1 cor 13 4-8"
 * - "genesis 1:1-5"
 * - "psalm 23"
 */
export function parseVerseReference(input: string): VerseReferenceQuery | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Standard pattern: Book name followed by chapter : or space verse (- verse)
  // e.g. "mat 13 12", "mat 13:12", "1 cor 13 4-8"
  const verseRangeRegex = /^\s*([0-9]?\s*[a-zA-Z\s]+?)\s*(\d+)[\s:]+(\d+)(?:\s*[-–—]\s*(\d+))?\s*$/i;
  const match = trimmed.match(verseRangeRegex);

  if (match) {
    const rawBook = match[1].trim();
    const chapter = parseInt(match[2], 10);
    const startVerse = parseInt(match[3], 10);
    const endVerse = match[4] ? parseInt(match[4], 10) : startVerse;

    const bookMeta = findBookMeta(rawBook);
    if (bookMeta) {
      return {
        bookName: bookMeta.name,
        matchedBookIndex: bookMeta.index,
        chapter,
        startVerse: Math.min(startVerse, endVerse),
        endVerse: Math.max(startVerse, endVerse),
      };
    }
  }

  // 2. Compact fused pattern without spaces: e.g. "joh 113" -> John 1:13 or "gen 11"
  // Try matching letters followed by contiguous digits
  const fusedRegex = /^\s*([0-9]?\s*[a-zA-Z]+)\s*(\d{2,4})\s*$/i;
  const matchFused = trimmed.match(fusedRegex);
  if (matchFused) {
    const rawBook = matchFused[1].trim();
    const digits = matchFused[2];
    const bookMeta = findBookMeta(rawBook);
    if (bookMeta) {
      // Test different split positions (chapter vs verse) that match the book's chapter count
      for (let splitAt = 1; splitAt < digits.length; splitAt++) {
        const chap = parseInt(digits.slice(0, splitAt), 10);
        const vNum = parseInt(digits.slice(splitAt), 10);
        if (chap > 0 && chap <= bookMeta.chapterCount && vNum > 0) {
          return {
            bookName: bookMeta.name,
            matchedBookIndex: bookMeta.index,
            chapter: chap,
            startVerse: vNum,
            endVerse: vNum,
          };
        }
      }
    }
  }

  // 3. Chapter-only pattern: e.g. "john 3" or "psalm 23"
  const chapterOnlyRegex = /^\s*([0-9]?\s*[a-zA-Z\s]+?)\s*(\d+)\s*$/i;
  const matchChapter = trimmed.match(chapterOnlyRegex);
  if (matchChapter) {
    const rawBook = matchChapter[1].trim();
    const chapter = parseInt(matchChapter[2], 10);
    const bookMeta = findBookMeta(rawBook);
    if (bookMeta && chapter > 0 && chapter <= bookMeta.chapterCount) {
      return {
        bookName: bookMeta.name,
        matchedBookIndex: bookMeta.index,
        chapter,
        startVerse: undefined,
        endVerse: undefined,
      };
    }
  }

  return null;
}

/**
 * Parses multi-reference queries separated by semicolons, commas, or line breaks:
 * e.g. "mat 13 12; joh 1 13; rom 8 28; gen 1 1"
 */
export function parseMultipleReferences(input: string): VerseReferenceQuery[] {
  const delimiterRegex = /[;\n\r]+|(?<=\d)\s*,\s*(?=[0-9a-zA-Z])/;
  const parts = input.split(delimiterRegex).map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) return [];

  const parsedList: VerseReferenceQuery[] = [];
  for (const part of parts) {
    const parsed = parseVerseReference(part);
    if (parsed) {
      parsedList.push(parsed);
    }
  }

  return parsedList;
}
