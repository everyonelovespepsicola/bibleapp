const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      // Follow 301 / 302 redirects automatically
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = `https://m.egwwritings.org${redirectUrl}`;
        }
        return resolve(fetchUrl(redirectUrl));
      }
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

async function crawlBookSequential(bookMeta) {
  console.log(`\n📚 Crawling Full Book: ${bookMeta.title} (${bookMeta.abbrev}) [ID: ${bookMeta.id}]...`);
  
  let currentUrl = `https://m.egwwritings.org/en/book/${bookMeta.id}.0`;
  const visited = new Set();
  const bookData = {
    id: bookMeta.code,
    title: bookMeta.title,
    abbrev: bookMeta.abbrev,
    year: bookMeta.year,
    chapters: []
  };

  const verseIndexEntries = [];
  let chapterIndex = 0;

  while (currentUrl && !visited.has(currentUrl)) {
    visited.add(currentUrl);
    const html = await fetchUrl(currentUrl);

    // Extract Chapter Title
    const headerMatch = html.match(/<h[123][^>]*class="[^"]*egw_content_wrapper[^"]*"[^>]*>([\s\S]*?)<\/h[123]>/i);
    let chapterTitle = headerMatch ? cleanHtml(headerMatch[1]) : `Section ${chapterIndex + 1}`;

    const paraRegex = /<p[^>]*class="[^"]*egw_content_wrapper[^"]*"[^>]*data-refcode="([A-Za-z0-9]+)\s+([^"]+)"[^>]*>([\s\S]*?)<\/p>/gi;
    const paragraphs = [];
    let pMatch;

    while ((pMatch = paraRegex.exec(html)) !== null) {
      const pageRef = pMatch[2].trim();
      const text = cleanHtml(pMatch[3]);
      if (text.length > 10) {
        const targetVerses = extractTargetVerses(text);
        paragraphs.push({
          pageRef,
          text,
          targetVerses
        });

        for (const vRef of targetVerses) {
          verseIndexEntries.push({
            verse: vRef,
            comment: {
              id: `${bookMeta.code}-${pageRef.replace('.', '-')}`,
              sourceBook: bookMeta.title,
              sourceAbbrev: bookMeta.abbrev,
              year: bookMeta.year,
              pageRef,
              chapterNumber: chapterIndex + 1,
              chapterTitle,
              paragraphText: text,
              targetVerses
            }
          });
        }
      }
    }

    if (paragraphs.length > 0) {
      chapterIndex++;
      bookData.chapters.push({
        chapterNumber: chapterIndex,
        chapterTitle,
        paragraphs
      });
      console.log(`  [Sec ${chapterIndex}] ${chapterTitle.slice(0, 35)} (${paragraphs.length} paras)`);
    }

    // Find next link
    const nextMatch = html.match(/<li class="next">\s*<a class="btn-large" href="([^"]+)">Next<\/a>/i);
    if (nextMatch) {
      currentUrl = `https://m.egwwritings.org${nextMatch[1]}`;
    } else {
      currentUrl = null;
    }

    await new Promise(r => setTimeout(r, 100));
  }

  // Set previous/next on chapters
  bookData.chapters.forEach((chap, idx) => {
    if (idx > 0) {
      chap.prevChapter = { number: idx, title: bookData.chapters[idx - 1].chapterTitle };
    }
    if (idx < bookData.chapters.length - 1) {
      chap.nextChapter = { number: idx + 2, title: bookData.chapters[idx + 1].chapterTitle };
    }
  });

  const outPath = path.join(__dirname, '..', 'public', 'egw', 'books', `${bookMeta.code}.json`);
  fs.writeFileSync(outPath, JSON.stringify(bookData, null, 2), 'utf-8');
  console.log(`✅ Completed ${bookMeta.title}: ${bookData.chapters.length} sections (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);

  return verseIndexEntries;
}

module.exports = { crawlBookSequential };
