import type { EgwComment } from '../types/egw';

/**
 * Standard public-domain sample EGW commentary excerpts for prominent Bible passages.
 * As complete public-domain indexes are absorbed, this provides instant real-time notes.
 */
export const SAMPLE_EGW_COMMENTS: EgwComment[] = [
  {
    id: 'da-19-1',
    sourceBook: 'The Desire of Ages',
    sourceAbbrev: 'DA',
    year: 1898,
    pageRef: 'p. 19.1',
    chapterTitle: 'God With Us',
    text: "His name shall be called Immanuel, ... God with us. The light of the knowledge of the glory of God is seen in the face of Jesus Christ. From the days of eternity the Lord Jesus Christ was one with the Father; He was 'the image of God,' the image of His greatness and majesty, 'the outshining of His glory.'",
    targetVerses: ['Matthew 1:23', 'John 1:1', 'John 1:14', 'Hebrews 1:3', '2 Corinthians 4:6']
  },
  {
    id: 'da-25-3',
    sourceBook: 'The Desire of Ages',
    sourceAbbrev: 'DA',
    year: 1898,
    pageRef: 'p. 25.3',
    chapterTitle: 'God With Us',
    text: "By His life and His death, Christ has achieved even more than recovery from the ruin wrought through sin. It was Satan's purpose to bring about an eternal separation between God and man; but in Christ we become more closely united to God than if we had never fallen.",
    targetVerses: ['Romans 5:20', 'Romans 8:38', 'Romans 8:39', 'John 3:16']
  },
  {
    id: 'da-388-1',
    sourceBook: 'The Desire of Ages',
    sourceAbbrev: 'DA',
    year: 1898,
    pageRef: 'p. 388.1',
    chapterTitle: 'The Light of Life',
    text: "For God so loved the world, that He gave His only-begotten Son. He gave Him not only to live among men, to bear their sins, and die their sacrifice. He gave Him to the fallen race. Christ was to identify Himself with the interests and needs of humanity.",
    targetVerses: ['John 3:16', '1 John 4:9', 'Romans 8:32']
  },
  {
    id: 'sc-9-1',
    sourceBook: 'Steps to Christ',
    sourceAbbrev: 'SC',
    year: 1892,
    pageRef: 'p. 9.1',
    chapterTitle: "God's Love for Man",
    text: "Nature and revelation alike testify of God's love. Our Father in heaven is the source of life, of wisdom, and of joy. Look at the wonderful and beautiful things of nature. Think of their marvelous adaptation to the needs and happiness, not only of man, but of all living creatures.",
    targetVerses: ['1 John 4:8', 'Psalm 145:9', 'Psalm 19:1']
  },
  {
    id: 'sc-13-2',
    sourceBook: 'Steps to Christ',
    sourceAbbrev: 'SC',
    year: 1892,
    pageRef: 'p. 13.2',
    chapterTitle: "God's Love for Man",
    text: "The sinner may resist this love, he may refuse to be drawn to Christ; but if he does not resist he will be drawn to Jesus; a knowledge of the plan of salvation will lead him to the foot of the cross in repentance for his sins, which have caused the sufferings of the dear Son of God.",
    targetVerses: ['John 12:32', 'Romans 2:4', 'John 3:14', 'John 3:15', 'John 3:16']
  },
  {
    id: 'pp-33-1',
    sourceBook: 'Patriarchs and Prophets',
    sourceAbbrev: 'PP',
    year: 1890,
    pageRef: 'p. 33.1',
    chapterTitle: 'Why was Sin Permitted?',
    text: "'God is love.' His nature, His law, is love. It ever has been; it ever will be. 'The high and lofty One that inhabiteth eternity,' whose 'ways are everlasting,' changeth not. With Him 'is no variableness, neither shadow of turning.'",
    targetVerses: ['1 John 4:8', '1 John 4:16', 'Isaiah 57:15', 'James 1:17', 'Malachi 3:6']
  },
  {
    id: 'pp-44-1',
    sourceBook: 'Patriarchs and Prophets',
    sourceAbbrev: 'PP',
    year: 1890,
    pageRef: 'p. 44.1',
    chapterTitle: 'The Creation',
    text: "In the creation of the earth, God was not dependent upon pre-existing matter. 'He spake, and it was done; He commanded, and it stood fast.' All things, material or spiritual, stood up before the Lord Jehovah at His voice and were created for His own purpose.",
    targetVerses: ['Genesis 1:1', 'Genesis 1:2', 'Genesis 1:3', 'Psalm 33:6', 'Psalm 33:9', 'Hebrews 11:3']
  },
  {
    id: 'gc-17-1',
    sourceBook: 'The Great Controversy',
    sourceAbbrev: 'GC',
    year: 1888,
    pageRef: 'p. 17.1',
    chapterTitle: 'The Destruction of Jerusalem',
    text: "From the crest of Olivet, Jesus looked upon Jerusalem. Fair and peaceful was the scene spread out before Him. ... But other thoughts now occupied the mind of Jesus. 'When He was come near, He beheld the city, and wept over it.'",
    targetVerses: ['Luke 19:41', 'Luke 19:42', 'Matthew 23:37', 'Matthew 24:1', 'Matthew 24:2']
  },
  {
    id: 'gc-678-1',
    sourceBook: 'The Great Controversy',
    sourceAbbrev: 'GC',
    year: 1888,
    pageRef: 'p. 678.1',
    chapterTitle: 'The Controversy Ended',
    text: "The great controversy is ended. Sin and sinners are no more. The entire universe is clean. One pulse of harmony and gladness beats through the vast creation. From Him who created all, flow life and light and gladness, throughout the realms of illimitable space. From the minutest atom to the greatest world, all things, animate and inanimate, in their unshadowed beauty and perfect joy, declare that God is love.",
    targetVerses: ['Revelation 21:1', 'Revelation 21:3', 'Revelation 21:4', 'Revelation 22:3', '1 John 4:8']
  }
];

/**
 * Normalizes reference strings like "John 3:16" or "1 John 4:8"
 */
function normalizeRef(ref: string): string {
  return ref.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Finds all EGW comments for a specific verse reference (e.g., "John 3:16").
 */
export function getEgwCommentsForVerse(reference: string): EgwComment[] {
  const norm = normalizeRef(reference);
  return SAMPLE_EGW_COMMENTS.filter((c) =>
    c.targetVerses.some((v) => normalizeRef(v) === norm)
  );
}
