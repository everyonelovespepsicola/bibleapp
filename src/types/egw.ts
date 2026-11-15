export interface EgwComment {
  id: string;
  sourceBook: string;       // e.g. "Christ's Object Lessons", "The Desire of Ages"
  sourceAbbrev: string;     // e.g. "COL", "DA"
  year?: number;            // e.g. 1900, 1898
  pageRef: string;          // e.g. "35.2" or "388.1" (page.paragraph)
  chapterTitle?: string;    // e.g. "'Shall Not God Avenge His Own?'"
  paragraphText: string;    // FULL paragraph containing the scripture reference
  targetVerses: string[];   // e.g. ["Luke 18:7", "Luke 18:8", "John 3:16"]
}

export type StudyDrawerTab = 'strongs' | 'egw';
