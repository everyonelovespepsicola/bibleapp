const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 11: The Spirit of Prophecy (1870–1884 Series) & The Story of Jesus
 * 1. The Spirit of Prophecy, Vol. 1 (1SP) [ID: 141] (1870)
 * 2. The Spirit of Prophecy, Vol. 2 (2SP) [ID: 143] (1877)
 * 3. The Spirit of Prophecy, Vol. 3 (3SP) [ID: 142] (1878)
 * 4. The Spirit of Prophecy, Vol. 4 (4SP) [ID: 140] (1884)
 * 5. The Story of Jesus (SJ) [ID: 144] (1896)
 */
const SHIFT_11_BOOKS = [
  { id: 141, title: 'The Spirit of Prophecy, Vol. 1', code: '1sp', abbrev: '1SP', year: 1870 },
  { id: 143, title: 'The Spirit of Prophecy, Vol. 2', code: '2sp', abbrev: '2SP', year: 1877 },
  { id: 142, title: 'The Spirit of Prophecy, Vol. 3', code: '3sp', abbrev: '3SP', year: 1878 },
  { id: 140, title: 'The Spirit of Prophecy, Vol. 4', code: '4sp', abbrev: '4SP', year: 1884 },
  { id: 144, title: 'The Story of Jesus', code: 'sj', abbrev: 'SJ', year: 1896 }
];

async function runShift11() {
  console.log('🚀 Starting Shift 11: 1SP, 2SP, 3SP, 4SP, SJ...\n');

  for (const b of SHIFT_11_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      const filePath = path.resolve(`public/egw/books/${b.code}.json`);
      const fileSize = fs.existsSync(filePath) ? (fs.statSync(filePath).size / 1024).toFixed(1) : 0;
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${fileSize} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 11 crawling finished! Ready to update master index.');
}

runShift11();

