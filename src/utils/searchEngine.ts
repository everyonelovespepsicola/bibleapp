import type { BibleTranslation, FlatVerse, SearchFilter } from '../types/bible';
import { parseVerseReference } from './referenceParser';
import { CANONICAL_BOOKS, findBookMeta } from './books';

export interface SearchResult {
  type: 'reference' | 'keyword';
  title: string;
  count: number;
  verses: FlatVerse[];
}

export function searchBible(
  translation: BibleTranslation,
  query: string,
  filter?: SearchFilter,
  limit = 100000
): SearchResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return { type: 'keyword', title: '', count: 0, verses: [] };
  }

  // 1. Try Reference Parser first
  const refQuery = parseVerseReference(trimmed);
  if (refQuery) {
    const book = translation.books.find((b) => {
      const meta = findBookMeta(b.name);
      return (
        meta?.index === refQuery.matchedBookIndex ||
        b.name.toLowerCase() === refQuery.bookName.toLowerCase() ||
        (b.abbrev && b.abbrev.toLowerCase() === refQuery.bookName.toLowerCase())
      );
    });

    if (book) {
      const chapter = book.chapters.find((c) => c.chapter === refQuery.chapter);
      if (chapter) {
        let matchedVerses = chapter.verses;
        if (refQuery.startVerse !== undefined) {
          const start = refQuery.startVerse;
          const end = refQuery.endVerse ?? start;
          matchedVerses = chapter.verses.filter((v) => v.verse >= start && v.verse <= end);
        }

        const flatResults: FlatVerse[] = matchedVerses.map((v) => ({
          bookIndex: refQuery.matchedBookIndex,
          bookName: book.name,
          chapter: chapter.chapter,
          verse: v.verse,
          text: v.text,
          reference: `${book.name} ${chapter.chapter}:${v.verse}`,
        }));

        let rangeTitle = `${book.name} ${chapter.chapter}`;
        if (refQuery.startVerse !== undefined) {
          rangeTitle += `:${refQuery.startVerse}`;
          if (refQuery.endVerse && refQuery.endVerse !== refQuery.startVerse) {
            rangeTitle += `-${refQuery.endVerse}`;
          }
        }

        return {
          type: 'reference',
          title: rangeTitle,
          count: flatResults.length,
          verses: flatResults,
        };
      }
    }
  }

  // 2. Fall back to Keyword / Word Search
  const terms = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  const results: FlatVerse[] = [];

  for (let bIdx = 0; bIdx < translation.books.length; bIdx++) {
    const book = translation.books[bIdx];
    const canonicalMeta = findBookMeta(book.name) || CANONICAL_BOOKS[bIdx];

    if (filter?.bookIndex !== undefined && canonicalMeta && canonicalMeta.index !== filter.bookIndex) {
      continue;
    }

    if (filter?.testament && filter.testament !== 'ALL' && canonicalMeta) {
      if (canonicalMeta.testament !== filter.testament) {
        continue;
      }
    }

    for (const chap of book.chapters) {
      for (const v of chap.verses) {
        // Strip markdown asterisks so search matches naturally regardless of italics
        const cleanVerseText = v.text.replace(/\*/g, '').toLowerCase();
        const matchesAll = terms.every((t) => {
          // If searching by Strong's number e.g. "H7225" or "G3056"
          if (/^[HG]\d+$/i.test(t)) {
            return (v.strongsText || '').toLowerCase().includes(`[${t.toLowerCase()}]`);
          }
          return cleanVerseText.includes(t);
        });

        if (matchesAll) {
          results.push({
            bookIndex: canonicalMeta ? canonicalMeta.index : bIdx,
            bookName: book.name,
            chapter: chap.chapter,
            verse: v.verse,
            text: v.text,
            reference: `${book.name} ${chap.chapter}:${v.verse}`,
          });

          if (results.length >= limit) {
            break;
          }
        }
      }
      if (results.length >= limit) break;
    }
    if (results.length >= limit) break;
  }

  return {
    type: 'keyword',
    title: `Matches for "${trimmed}"`,
    count: results.length,
    verses: results,
  };
}
