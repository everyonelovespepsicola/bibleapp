export interface EgwComment {
  id: string;
  sourceBook: string;       // e.g. "Christ's Object Lessons", "The Desire of Ages"
  sourceAbbrev: string;     // e.g. "COL", "DA"
  year?: number;            // e.g. 1900, 1898
  pageRef: string;          // e.g. "35.2" or "388.1" (page.paragraph)
  chapterNumber?: number;   // e.g. 1, 14
  chapterTitle?: string;    // e.g. "God With Us", "Science and the Bible"
  paragraphText: string;    // FULL paragraph containing the scripture reference
  targetVerses: string[];   // e.g. ["Luke 18:7", "Genesis 1:1", "John 3:16"]
}

export interface EgwParagraph {
  pageRef: string;          // e.g. "19.1", "19.2"
  text: string;
}

export interface EgwChapterData {
  bookTitle: string;        // e.g. "The Desire of Ages"
  bookAbbrev: string;       // e.g. "DA"
  chapterNumber: number;    // e.g. 1
  chapterTitle: string;     // e.g. "God With Us"
  paragraphs: EgwParagraph[];
  prevChapter?: { number: number; title: string };
  nextChapter?: { number: number; title: string };
}

export type StudyDrawerTab = 'strongs' | 'egw';
