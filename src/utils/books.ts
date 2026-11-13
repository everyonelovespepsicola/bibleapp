export interface BookMeta {
  index: number; // 0-based
  name: string;
  aliases: string[];
  testament: 'OT' | 'NT';
  chapterCount: number;
}

export const CANONICAL_BOOKS: BookMeta[] = [
  // Old Testament
  { index: 0, name: 'Genesis', aliases: ['gen', 'ge', 'gn'], testament: 'OT', chapterCount: 50 },
  { index: 1, name: 'Exodus', aliases: ['exo', 'ex', 'exod'], testament: 'OT', chapterCount: 40 },
  { index: 2, name: 'Leviticus', aliases: ['lev', 'le', 'lv'], testament: 'OT', chapterCount: 27 },
  { index: 3, name: 'Numbers', aliases: ['num', 'nu', 'nm', 'nb'], testament: 'OT', chapterCount: 36 },
  { index: 4, name: 'Deuteronomy', aliases: ['deut', 'dt', 'de'], testament: 'OT', chapterCount: 34 },
  { index: 5, name: 'Joshua', aliases: ['josh', 'jos', 'jsh'], testament: 'OT', chapterCount: 24 },
  { index: 6, name: 'Judges', aliases: ['judg', 'jdg', 'jg', 'jdgs'], testament: 'OT', chapterCount: 21 },
  { index: 7, name: 'Ruth', aliases: ['rut', 'rth', 'ru'], testament: 'OT', chapterCount: 4 },
  { index: 8, name: '1 Samuel', aliases: ['1sam', '1sa', '1s', '1 samuel', 'i samuel', '1samuel', 'first samuel'], testament: 'OT', chapterCount: 31 },
  { index: 9, name: '2 Samuel', aliases: ['2sam', '2sa', '2s', '2 samuel', 'ii samuel', '2samuel', 'second samuel'], testament: 'OT', chapterCount: 24 },
  { index: 10, name: '1 Kings', aliases: ['1kgs', '1ki', '1k', '1 kings', 'i kings', '1kings', 'first kings'], testament: 'OT', chapterCount: 22 },
  { index: 11, name: '2 Kings', aliases: ['2kgs', '2ki', '2k', '2 kings', 'ii kings', '2kings', 'second kings'], testament: 'OT', chapterCount: 25 },
  { index: 12, name: '1 Chronicles', aliases: ['1chron', '1chr', '1ch', '1 chronicles', 'i chronicles', '1chronicles', 'first chronicles'], testament: 'OT', chapterCount: 29 },
  { index: 13, name: '2 Chronicles', aliases: ['2chron', '2chr', '2ch', '2 chronicles', 'ii chronicles', '2chronicles', 'second chronicles'], testament: 'OT', chapterCount: 36 },
  { index: 14, name: 'Ezra', aliases: ['ezr', 'ez'], testament: 'OT', chapterCount: 10 },
  { index: 15, name: 'Nehemiah', aliases: ['neh', 'ne'], testament: 'OT', chapterCount: 13 },
  { index: 16, name: 'Esther', aliases: ['esth', 'est', 'es'], testament: 'OT', chapterCount: 10 },
  { index: 17, name: 'Job', aliases: ['jb'], testament: 'OT', chapterCount: 42 },
  { index: 18, name: 'Psalms', aliases: ['psalm', 'psa', 'ps', 'psm', 'pss'], testament: 'OT', chapterCount: 150 },
  { index: 19, name: 'Proverbs', aliases: ['prov', 'pro', 'pr', 'prv'], testament: 'OT', chapterCount: 31 },
  { index: 20, name: 'Ecclesiastes', aliases: ['eccles', 'ecc', 'ec', 'qoh'], testament: 'OT', chapterCount: 12 },
  { index: 21, name: 'Song of Solomon', aliases: ['song of songs', 'song', 'sos', 'canticle of canticles', 'canticles', 'cant'], testament: 'OT', chapterCount: 8 },
  { index: 22, name: 'Isaiah', aliases: ['isa', 'is'], testament: 'OT', chapterCount: 66 },
  { index: 23, name: 'Jeremiah', aliases: ['jer', 'je', 'jr'], testament: 'OT', chapterCount: 52 },
  { index: 24, name: 'Lamentations', aliases: ['lam', 'la'], testament: 'OT', chapterCount: 5 },
  { index: 25, name: 'Ezekiel', aliases: ['ezek', 'eze', 'ezk'], testament: 'OT', chapterCount: 48 },
  { index: 26, name: 'Daniel', aliases: ['dan', 'da', 'dn'], testament: 'OT', chapterCount: 12 },
  { index: 27, name: 'Hosea', aliases: ['hos', 'ho'], testament: 'OT', chapterCount: 14 },
  { index: 28, name: 'Joel', aliases: ['joe', 'jl'], testament: 'OT', chapterCount: 3 },
  { index: 29, name: 'Amos', aliases: ['am', 'amo'], testament: 'OT', chapterCount: 9 },
  { index: 30, name: 'Obadiah', aliases: ['obad', 'oba', 'ob'], testament: 'OT', chapterCount: 1 },
  { index: 31, name: 'Jonah', aliases: ['jnh', 'jon'], testament: 'OT', chapterCount: 4 },
  { index: 32, name: 'Micah', aliases: ['mic', 'mc'], testament: 'OT', chapterCount: 7 },
  { index: 33, name: 'Nahum', aliases: ['nah', 'na'], testament: 'OT', chapterCount: 3 },
  { index: 34, name: 'Habakkuk', aliases: ['hab', 'hb'], testament: 'OT', chapterCount: 3 },
  { index: 35, name: 'Zephaniah', aliases: ['zeph', 'zep', 'zp'], testament: 'OT', chapterCount: 3 },
  { index: 36, name: 'Haggai', aliases: ['hag', 'hg'], testament: 'OT', chapterCount: 2 },
  { index: 37, name: 'Zechariah', aliases: ['zech', 'zec', 'zc'], testament: 'OT', chapterCount: 14 },
  { index: 38, name: 'Malachi', aliases: ['mal', 'ml'], testament: 'OT', chapterCount: 4 },

  // New Testament
  { index: 39, name: 'Matthew', aliases: ['matt', 'mat', 'mt'], testament: 'NT', chapterCount: 28 },
  { index: 40, name: 'Mark', aliases: ['mrk', 'mar', 'mk', 'mr'], testament: 'NT', chapterCount: 16 },
  { index: 41, name: 'Luke', aliases: ['luk', 'lk'], testament: 'NT', chapterCount: 24 },
  { index: 42, name: 'John', aliases: ['joh', 'jn', 'jhn'], testament: 'NT', chapterCount: 21 },
  { index: 43, name: 'Acts', aliases: ['act', 'ac'], testament: 'NT', chapterCount: 28 },
  { index: 44, name: 'Romans', aliases: ['rom', 'ro', 'rm'], testament: 'NT', chapterCount: 16 },
  { index: 45, name: '1 Corinthians', aliases: ['1cor', '1co', '1c', '1 corinthians', 'i corinthians', '1corinthians', 'first corinthians'], testament: 'NT', chapterCount: 16 },
  { index: 46, name: '2 Corinthians', aliases: ['2cor', '2co', '2c', '2 corinthians', 'ii corinthians', '2corinthians', 'second corinthians'], testament: 'NT', chapterCount: 13 },
  { index: 47, name: 'Galatians', aliases: ['gal', 'ga'], testament: 'NT', chapterCount: 6 },
  { index: 48, name: 'Ephesians', aliases: ['eph', 'ep'], testament: 'NT', chapterCount: 6 },
  { index: 49, name: 'Philippians', aliases: ['phil', 'php', 'pp'], testament: 'NT', chapterCount: 4 },
  { index: 50, name: 'Colossians', aliases: ['col', 'co'], testament: 'NT', chapterCount: 4 },
  { index: 51, name: '1 Thessalonians', aliases: ['1thess', '1th', '1 thessalonians', 'i thessalonians', '1thessalonians', 'first thessalonians'], testament: 'NT', chapterCount: 5 },
  { index: 52, name: '2 Thessalonians', aliases: ['2thess', '2th', '2 thessalonians', 'ii thessalonians', '2thessalonians', 'second thessalonians'], testament: 'NT', chapterCount: 3 },
  { index: 53, name: '1 Timothy', aliases: ['1tim', '1ti', '1t', '1 timothy', 'i timothy', '1timothy', 'first timothy'], testament: 'NT', chapterCount: 6 },
  { index: 54, name: '2 Timothy', aliases: ['2tim', '2ti', '2t', '2 timothy', 'ii timothy', '2timothy', 'second timothy'], testament: 'NT', chapterCount: 4 },
  { index: 55, name: 'Titus', aliases: ['tit', 'ti'], testament: 'NT', chapterCount: 3 },
  { index: 56, name: 'Philemon', aliases: ['philem', 'phm', 'pm'], testament: 'NT', chapterCount: 1 },
  { index: 57, name: 'Hebrews', aliases: ['heb', 'he'], testament: 'NT', chapterCount: 13 },
  { index: 58, name: 'James', aliases: ['jas', 'jm', 'jam'], testament: 'NT', chapterCount: 5 },
  { index: 59, name: '1 Peter', aliases: ['1pet', '1pe', '1pt', '1p', '1 peter', 'i peter', '1peter', 'first peter'], testament: 'NT', chapterCount: 5 },
  { index: 60, name: '2 Peter', aliases: ['2pet', '2pe', '2pt', '2p', '2 peter', 'ii peter', '2peter', 'second peter'], testament: 'NT', chapterCount: 3 },
  { index: 61, name: '1 John', aliases: ['1joh', '1jn', '1j', '1 john', 'i john', '1john', 'first john'], testament: 'NT', chapterCount: 5 },
  { index: 62, name: '2 John', aliases: ['2joh', '2jn', '2j', '2 john', 'ii john', '2john', 'second john'], testament: 'NT', chapterCount: 1 },
  { index: 63, name: '3 John', aliases: ['3joh', '3jn', '3j', '3 john', 'iii john', '3john', 'third john'], testament: 'NT', chapterCount: 1 },
  { index: 64, name: 'Jude', aliases: ['jud', 'jd'], testament: 'NT', chapterCount: 1 },
  { index: 65, name: 'Revelation', aliases: ['rev', 're', 'rv', 'apocalypse'], testament: 'NT', chapterCount: 22 },
];

export function findBookMeta(query: string): BookMeta | null {
  const clean = query.trim().toLowerCase().replace(/\./g, '');
  if (!clean) return null;

  for (const book of CANONICAL_BOOKS) {
    if (book.name.toLowerCase() === clean) return book;
    if (book.aliases.includes(clean)) return book;
  }

  // Prefix match (e.g. "gen" matching "genesis")
  for (const book of CANONICAL_BOOKS) {
    if (book.name.toLowerCase().startsWith(clean)) return book;
  }

  return null;
}

