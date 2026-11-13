import { findBookMeta } from './books';
import type { VerseReferenceQuery } from '../types/bible';

/**
 * Parses user input queries like:
 * - "john 3:16"
 * - "john 3:4-10"
 * - "john 3 4-10"
 * - "john 3 16"
 * - "1 john 1:9"
 * - "genesis 1:1-5"
 * - "psalm 23"
 */
export function parseVerseReference(input: string): VerseReferenceQuery | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Pattern: Book name followed by chapter : or space verse (- verse)
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

  // Chapter-only pattern: e.g. "john 3" or "psalm 23"
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
