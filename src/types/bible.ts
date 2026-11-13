export interface Verse {
  verse: number;
  text: string;
}

export interface Chapter {
  chapter: number;
  verses: Verse[];
}

export interface Book {
  bookNumber: number;
  name: string;
  abbrev?: string;
  chapters: Chapter[];
}

export interface BibleTranslation {
  id: string; // e.g., 'kjv', 'asv', 'esv'
  name: string; // e.g., 'King James Version'
  abbreviation: string;
  language?: string;
  description?: string;
  isCustom?: boolean;
  books: Book[];
}

export interface FlatVerse {
  bookIndex: number;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string; // e.g. "John 3:16"
}

export interface SearchFilter {
  bookIndex?: number;
  testament?: 'OT' | 'NT' | 'ALL';
}

export interface VerseReferenceQuery {
  bookName: string;
  matchedBookIndex: number;
  chapter: number;
  startVerse?: number;
  endVerse?: number;
}

