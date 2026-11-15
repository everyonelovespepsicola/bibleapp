export interface EgwComment {
  id: string;
  sourceBook: string;       // e.g. "The Desire of Ages"
  sourceAbbrev: string;     // e.g. "DA"
  year?: number;            // e.g. 1898
  pageRef: string;          // e.g. "p. 19.1" or "ch. 3, p. 24"
  chapterTitle?: string;    // e.g. "God With Us"
  text: string;             // paragraph text referencing or commenting on the verse
  targetVerses: string[];   // e.g. ["John 3:16", "Rom 8:32"]
}

export type StudyDrawerTab = 'strongs' | 'egw';
