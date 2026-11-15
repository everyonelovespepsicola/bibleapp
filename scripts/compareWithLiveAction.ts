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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
        diffSnippet: `Length: Live (${liveP.length}) vs Local (${localP.length})`,
        liveSnippet: liveP.slice(0, 100),
        localSnippet: localP.slice(0, 100),
      });
    }
  }

  return result;
}

export async function compareBookWithLive(bookAbbrev: string): Promise<void> {
  const filePath = path.resolve(process.cwd(), `public/egw/books/${bookAbbrev.toLowerCase()}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`Book file ${bookAbbrev} not found on disk.`);
    return;
  }

  const localBook = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const chapters = localBook.chapters || [];
  console.log(`Auditing book ${bookAbbrev.toUpperCase()}: ${chapters.length} chapters...`);

  let totalExact = 0;
  let totalParas = 0;
  let totalDiscrepancies = 0;

  for (let c = 1; c <= chapters.length; c++) {
    try {
      const res = await compareChapterWithLive(bookAbbrev, c);
      if (res) {
        totalParas += res.totalParagraphs;
        totalExact += res.exactMatches;
        totalDiscrepancies += res.discrepancies.length;
        if (res.discrepancies.length === 0) {
          console.log(`  ✓ Ch ${c} (${res.chapterTitle}): ${res.exactMatches}/${res.totalParagraphs} paragraphs 100% match`);
        } else {
          console.log(`  ⚠️ Ch ${c} (${res.chapterTitle}): ${res.discrepancies.length} discrepancies`);
        }
      }
      await sleep(250); // Safe rate limit between chapter requests
    } catch (err: any) {
      console.error(`  ❌ Error comparing Ch ${c}: ${err.message}`);
    }
  }

  console.log('-----------------------------------------------------------');
  console.log(`Summary for ${bookAbbrev.toUpperCase()}:`);
  console.log(`Total Chapters:      ${chapters.length}`);
  console.log(`Total Paragraphs:    ${totalParas}`);
  console.log(`100% Matches:        ${totalExact} / ${totalParas}`);
  console.log(`Total Discrepancies: ${totalDiscrepancies}`);
  console.log('-----------------------------------------------------------');
}

export async function compareAllBooksSample(): Promise<void> {
  const booksDir = path.resolve(process.cwd(), 'public/egw/books');
  const files = fs.readdirSync(booksDir).filter((f) => f.endsWith('.json'));
  console.log(`Sample-auditing all ${files.length} books (comparing Chapter 1 of every book with live site)...`);

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const abbrev = files[i].replace('.json', '');
    try {
      console.log(`[${i + 1}/${files.length}] Checking ${abbrev.toUpperCase()}...`);
      const res = await compareChapterWithLive(abbrev, 1);
      if (res && res.discrepancies.length === 0) {
        passed++;
        console.log(`  ✓ ${abbrev.toUpperCase()} Ch 1 matches live site 100%`);
      } else {
        failed++;
        console.log(`  ⚠️ ${abbrev.toUpperCase()} had ${res?.discrepancies.length || 'error'} differences`);
      }
      await sleep(250);
    } catch (err: any) {
      console.error(`  ❌ Error on ${abbrev}: ${err.message}`);
      failed++;
    }
  }

  console.log('===========================================================');
  console.log(`ALL 59 BOOKS LIVE SAMPLE AUDIT COMPLETE:`);
  console.log(`Passed: ${passed} / ${files.length}`);
  console.log(`Failed: ${failed} / ${files.length}`);
  console.log('===========================================================');
}

// CLI Execution: npx tsx scripts/compareWithLiveAction.ts [bookAbbrev] [chapterNum]
if (process.argv[1]?.endsWith('compareWithLiveAction.ts') || process.argv[1]?.endsWith('compareWithLiveAction.js')) {
  const args = process.argv.slice(2);
  const book = args[0]?.trim() || 'GC';
  const chArg = args[1]?.trim();

  (async () => {
    console.log('===========================================================');
    console.log(`  LIVE SITE ACCURACY COMPARATOR: TARGET [${book.toUpperCase()}]`);
    console.log('===========================================================');

    if (book.toUpperCase() === 'ALL') {
      await compareAllBooksSample();
    } else if (!chArg || chArg.toLowerCase() === 'all') {
      await compareBookWithLive(book);
    } else {
      const ch = parseInt(chArg, 10);
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
    }
  })();
}
