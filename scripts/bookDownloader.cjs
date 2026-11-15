const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function cleanHtml(html) {
  return html
    .replace(/<span class="egw_refcode"[\s\S]*?<\/span>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

// Common Bible books regex for extracting cited verses from paragraph text
const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalm', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
  'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

const BIBLE_REF_REGEX = new RegExp(`\\b(${BIBLE_BOOKS.join('|')})\\s+(\\d+):(\\d+)`, 'gi');

function extractTargetVerses(text) {
  const matches = new Set();
  let m;
  while ((m = BIBLE_REF_REGEX.exec(text)) !== null) {
    const book = m[1].replace('Psalms', 'Psalm');
    matches.add(`${book} ${m[2]}:${m[3]}`);
  }
  return Array.from(matches);
}

/**
 * Downloads a single EGW book from m.egwwritings.org by its book ID
 */
async function downloadBook(bookMeta) {
  console.log(`\n📚 Downloading: ${bookMeta.title} (${bookMeta.abbrev}) [ID: ${bookMeta.id}]...`);
  const tocUrl = `https://m.egwwritings.org/en/book/${bookMeta.id}/toc`;
  const tocHtml = await fetchUrl(tocUrl);

  const tocRegex = /<li[^>]*><a[^>]*href="\/en\/book\/([^"]+)"[^>]*>([^<]+)<\/a><\/li>/g;
  const chapterLinks = [];
  let tMatch;
  while ((tMatch = tocRegex.exec(tocHtml)) !== null) {
    const pageParam = tMatch[1]; // e.g. "108.7"
    const rawTitle = cleanHtml(tMatch[2]);
    // Skip preface/contents if you only want chapters, or keep all
    chapterLinks.push({ pageParam, title: rawTitle });
  }

  console.log(`Found ${chapterLinks.length} sections/chapters in Table of Contents.`);

  const bookData = {
    id: bookMeta.code,
    title: bookMeta.title,
    abbrev: bookMeta.abbrev,
    year: bookMeta.year,
    chapters: []
  };

  const verseIndexEntries = [];

  for (let cIdx = 0; cIdx < chapterLinks.length; cIdx++) {
    const cLink = chapterLinks[cIdx];
    const chapterNumber = cIdx + 1;
    const url = `https://m.egwwritings.org/en/book/${cLink.pageParam}`;
    process.stdout.write(`  [${chapterNumber}/${chapterLinks.length}] ${cLink.title.slice(0, 30)}... `);

    try {
      const pageHtml = await fetchUrl(url);
      const paraRegex = /<p[^>]*class="[^"]*egw_content_wrapper[^"]*"[^>]*data-refcode="([A-Za-z0-9]+)\s+([^"]+)"[^>]*>([\s\S]*?)<\/p>/gi;
      const paragraphs = [];
      let pMatch;

      while ((pMatch = paraRegex.exec(pageHtml)) !== null) {
        const pageRef = pMatch[2].trim();
        const text = cleanHtml(pMatch[3]);
        if (text.length > 10) {
          const targetVerses = extractTargetVerses(text);
          paragraphs.push({
            pageRef,
            text,
            targetVerses
          });

          // Add to verse index entries
          for (const vRef of targetVerses) {
            verseIndexEntries.push({
              verse: vRef,
              comment: {
                id: `${bookMeta.code}-${pageRef.replace('.', '-')}`,
                sourceBook: bookMeta.title,
                sourceAbbrev: bookMeta.abbrev,
                year: bookMeta.year,
                pageRef,
                chapterNumber,
                chapterTitle: cLink.title,
                paragraphText: text,
                targetVerses
              }
            });
          }
        }
      }

      const prevChapter = cIdx > 0 ? { number: cIdx, title: chapterLinks[cIdx - 1].title } : undefined;
      const nextChapter = cIdx < chapterLinks.length - 1 ? { number: cIdx + 2, title: chapterLinks[cIdx + 1].title } : undefined;

      bookData.chapters.push({
        chapterNumber,
        chapterTitle: cLink.title,
        prevChapter,
        nextChapter,
        paragraphs
      });

      console.log(`(${paragraphs.length} paras)`);
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
    }

    // Gentle delay to respect server
    await new Promise(r => setTimeout(r, 200));
  }

  // Save book JSON file
  const outPath = path.join(__dirname, '..', 'public', 'egw', 'books', `${bookMeta.code}.json`);
  fs.writeFileSync(outPath, JSON.stringify(bookData, null, 2), 'utf-8');
  console.log(`✅ Saved ${bookMeta.title} to: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);

  return verseIndexEntries;
}

module.exports = { downloadBook };

