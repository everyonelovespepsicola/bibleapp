export interface Verse {
  verse: number;
  text: string;
  strongsText?: string; // e.g. "In[G1722] the beginning[G746]..."
  isParagraphStart?: boolean;
}

export interface StrongsEntry {
  number: string; // e.g. "H7225" or "G3056"
  lemma: string; // e.g. "רֵאשִׁית" or "λόγος"
  xlit: string; // Transliteration e.g. "rêʼshîyth"
  pronounce: string; // e.g. "ray-sheeth'"
  description: string; // Exhaustive definition & derivation
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

