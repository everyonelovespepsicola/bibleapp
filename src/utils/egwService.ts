import type { EgwComment, EgwChapterData } from '../types/egw';
import {
  getEgwVerseIndexOffline,
  saveEgwVerseIndexOffline,
  getEgwBookOffline,
  saveEgwBookOffline,
} from '../services/db';

/**
 * Standard fallback public-domain EGW commentary paragraphs.
 */
export const SAMPLE_EGW_COMMENTS: EgwComment[] = [
  {
    id: 'ed-134-2',
    sourceBook: 'Education',
    sourceAbbrev: 'Ed',
    year: 1903,
    pageRef: '134.2',
    chapterNumber: 28,
    chapterTitle: 'Chapter 14—Science and the Bible',
    paragraphText: "'In the beginning God.' Genesis 1:1. Here alone can the mind in its eager questioning, fleeing as the dove to the ark, find rest. Above, beneath, beyond, abides Infinite Love, working out all things to accomplish 'the good pleasure of His goodness.' 2 Thessalonians 1:11.",
    targetVerses: ['Genesis 1:1', '2 Thessalonians 1:11'],
  },
  {
    id: '8t-258-4',
    sourceBook: 'Testimonies for the Church, Vol. 8',
    sourceAbbrev: '8T',
    year: 1904,
    pageRef: '258.4',
    chapterNumber: 42,
    chapterTitle: 'God in Nature',
    paragraphText: "The theory that God did not create matter when He brought the world into existence is without foundation. In the formation of our world, God was not indebted to pre-existing matter. On the contrary, all things, material or spiritual, stood up before the Lord Jehovah at His voice and were created for His own purpose. The heavens and all the host of them, the earth and all things therein, are not only the work of His hand; they came into existence by the breath of His mouth.",
    targetVerses: ['Genesis 1:1', 'Psalm 33:6', 'Psalm 33:9', 'Hebrews 11:3'],
  },
  {
    id: 'da-19-1',
    sourceBook: 'The Desire of Ages',
    sourceAbbrev: 'DA',
    year: 1898,
    pageRef: '19.1',
    chapterNumber: 2,
    chapterTitle: 'Chapter 1—“God With Us”',
    paragraphText: "'His name shall be called Immanuel, ... God with us.' The light of the knowledge of the glory of God is seen 'in the face of Jesus Christ.' From the days of eternity the Lord Jesus Christ was one with the Father; He was 'the image of God,' the image of His greatness and majesty, 'the outshining of His glory.' It was to manifest this glory that He came to our world. To this sin-darkened earth He came to reveal the light of God's love,—to be 'God with us.' Therefore it was prophesieth of Him, 'His name shall be called Immanuel.'",
    targetVerses: ['Matthew 1:23', 'John 1:1', 'John 1:14', 'Hebrews 1:3', '2 Corinthians 4:6'],
  },
  {
    id: 'da-25-3',
    sourceBook: 'The Desire of Ages',
    sourceAbbrev: 'DA',
    year: 1898,
    pageRef: '25.3',
    chapterNumber: 2,
    chapterTitle: 'Chapter 1—“God With Us”',
    paragraphText: "By His life and His death, Christ has achieved even more than recovery from the ruin wrought through sin. It was Satan's purpose to bring about an eternal separation between God and man; but in Christ we become more closely united to God than if we had never fallen. In taking our nature, the Saviour has bound Himself to humanity by a tie that is never to be broken. Through the eternal ages He is linked with us. 'God so loved the world, that He gave His only-begotten Son.' He gave Him not only to bear our sins, and to die as our sacrifice; He gave Him to the fallen race. To assure us of His immutable counsel of peace, God gave His only-begotten Son to become one of the human family, for ever to retain His human nature.",
    targetVerses: ['Romans 5:20', 'Romans 8:38', 'Romans 8:39', 'John 3:16'],
  },
  {
    id: 'col-35-2',
    sourceBook: "Christ's Object Lessons",
    sourceAbbrev: 'COL',
    year: 1900,
    pageRef: '35.2',
    chapterNumber: 5,
    chapterTitle: 'Chapter 2—The Sower Went Forth to Sow',
    paragraphText: "The word of God is the seed. Every seed has in itself a germinating principle. In it the life of the plant is enfolded. So there is life in God's word. 'The words that I speak unto you,' said Christ, 'they are spirit, and they are life.' 'He that heareth My word, and believeth on Him that sent Me, hath everlasting life.' In every command and in every promise of the word of God is the power, the very life of God, by which the command may be fulfilled and the promise realized. He who by faith receives the word is receiving the very life and character of God.",
    targetVerses: ['Luke 8:11', 'John 6:63', 'John 5:24'],
  },
  {
    id: 'da-388-1',
    sourceBook: 'The Desire of Ages',
    sourceAbbrev: 'DA',
    year: 1898,
    pageRef: '388.1',
    chapterNumber: 42,
    chapterTitle: 'Chapter 41—The Light of Life',
    paragraphText: "For God so loved the world, that He gave His only-begotten Son. He gave Him not only to live among men, to bear their sins, and die their sacrifice. He gave Him to the fallen race. Christ was to identify Himself with the interests and needs of humanity. He who was one with God has linked Himself with the children of men by ties that are never to be broken. Jesus is 'not ashamed to call them brethren;' He is our Sacrifice, our Advocate, our Brother, bearing our human form before the Father's throne, and through eternal ages one with the race He has redeemed—the Son of man. And all this that man might be uplifted from the ruin and degradation of sin that he might reflect the love of God and share the joy of holiness.",
    targetVerses: ['John 3:16', '1 John 4:9', 'Romans 8:32', 'Hebrews 2:11'],
  },
  {
    id: 'sc-9-1',
    sourceBook: 'Steps to Christ',
    sourceAbbrev: 'SC',
    year: 1892,
    pageRef: '9.1',
    chapterNumber: 4,
    chapterTitle: "Chapter 1—God's Love for Man",
    paragraphText: "Nature and revelation alike testify of God's love. Our Father in heaven is the source of life, of wisdom, and of joy. Look at the wonderful and beautiful things of nature. Think of their marvelous adaptation to the needs and happiness, not only of man, but of all living creatures. The sunshine and the rain, that gladden and refresh the earth, the hills and seas and plains, all speak to us of the Creator's love. It is God who supplies the daily wants of all His creatures. In the beautiful words of the psalmist, 'The eyes of all wait upon Thee; and Thou givest them their meat in due season. Thou openest Thine hand, and satisfiest the desire of every living thing.'",
    targetVerses: ['1 John 4:8', 'Psalm 145:9', 'Psalm 145:15', 'Psalm 145:16', 'Psalm 19:1'],
  },
  {
    id: 'sc-13-2',
    sourceBook: 'Steps to Christ',
    sourceAbbrev: 'SC',
    year: 1892,
    pageRef: '13.2',
    chapterNumber: 4,
    chapterTitle: "Chapter 1—God's Love for Man",
    paragraphText: "The sinner may resist this love, he may refuse to be drawn to Christ; but if he does not resist he will be drawn to Jesus; a knowledge of the plan of salvation will lead him to the foot of the cross in repentance for his sins, which have caused the sufferings of the dear Son of God. The same divine mind that is working upon the things of nature is speaking to the hearts of men and creating an inexpressible craving for something they have not. The things of the world cannot satisfy their longing. The Spirit of God is pleading with them to seek for those things that alone can give peace and rest—the grace of Christ, the joy of holiness.",
    targetVerses: ['John 12:32', 'Romans 2:4', 'John 3:14', 'John 3:15', 'John 3:16'],
  },
  {
    id: 'pp-33-1',
    sourceBook: 'Patriarchs and Prophets',
    sourceAbbrev: 'PP',
    year: 1890,
    pageRef: '33.1',
    chapterNumber: 3,
    chapterTitle: 'Chapter 1—Why was Sin Permitted?',
    paragraphText: "'God is love.' His nature, His law, is love. It ever has been; it ever will be. 'The high and lofty One that inhabiteth eternity,' whose 'ways are everlasting,' changeth not. With Him 'is no variableness, neither shadow of turning.' Every manifestation of creative power is an expression of infinite love. The sovereignty of God involves fullness of blessing to all created beings.",
    targetVerses: ['1 John 4:8', '1 John 4:16', 'Isaiah 57:15', 'James 1:17', 'Malachi 3:6'],
  },
  {
    id: 'gc-17-1',
    sourceBook: 'The Great Controversy',
    sourceAbbrev: 'GC',
    year: 1888,
    pageRef: '17.1',
    chapterNumber: 3,
    chapterTitle: 'Chapter 1—The Destruction of Jerusalem',
    paragraphText: "From the crest of Olivet, Jesus looked upon Jerusalem. Fair and peaceful was the scene spread out before Him. It was the feast of the Passover, and the children of Jacob had gathered from all lands to celebrate the great national festival. ... But other thoughts now occupied the mind of Jesus. 'When He was come near, He beheld the city, and wept over it.' Amid the universal rejoicing of the triumphal entry, while palm branches waved, while glad hosannas awoke the echoes of the hills, and thousands of voices declared Him king, the world's Redeemer was moved to sudden and mysterious grief. He, the Son of God, the Promised One of Israel, whose power had conquered death and called its prisoners from the grave, was in tears, not of ordinary sorrow, but of intense, irrepressible agony.",
    targetVerses: ['Luke 19:41', 'Luke 19:42', 'Matthew 23:37', 'Matthew 24:1', 'Matthew 24:2'],
  },
  {
    id: 'gc-678-1',
    sourceBook: 'The Great Controversy',
    sourceAbbrev: 'GC',
    year: 1888,
    pageRef: '678.1',
    chapterNumber: 44,
    chapterTitle: 'Chapter 42—The Controversy Ended',
    paragraphText: "The great controversy is ended. Sin and sinners are no more. The entire universe is clean. One pulse of harmony and gladness beats through the vast creation. From Him who created all, flow life and light and gladness, throughout the realms of illimitable space. From the minutest atom to the greatest world, all things, animate and inanimate, in their unshadowed beauty and perfect joy, declare that God is love.",
    targetVerses: ['Revelation 21:1', 'Revelation 21:3', 'Revelation 21:4', 'Revelation 22:3', '1 John 4:8'],
  },
];

/**
 * In-memory cache for master reverse verse index and full book JSONs.
 */
let memoryVerseIndex: Record<string, EgwComment[]> | null = null;
const memoryBookCache = new Map<string, any>();

function normalizeRef(ref: string): string {
  return ref.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Asynchronously loads the master verse index from IndexedDB or static JSON.
 */
export async function loadMasterVerseIndex(): Promise<Record<string, EgwComment[]>> {
  if (memoryVerseIndex) return memoryVerseIndex;

  // 1. Try IndexedDB
  try {
    const fromDb = await getEgwVerseIndexOffline();
    if (fromDb && Object.keys(fromDb).length > 0) {
      memoryVerseIndex = fromDb as Record<string, EgwComment[]>;
      return memoryVerseIndex;
    }
  } catch (err) {
    console.warn('[EGW] Could not load verse index from IndexedDB:', err);
  }

  // 2. Fetch static JSON
  try {
    const base = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    const resp = await fetch(`${base}egw/egw_verse_index.json`);
    if (resp.ok) {
      const data = await resp.json();
      memoryVerseIndex = data;
      // Persist in background to IndexedDB
      saveEgwVerseIndexOffline(data).catch(() => {});
      return memoryVerseIndex!;
    }
  } catch (err) {
    console.warn('[EGW] Could not fetch static egw_verse_index.json:', err);
  }

  // Fallback to SAMPLE_EGW_COMMENTS converted to dictionary
  const fallback: Record<string, EgwComment[]> = {};
  for (const comment of SAMPLE_EGW_COMMENTS) {
    for (const v of comment.targetVerses) {
      if (!fallback[v]) fallback[v] = [];
      fallback[v].push(comment);
    }
  }
  memoryVerseIndex = fallback;
  return fallback;
}

/**
 * Returns EGW commentary paragraphs for a scripture reference.
 * Synchronous version checks in-memory cache then falls back to SAMPLE_EGW_COMMENTS.
 */
export function getEgwCommentsForVerse(reference: string): EgwComment[] {
  const norm = normalizeRef(reference);

  if (memoryVerseIndex) {
    // Find matching key case-insensitively
    for (const [key, comments] of Object.entries(memoryVerseIndex)) {
      if (normalizeRef(key) === norm) {
        return comments;
      }
    }
  }

  // Fallback to built-in sample list
  return SAMPLE_EGW_COMMENTS.filter((c) =>
    c.targetVerses.some((v) => normalizeRef(v) === norm)
  );
}

/**
 * Book abbreviation mapping to local file code
 */
const ABBREV_TO_FILE: Record<string, string> = {
  pp: 'pp',
  pk: 'pk',
  da: 'da',
  aa: 'aa',
  gc: 'gc',
  sc: 'sc',
  col: 'col',
  mb: 'mb',
  ed: 'ed',
  mh: 'mh',
  ew: 'ew',
  gw: 'gw',
  tm: 'tm',
  ls: 'ls',
  '1t': '1t',
  '2t': '2t',
  '3t': '3t',
  '4t': '4t',
  '5t': '5t',
  '6t': '6t',
  '7t': '7t',
  '8t': '8t',
  '9t': '9t',
  myp: 'myp',
  ah: 'ah',
  cg: 'cg',
  cd: 'cd',
  cs: 'cs',
  ev: 'ev',
  chs: 'chs',
  fe: 'fe',
  te: 'te',
  wm: 'wm',
  lp: 'lp',
  sl: 'sl',
  '1sm': '1sm',
  '2sm': '2sm',
  '3sm': '3sm',
  ct: 'ct',
  ch: 'ch',
  cw: 'cw',
  mm: 'mm',
  '1mcp': '1mcp',
  '2mcp': '2mcp',
  sr: 'sr',
  pr: 'pr',
  pam: 'pam',
  cm: 'cm',
  cl: 'cl',
  pm: 'pm',
  '1sg': '1sg',
  '2sg': '2sg',
  '3sg': '3sg',
  '4asg': '4asg',
  '4bsg': '4bsg',
  csa: 'csa',
  '1sp': '1sp',
  '2sp': '2sp',
  '3sp': '3sp',
  '4sp': '4sp',
  sj: 'sj',
};

/**
 * Fetches and caches full book data for reading full chapters.
 */
export async function loadEgwBook(bookAbbrev: string): Promise<any | null> {
  const code = ABBREV_TO_FILE[bookAbbrev.toLowerCase()];
  if (!code) return null;

  if (memoryBookCache.has(code)) {
    return memoryBookCache.get(code);
  }

  // 1. Try IndexedDB
  try {
    const offlineBook = await getEgwBookOffline(code);
    if (offlineBook) {
      memoryBookCache.set(code, offlineBook);
      return offlineBook;
    }
  } catch (err) {
    console.warn(`[EGW] Could not load book ${code} from IndexedDB:`, err);
  }

  // 2. Fetch from static JSON in public/egw/books/
  try {
    const base = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    const resp = await fetch(`${base}egw/books/${code}.json`);
    if (resp.ok) {
      const bookData = await resp.json();
      memoryBookCache.set(code, bookData);
      saveEgwBookOffline(bookData).catch(() => {});
      return bookData;
    }
  } catch (err) {
    console.warn(`[EGW] Could not fetch book ${code}.json:`, err);
  }

  return null;
}

/**
 * Retrieves full chapter text data for any EGW book chapter.
 */
export async function getEgwChapterAsync(
  bookAbbrev: string,
  chapterNumber: number
): Promise<EgwChapterData | null> {
  const bookData = await loadEgwBook(bookAbbrev);
  if (!bookData || !Array.isArray(bookData.chapters)) {
    // Fallback to synchronous mock chapter lookup
    return getEgwChapter(bookAbbrev, chapterNumber);
  }

  const chapter = bookData.chapters.find(
    (c: any) => c.chapterNumber === chapterNumber
  );

  if (!chapter) {
    return getEgwChapter(bookAbbrev, chapterNumber);
  }

  return {
    bookTitle: bookData.title || bookAbbrev,
    bookAbbrev: bookData.abbrev || bookAbbrev,
    chapterNumber: chapter.chapterNumber,
    chapterTitle: chapter.chapterTitle,
    prevChapter: chapter.prevChapter,
    nextChapter: chapter.nextChapter,
    paragraphs: chapter.paragraphs.map((p: any) => ({
      pageRef: p.pageRef,
      text: p.text,
    })),
  };
}

/**
 * Synchronous getEgwChapter: Checks memory book cache or built-in sample chapters.
 */
export function getEgwChapter(
  bookAbbrev: string,
  chapterNumber: number
): EgwChapterData | null {
  const code = ABBREV_TO_FILE[bookAbbrev.toLowerCase()];
  if (code && memoryBookCache.has(code)) {
    const bookData = memoryBookCache.get(code);
    const chapter = bookData.chapters?.find(
      (c: any) => c.chapterNumber === chapterNumber
    );
    if (chapter) {
      return {
        bookTitle: bookData.title || bookAbbrev,
        bookAbbrev: bookData.abbrev || bookAbbrev,
        chapterNumber: chapter.chapterNumber,
        chapterTitle: chapter.chapterTitle,
        prevChapter: chapter.prevChapter,
        nextChapter: chapter.nextChapter,
        paragraphs: chapter.paragraphs.map((p: any) => ({
          pageRef: p.pageRef,
          text: p.text,
        })),
      };
    }
  }

  // Built-in sample fallback for quick rendering before dynamic load
  const key = `${bookAbbrev.toUpperCase()}-${chapterNumber}`;
  return SAMPLE_EGW_CHAPTERS[key] || null;
}

/**
 * Built-in sample chapter store (fallback for 8T and initial mock chapters)
 */
export const SAMPLE_EGW_CHAPTERS: Record<string, EgwChapterData> = {
  '8T-42': {
    bookTitle: 'Testimonies for the Church, Vol. 8',
    bookAbbrev: '8T',
    chapterNumber: 42,
    chapterTitle: 'God in Nature',
    prevChapter: { number: 41, title: 'The True Higher Education' },
    nextChapter: { number: 43, title: 'A Personal God' },
    paragraphs: [
      {
        pageRef: '255.1',
        text: 'Nature is a power, but the God of nature is unlimited in power. His works interpret His character. Those who judge of Him from His handiworks, and not from the suppositions of great men, will see His presence in everything.',
      },
      {
        pageRef: '258.4',
        text: 'The theory that God did not create matter when He brought the world into existence is without foundation. In the formation of our world, God was not indebted to pre-existing matter. On the contrary, all things, material or spiritual, stood up before the Lord Jehovah at His voice and were created for His own purpose. The heavens and all the host of them, the earth and all things therein, are not only the work of His hand; they came into existence by the breath of His mouth.',
      },
    ],
  },
};
