import type { BibleTranslation, Book, Chapter, Verse } from '../types/bible';
import { findBookMeta, CANONICAL_BOOKS } from './books';

export function absorbBibleJson(
  jsonData: any,
  fileNameFallback = 'Imported Bible'
): BibleTranslation {
  if (!jsonData || typeof jsonData !== 'object') {
    throw new Error('Invalid JSON: Root must be an object or array.');
  }

  // Format 1: Already standardized or close to standard
  if (jsonData.books && Array.isArray(jsonData.books)) {
    const id = jsonData.id || slugify(jsonData.name || fileNameFallback);
    const name = jsonData.name || fileNameFallback;
    const abbreviation = jsonData.abbreviation || jsonData.id?.toUpperCase() || name.substring(0, 4).toUpperCase();
    
    return {
      id,
      name,
      abbreviation,
      language: jsonData.language || 'en',
      description: jsonData.description || 'Imported Bible translation',
      isCustom: true,
      books: normalizeStandardBooks(jsonData.books),
    };
  }

  // Format 2: Array of books (e.g. thiagobodruk format: [ { name: "Genesis", chapters: string[][] } ])
  if (Array.isArray(jsonData)) {
    const translationName = fileNameFallback.replace(/\.json$/i, '');
    const books: Book[] = [];

    jsonData.forEach((rawBook, idx) => {
      const bookName = rawBook.name || rawBook.book || (CANONICAL_BOOKS[idx] ? CANONICAL_BOOKS[idx].name : `Book ${idx + 1}`);
      const rawChapters = rawBook.chapters || [];
      const chapters: Chapter[] = [];

      rawChapters.forEach((rawChap: any, cIdx: number) => {
        const chapNum = typeof rawChap === 'object' && rawChap.chapter ? rawChap.chapter : cIdx + 1;
        const verses: Verse[] = [];

        if (Array.isArray(rawChap)) {
          rawChap.forEach((vText: any, vIdx: number) => {
            verses.push({
              verse: vIdx + 1,
              text: String(vText || '').trim(),
            });
          });
        } else if (rawChap && Array.isArray(rawChap.verses)) {
          rawChap.verses.forEach((vObj: any, vIdx: number) => {
            verses.push({
              verse: vObj.verse || vIdx + 1,
              text: String(vObj.text || '').trim(),
            });
          });
        }

        chapters.push({
          chapter: chapNum,
          verses,
        });
      });

      books.push({
        bookNumber: idx + 1,
        name: bookName,
        abbrev: rawBook.abbrev,
        chapters,
      });
    });

    return {
      id: slugify(translationName),
      name: translationName,
      abbreviation: translationName.substring(0, 4).toUpperCase(),
      language: 'en',
      description: `Imported translation (${books.length} books)`,
      isCustom: true,
      books: alignBooksWithCanonical(books),
    };
  }

  // Format 3: Flat verse dictionary or object keyed by book
  if (Array.isArray(jsonData.verses)) {
    return parseFlatVerseList(jsonData.verses, fileNameFallback);
  }

  const keys = Object.keys(jsonData);
  if (keys.length > 0 && typeof jsonData[keys[0]] === 'object') {
    return parseNestedDictionary(jsonData, fileNameFallback);
  }

  throw new Error('Unsupported JSON structure. Please ensure it contains books or verses.');
}

function normalizeStandardBooks(rawBooks: any[]): Book[] {
  return rawBooks.map((b, idx) => ({
    bookNumber: b.bookNumber || idx + 1,
    name: b.name || `Book ${idx + 1}`,
    abbrev: b.abbrev,
    chapters: (b.chapters || []).map((c: any, cIdx: number) => ({
      chapter: c.chapter || cIdx + 1,
      verses: (c.verses || []).map((v: any, vIdx: number) => ({
        verse: v.verse || vIdx + 1,
        text: typeof v === 'string' ? v : String(v.text || ''),
      })),
    })),
  }));
}

function parseFlatVerseList(versesList: any[], nameFallback: string): BibleTranslation {
  const booksMap = new Map<string, Map<number, Verse[]>>();

  for (const row of versesList) {
    const bookName = row.book_name || row.book || row.bookName || 'Unknown';
    const chapterNum = Number(row.chapter || row.chapterNumber || 1);
    const verseNum = Number(row.verse || row.verseNumber || 1);
    const text = String(row.text || '');

    if (!booksMap.has(bookName)) {
      booksMap.set(bookName, new Map());
    }
    const chapMap = booksMap.get(bookName)!;
    if (!chapMap.has(chapterNum)) {
      chapMap.set(chapterNum, []);
    }
    chapMap.get(chapterNum)!.push({ verse: verseNum, text });
  }

  const books: Book[] = [];
  let bNum = 1;
  booksMap.forEach((chapMap, bookName) => {
    const chapters: Chapter[] = [];
    chapMap.forEach((verses, chapNum) => {
      verses.sort((a, b) => a.verse - b.verse);
      chapters.push({ chapter: chapNum, verses });
    });
    chapters.sort((a, b) => a.chapter - b.chapter);
    books.push({
      bookNumber: bNum++,
      name: bookName,
      chapters,
    });
  });

  const translationName = nameFallback.replace(/\.json$/i, '');
  return {
    id: slugify(translationName),
    name: translationName,
    abbreviation: translationName.substring(0, 4).toUpperCase(),
    language: 'en',
    description: `Imported translation (${books.length} books)`,
    isCustom: true,
    books: alignBooksWithCanonical(books),
  };
}

function parseNestedDictionary(dict: Record<string, any>, nameFallback: string): BibleTranslation {
  const books: Book[] = [];
  let bNum = 1;

  for (const [bookKey, chapObj] of Object.entries(dict)) {
    const chapters: Chapter[] = [];
    if (typeof chapObj === 'object' && chapObj !== null) {
      for (const [chapKey, verseObj] of Object.entries(chapObj)) {
        const cNum = parseInt(chapKey, 10) || 1;
        const verses: Verse[] = [];
        if (typeof verseObj === 'object' && verseObj !== null) {
          if (Array.isArray(verseObj)) {
            verseObj.forEach((vText, idx) => {
              verses.push({ verse: idx + 1, text: String(vText) });
            });
          } else {
            for (const [vKey, vText] of Object.entries(verseObj)) {
              verses.push({ verse: parseInt(vKey, 10) || 1, text: String(vText) });
            }
          }
        }
        verses.sort((a, b) => a.verse - b.verse);
        chapters.push({ chapter: cNum, verses });
      }
    }
    chapters.sort((a, b) => a.chapter - b.chapter);
    books.push({
      bookNumber: bNum++,
      name: bookKey,
      chapters,
    });
  }

  const translationName = nameFallback.replace(/\.json$/i, '');
  return {
    id: slugify(translationName),
    name: translationName,
    abbreviation: translationName.substring(0, 4).toUpperCase(),
    isCustom: true,
    books: alignBooksWithCanonical(books),
  };
}

function alignBooksWithCanonical(books: Book[]): Book[] {
  return books.sort((a, b) => {
    const metaA = findBookMeta(a.name);
    const metaB = findBookMeta(b.name);
    const indexA = metaA ? metaA.index : a.bookNumber + 100;
    const indexB = metaB ? metaB.index : b.bookNumber + 100;
    return indexA - indexB;
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[-\s]+/g, '_');
}
