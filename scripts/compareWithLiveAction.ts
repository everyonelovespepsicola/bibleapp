import fs from 'fs';
import path from 'path';
import https from 'https';

interface ComparisonDiff {
  paragraphIndex: number;
  pageRef?: string;
  diffSnippet: string;
  liveSnippet: string;
  localSnippet: string;
}

export interface ChapterComparisonResult {
  bookAbbrev: string;
  chapterNumber: number;
  chapterTitle: string;
  totalParagraphs: number;
  exactMatches: number;
  discrepancies: ComparisonDiff[];
}

function fetchHtml(urlPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(
        {
          hostname: 'text.egwwritings.org',
          path: urlPath,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ScriptureFlowComparator/1.0',
          },
        },
        (res) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            fetchHtml(res.headers.location || '').then(resolve).catch(reject);
            return;
          }
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(data));
        }
      )
      .on('error', reject);
  });
}

export async function compareChapterWithLive(
  bookAbbrev: string,
  chapterNumber: number
): Promise<ChapterComparisonResult | null> {
  const filePath = path.resolve(process.cwd(), `public/egw/books/${bookAbbrev.toLowerCase()}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`Book file ${bookAbbrev} not found on disk.`);
    return null;
  }

  const localBook = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const chapter = localBook.chapters?.[chapterNumber - 1];
  if (!chapter) {
    console.error(`Chapter ${chapterNumber} not found in ${bookAbbrev}.`);
    return null;
  }

  // Find page number of first paragraph to form publication URL
  const firstPageRef = chapter.paragraphs?.[0]?.pageRef || '1.1';
  const pageNum = parseInt(firstPageRef.split('.')[0], 10) || chapterNumber;
  const targetUrl = `/publication.php?pubtype=Book&bookCode=${bookAbbrev.toUpperCase()}&lang=en&pagenumber=${pageNum}`;

  console.log(`[Comparator] Fetching live chapter ${chapterNumber} (${chapter.chapterTitle}) via ${targetUrl}...`);
  const html = await fetchHtml(targetUrl);

  // Extract live paragraphs
  const liveParas: string[] = [];
  const re = /<p[^>]*class="para[^"]*"[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  const citationPattern = new RegExp(`${bookAbbrev.toUpperCase()}\\s+[0-9.]+`, 'gi');

  while ((m = re.exec(html)) !== null) {
    let text = m[1].replace(/<[^>]+>/g, '').replace(/\{[^}]+\}/g, '');
    text = text.replace(citationPattern, '');
    text = text.replace(/\s+/g, ' ').trim();
    if (text) liveParas.push(text);
  }

  const result: ChapterComparisonResult = {
    bookAbbrev: bookAbbrev.toUpperCase(),
    chapterNumber,
    chapterTitle: chapter.chapterTitle,
    totalParagraphs: chapter.paragraphs.length,
    exactMatches: 0,
    discrepancies: [],
  };

  const count = Math.max(liveParas.length, chapter.paragraphs.length);
  for (let i = 0; i < count; i++) {
    const liveP = liveParas[i] || '';
    const localP = chapter.paragraphs[i] ? chapter.paragraphs[i].text.replace(/\s+/g, ' ').trim() : '';

    if (liveP === localP) {
      result.exactMatches++;
    } else {
      result.discrepancies.push({
        paragraphIndex: i + 1,
        pageRef: chapter.paragraphs[i]?.pageRef,
        diffSnippet: `Character count: Live (${liveP.length}) vs Local (${localP.length})`,
        liveSnippet: liveP.slice(0, 100),
        localSnippet: localP.slice(0, 100),
      });
    }
  }

  return result;
}

// CLI Execution: npx tsx scripts/compareWithLiveAction.ts [bookAbbrev] [chapterNum]
if (process.argv[1]?.endsWith('compareWithLiveAction.ts') || process.argv[1]?.endsWith('compareWithLiveAction.js')) {
  const args = process.argv.slice(2);
  const book = args[0] || 'GC';
  const ch = parseInt(args[1] || '4', 10);

  (async () => {
    console.log('===========================================================');
    console.log(`  LIVE SITE ACCURACY COMPARATOR: ${book.toUpperCase()} Chapter ${ch}  `);
    console.log('===========================================================');
    const res = await compareChapterWithLive(book, ch);
    if (!res) return;

    console.log(`Chapter Title:     ${res.chapterTitle}`);
    console.log(`Total Paragraphs:  ${res.totalParagraphs}`);
    console.log(`100% Exact Match:  ${res.exactMatches} / ${res.totalParagraphs} paragraphs`);
    console.log(`Discrepancies:     ${res.discrepancies.length}`);

    if (res.discrepancies.length === 0) {
      console.log('-----------------------------------------------------------');
      console.log('✅ VERIFIED: Every word and paragraph matches the official site 100% identically!');
    } else {
      console.log('-----------------------------------------------------------');
      res.discrepancies.forEach((d) => {
        console.log(`❌ Paragraph #${d.paragraphIndex} [${d.pageRef || ''}]:`);
        console.log(`   Live : ${d.liveSnippet}...`);
        console.log(`   Local: ${d.localSnippet}...`);
      });
    }
    console.log('===========================================================');
  })();
}
