import type { EgwComment, EgwChapterData } from '../types/egw';

/**
 * Standard public-domain EGW commentary paragraphs for prominent passages.
 * Contains FULL original paragraphs where the scripture is explicitly quoted or cited,
 * followed by standard citation reference codes:
 * [Book Abbr] [Page].[Paragraph] (e.g. Ed 134.2, COL 35.2, DA 388.1, GC 678.1).
 */
export const SAMPLE_EGW_COMMENTS: EgwComment[] = [
  {
    id: 'ed-134-2',
    sourceBook: 'Education',
    sourceAbbrev: 'Ed',
    year: 1903,
    pageRef: '134.2',
    chapterNumber: 14,
    chapterTitle: 'Science and the Bible',
    paragraphText: "'In the beginning God.' Genesis 1:1. Here alone can the mind in its eager questioning, fleeing as the dove to the ark, find rest. Above, beneath, beyond, abides Infinite Love, working out all things to accomplish 'the good pleasure of His goodness.' 2 Thessalonians 1:11.",
    targetVerses: ['Genesis 1:1', '2 Thessalonians 1:11']
  },
  {
    id: '8t-258-4',
    sourceBook: 'Testimonies for the Church, Vol. 8',
    sourceAbbrev: '8T',
    year: 1904,
    pageRef: '258.4',
    chapterNumber: 38,
    chapterTitle: 'God in Nature',
    paragraphText: "The theory that God did not create matter when He brought the world into existence is without foundation. In the formation of our world, God was not indebted to pre-existing matter. On the contrary, all things, material or spiritual, stood up before the Lord Jehovah at His voice and were created for His own purpose. The heavens and all the host of them, the earth and all things therein, are not only the work of His hand; they came into existence by the breath of His mouth.",
    targetVerses: ['Genesis 1:1', 'Psalm 33:6', 'Psalm 33:9', 'Hebrews 11:3']
  },
  {
    id: 'da-19-1',
    sourceBook: 'The Desire of Ages',
    sourceAbbrev: 'DA',
    year: 1898,
    pageRef: '19.1',
    chapterNumber: 1,
    chapterTitle: 'God With Us',
    paragraphText: "'His name shall be called Immanuel, ... God with us.' The light of the knowledge of the glory of God is seen 'in the face of Jesus Christ.' From the days of eternity the Lord Jesus Christ was one with the Father; He was 'the image of God,' the image of His greatness and majesty, 'the outshining of His glory.' It was to manifest this glory that He came to our world. To this sin-darkened earth He came to reveal the light of God's love,—to be 'God with us.' Therefore it was prophesieth of Him, 'His name shall be called Immanuel.'",
    targetVerses: ['Matthew 1:23', 'John 1:1', 'John 1:14', 'Hebrews 1:3', '2 Corinthians 4:6']
  },
  {
    id: 'da-25-3',
    sourceBook: 'The Desire of Ages',
    sourceAbbrev: 'DA',
    year: 1898,
    pageRef: '25.3',
    chapterNumber: 1,
    chapterTitle: 'God With Us',
    paragraphText: "By His life and His death, Christ has achieved even more than recovery from the ruin wrought through sin. It was Satan's purpose to bring about an eternal separation between God and man; but in Christ we become more closely united to God than if we had never fallen. In taking our nature, the Saviour has bound Himself to humanity by a tie that is never to be broken. Through the eternal ages He is linked with us. 'God so loved the world, that He gave His only-begotten Son.' He gave Him not only to bear our sins, and to die as our sacrifice; He gave Him to the fallen race. To assure us of His immutable counsel of peace, God gave His only-begotten Son to become one of the human family, for ever to retain His human nature.",
    targetVerses: ['Romans 5:20', 'Romans 8:38', 'Romans 8:39', 'John 3:16']
  },
  {
    id: 'col-35-2',
    sourceBook: "Christ's Object Lessons",
    sourceAbbrev: 'COL',
    year: 1900,
    pageRef: '35.2',
    chapterNumber: 2,
    chapterTitle: 'The Sower Went Forth to Sow',
    paragraphText: "The word of God is the seed. Every seed has in itself a germinating principle. In it the life of the plant is enfolded. So there is life in God's word. 'The words that I speak unto you,' said Christ, 'they are spirit, and they are life.' 'He that heareth My word, and believeth on Him that sent Me, hath everlasting life.' In every command and in every promise of the word of God is the power, the very life of God, by which the command may be fulfilled and the promise realized. He who by faith receives the word is receiving the very life and character of God.",
    targetVerses: ['Luke 8:11', 'John 6:63', 'John 5:24']
  },
  {
    id: 'da-388-1',
    sourceBook: 'The Desire of Ages',
    sourceAbbrev: 'DA',
    year: 1898,
    pageRef: '388.1',
    chapterNumber: 41,
    chapterTitle: 'The Light of Life',
    paragraphText: "For God so loved the world, that He gave His only-begotten Son. He gave Him not only to live among men, to bear their sins, and die their sacrifice. He gave Him to the fallen race. Christ was to identify Himself with the interests and needs of humanity. He who was one with God has linked Himself with the children of men by ties that are never to be broken. Jesus is 'not ashamed to call them brethren;' He is our Sacrifice, our Advocate, our Brother, bearing our human form before the Father's throne, and through eternal ages one with the race He has redeemed—the Son of man. And all this that man might be uplifted from the ruin and degradation of sin that he might reflect the love of God and share the joy of holiness.",
    targetVerses: ['John 3:16', '1 John 4:9', 'Romans 8:32', 'Hebrews 2:11']
  },
  {
    id: 'sc-9-1',
    sourceBook: 'Steps to Christ',
    sourceAbbrev: 'SC',
    year: 1892,
    pageRef: '9.1',
    chapterNumber: 1,
    chapterTitle: "God's Love for Man",
    paragraphText: "Nature and revelation alike testify of God's love. Our Father in heaven is the source of life, of wisdom, and of joy. Look at the wonderful and beautiful things of nature. Think of their marvelous adaptation to the needs and happiness, not only of man, but of all living creatures. The sunshine and the rain, that gladden and refresh the earth, the hills and seas and plains, all speak to us of the Creator's love. It is God who supplies the daily wants of all His creatures. In the beautiful words of the psalmist, 'The eyes of all wait upon Thee; and Thou givest them their meat in due season. Thou openest Thine hand, and satisfiest the desire of every living thing.'",
    targetVerses: ['1 John 4:8', 'Psalm 145:9', 'Psalm 145:15', 'Psalm 145:16', 'Psalm 19:1']
  },
  {
    id: 'sc-13-2',
    sourceBook: 'Steps to Christ',
    sourceAbbrev: 'SC',
    year: 1892,
    pageRef: '13.2',
    chapterNumber: 1,
    chapterTitle: "God's Love for Man",
    paragraphText: "The sinner may resist this love, he may refuse to be drawn to Christ; but if he does not resist he will be drawn to Jesus; a knowledge of the plan of salvation will lead him to the foot of the cross in repentance for his sins, which have caused the sufferings of the dear Son of God. The same divine mind that is working upon the things of nature is speaking to the hearts of men and creating an inexpressible craving for something they have not. The things of the world cannot satisfy their longing. The Spirit of God is pleading with them to seek for those things that alone can give peace and rest—the grace of Christ, the joy of holiness.",
    targetVerses: ['John 12:32', 'Romans 2:4', 'John 3:14', 'John 3:15', 'John 3:16']
  },
  {
    id: 'pp-33-1',
    sourceBook: 'Patriarchs and Prophets',
    sourceAbbrev: 'PP',
    year: 1890,
    pageRef: '33.1',
    chapterNumber: 1,
    chapterTitle: 'Why was Sin Permitted?',
    paragraphText: "'God is love.' His nature, His law, is love. It ever has been; it ever will be. 'The high and lofty One that inhabiteth eternity,' whose 'ways are everlasting,' changeth not. With Him 'is no variableness, neither shadow of turning.' Every manifestation of creative power is an expression of infinite love. The sovereignty of God involves fullness of blessing to all created beings.",
    targetVerses: ['1 John 4:8', '1 John 4:16', 'Isaiah 57:15', 'James 1:17', 'Malachi 3:6']
  },
  {
    id: 'gc-17-1',
    sourceBook: 'The Great Controversy',
    sourceAbbrev: 'GC',
    year: 1888,
    pageRef: '17.1',
    chapterNumber: 1,
    chapterTitle: 'The Destruction of Jerusalem',
    paragraphText: "From the crest of Olivet, Jesus looked upon Jerusalem. Fair and peaceful was the scene spread out before Him. It was the feast of the Passover, and the children of Jacob had gathered from all lands to celebrate the great national festival. ... But other thoughts now occupied the mind of Jesus. 'When He was come near, He beheld the city, and wept over it.' Amid the universal rejoicing of the triumphal entry, while palm branches waved, while glad hosannas awoke the echoes of the hills, and thousands of voices declared Him king, the world's Redeemer was moved to sudden and mysterious grief. He, the Son of God, the Promised One of Israel, whose power had conquered death and called its prisoners from the grave, was in tears, not of ordinary sorrow, but of intense, irrepressible agony.",
    targetVerses: ['Luke 19:41', 'Luke 19:42', 'Matthew 23:37', 'Matthew 24:1', 'Matthew 24:2']
  },
  {
    id: 'gc-678-1',
    sourceBook: 'The Great Controversy',
    sourceAbbrev: 'GC',
    year: 1888,
    pageRef: '678.1',
    chapterNumber: 42,
    chapterTitle: 'The Controversy Ended',
    paragraphText: "The great controversy is ended. Sin and sinners are no more. The entire universe is clean. One pulse of harmony and gladness beats through the vast creation. From Him who created all, flow life and light and gladness, throughout the realms of illimitable space. From the minutest atom to the greatest world, all things, animate and inanimate, in their unshadowed beauty and perfect joy, declare that God is love.",
    targetVerses: ['Revelation 21:1', 'Revelation 21:3', 'Revelation 21:4', 'Revelation 22:3', '1 John 4:8']
  }
];

/**
 * Full chapter text store for opening quotes into full book chapters.
 */
export const SAMPLE_EGW_CHAPTERS: Record<string, EgwChapterData> = {
  'DA-1': {
    bookTitle: 'The Desire of Ages',
    bookAbbrev: 'DA',
    chapterNumber: 1,
    chapterTitle: 'God With Us',
    prevChapter: undefined,
    nextChapter: { number: 2, title: 'The Chosen People' },
    paragraphs: [
      {
        pageRef: '19.1',
        text: "“His name shall be called Immanuel, . . . God with us.” “The light of the knowledge of the glory of God” is seen “in the face of Jesus Christ.” From the days of eternity the Lord Jesus Christ was one with the Father; He was “the image of God,” the image of His greatness and majesty, “the outshining of His glory.” It was to manifest this glory that He came to our world. To this sin-darkened earth He came to reveal the light of God’s love,—to be “God with us.” Therefore it was prophesied of Him, “His name shall be called Immanuel.”"
      },
      {
        pageRef: '19.2',
        text: "By coming to dwell with us, Jesus was to reveal God both to men and to angels. He was the Word of God,—God’s thought made audible. In His prayer for His disciples He says, “I have declared unto them Thy name,”—“that the love wherewith Thou hast loved Me may be in them, and I in them.” But not alone for His earthborn children was this revelation given. Our little world is the lesson book of the universe. God’s wonderful purpose of grace, the mystery of redeeming love, is the theme into which “angels desire to look,” and it will be their study throughout endless ages. Both the redeemed and the unfallen beings will find in the cross of Christ their science and their song. It will be seen that the glory shining in the face of Jesus is the glory of self-sacrificing love."
      },
      {
        pageRef: '20.1',
        text: "In the beginning, God was revealed in all the works of creation. It was Christ that spread the heavens, and laid the foundations of the earth. It was His hand that hung the worlds in space, and fashioned the flowers of the field. “His strength setteth fast the mountains.” “The sea is His, and He made it.” Psalm 65:6; 95:5. It was He that filled the earth with beauty, and the air with song. And upon all things in earth, and air, and sky, He wrote the message of the Father’s love."
      },
      {
        pageRef: '20.2',
        text: "The angels of glory find their joy in giving,—giving love and tireless watchcare to souls that are fallen and unholy. Heavenly beings woo the hearts of men; they bring to this dark world light from the courts above; by gentle and patient ministry they move upon the human spirit, to bring the lost into a fellowship with Christ which is even closer than they themselves can know."
      },
      {
        pageRef: '21.1',
        text: "But turning from all lesser representations, we behold God in Jesus. Looking unto Jesus we see that it is the glory of our God to give. “I do nothing of Myself,” said Christ; “the living Father hath sent Me, and I live by the Father.” “I seek not Mine own glory,” but the glory of Him that sent Me. John 8:28; 6:57; 8:50; 7:18. In these words is set forth the great principle which is the law of life for the universe."
      },
      {
        pageRef: '22.1',
        text: "The plan for our redemption was not an afterthought, a plan formulated after the fall of Adam. It was a revelation of “the mystery which hath been kept in silence through times eternal.” Romans 16:25, R.V. It was an unfolding of the principles that from eternal ages have been the foundation of God’s throne. From the beginning, God and Christ knew of the apostasy of Satan, and of the fall of man through the deceptive power of the apostate."
      },
      {
        pageRef: '25.3',
        text: "By His life and His death, Christ has achieved even more than recovery from the ruin wrought through sin. It was Satan’s purpose to bring about an eternal separation between God and man; but in Christ we become more closely united to God than if we had never fallen. In taking our nature, the Saviour has bound Himself to humanity by a tie that is never to be broken. Through the eternal ages He is linked with us. “God so loved the world, that He gave His only-begotten Son.” He gave Him not only to bear our sins, and to die as our sacrifice; He gave Him to the fallen race. To assure us of His immutable counsel of peace, God gave His only-begotten Son to become one of the human family, for ever to retain His human nature."
      },
      {
        pageRef: '26.1',
        text: "Of His people God says, “They shall be as the stones of a crown, lifted up as an ensign upon His land. For how great is His goodness, and how great is His beauty!” Zechariah 9:16, 17. The exaltation of the redeemed will be an eternal testimony to God’s mercy. “In the ages to come,” He will “show the exceeding riches of His grace in His kindness toward us through Christ Jesus.” Ephesians 2:7."
      },
      {
        pageRef: '26.2',
        text: "Through Christ’s redeeming work the government of God stands justified. The Omnipotent One is made known as the God of love. Satan’s charges are refuted, and his character unveiled. Rebellion can never again arise. Sin can never again enter the universe. Through eternal ages all are secure from apostasy. By love’s self-sacrifice, the inhabitants of earth and heaven are bound to their Creator in bonds of indissoluble union."
      }
    ]
  },
  'DA-2': {
    bookTitle: 'The Desire of Ages',
    bookAbbrev: 'DA',
    chapterNumber: 2,
    chapterTitle: 'The Chosen People',
    prevChapter: { number: 1, title: 'God With Us' },
    nextChapter: { number: 3, title: '“The Fulness of the Time”' },
    paragraphs: [
      {
        pageRef: '27.1',
        text: "For more than a thousand years the Jewish people had awaited the Saviour’s coming. Upon this event their brightest hopes had rested. In song and prophecy, in temple rite and household prayer, His name was enshrined. And yet at His coming they knew Him not. The Beloved of heaven was to them “as a root out of a dry ground;” He had “no form nor comeliness;” and they saw in Him no beauty that they should desire Him. Isaiah 53:2."
      },
      {
        pageRef: '27.2',
        text: "God had chosen Israel. He had called them to preserve among men the knowledge of His law, and of the symbols and prophecies that pointed to the Saviour. He desired them to be as wells of salvation to the world. What Abraham was in the land of his sojourn, what Joseph was in Egypt, and Daniel in the courts of Babylon, the Hebrew people were to be among the nations."
      }
    ]
  },
  'Ed-14': {
    bookTitle: 'Education',
    bookAbbrev: 'Ed',
    chapterNumber: 14,
    chapterTitle: 'Science and the Bible',
    prevChapter: { number: 13, title: 'Other Object Lessons' },
    nextChapter: { number: 15, title: 'Business Principles and Methods' },
    paragraphs: [
      {
        pageRef: '128.1',
        text: "“Who knoweth not in all these that the hand of the Lord hath wrought?” Job 12:9. Since the book of nature and the book of revelation bear the impress of the same master mind, they cannot but speak in harmony. By different methods, and in different languages, they witness to the same great truths."
      },
      {
        pageRef: '128.2',
        text: "Science is ever discovering new wonders; but she brings from her research nothing that, rightly understood, conflicts with divine revelation. The book of nature and the written word shed light upon each other. They make us acquainted with God by teaching us something of the laws through which He works."
      },
      {
        pageRef: '134.1',
        text: "The deepest students of science are constrained to recognize in nature the working of infinite power. But to man’s unaided reason, nature’s teaching cannot but be contradictory and disappointing. Only in the light of revelation can it be read aright. “Through faith we understand.” Hebrews 11:3."
      },
      {
        pageRef: '134.2',
        text: "“In the beginning God.” Genesis 1:1. Here alone can the mind in its eager questioning, fleeing as the dove to the ark, find rest. Above, beneath, beyond, abides Infinite Love, working out all things to accomplish “the good pleasure of His goodness.” 2 Thessalonians 1:11."
      }
    ]
  },
  'Ed-13': {
    bookTitle: 'Education',
    bookAbbrev: 'Ed',
    chapterNumber: 13,
    chapterTitle: 'Other Object Lessons',
    prevChapter: undefined,
    nextChapter: { number: 14, title: 'Science and the Bible' },
    paragraphs: [
      {
        pageRef: '117.1',
        text: "God’s healing power runs all through nature. If a tree is cut, if a human being is wounded or breaks a bone, nature begins at once to repair the injury. Even before the need exists, the healing agencies are in readiness; and as soon as every part is wounded, every energy is bent to the work of restoration."
      }
    ]
  },
  'Ed-15': {
    bookTitle: 'Education',
    bookAbbrev: 'Ed',
    chapterNumber: 15,
    chapterTitle: 'Business Principles and Methods',
    prevChapter: { number: 14, title: 'Science and the Bible' },
    nextChapter: undefined,
    paragraphs: [
      {
        pageRef: '135.1',
        text: "There is no branch of legitimate business for which the Bible does not afford an essential preparation. Its principles of diligence, honesty, thrift, temperance, and purity are the secret of true success."
      }
    ]
  },
  'COL-2': {
    bookTitle: "Christ's Object Lessons",
    bookAbbrev: 'COL',
    chapterNumber: 2,
    chapterTitle: 'The Sower Went Forth to Sow',
    prevChapter: { number: 1, title: 'Teaching in Parables' },
    nextChapter: { number: 3, title: 'First the Blade, Then the Ear' },
    paragraphs: [
      {
        pageRef: '33.1',
        text: "By the parable of the sower, Christ illustrates the things of the kingdom of heaven, and the work of the great Husbandman for His people. Like a sower in the field, He came to scatter the heavenly grain of truth."
      },
      {
        pageRef: '35.2',
        text: "The word of God is the seed. Every seed has in itself a germinating principle. In it the life of the plant is enfolded. So there is life in God's word. 'The words that I speak unto you,' said Christ, 'they are spirit, and they are life.' 'He that heareth My word, and believeth on Him that sent Me, hath everlasting life.' In every command and in every promise of the word of God is the power, the very life of God, by which the command may be fulfilled and the promise realized. He who by faith receives the word is receiving the very life and character of God."
      }
    ]
  }
};

function normalizeRef(ref: string): string {
  return ref.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getEgwCommentsForVerse(reference: string): EgwComment[] {
  const norm = normalizeRef(reference);
  return SAMPLE_EGW_COMMENTS.filter((c) =>
    c.targetVerses.some((v) => normalizeRef(v) === norm)
  );
}

export function getEgwChapter(bookAbbrev: string, chapterNumber: number): EgwChapterData | null {
  const key = `${bookAbbrev.toUpperCase()}-${chapterNumber}`;
  return SAMPLE_EGW_CHAPTERS[key] || null;
}
