const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 7: Historical Sketches, Selected Messages & The Sanctified Life
 * 1. Sketches from the Life of Paul (LP) [ID: 101] (1883)
 * 2. The Sanctified Life (SL) [ID: 138] (1889)
 * 3. Selected Messages, Book 1 (1SM) [ID: 98] (1958)
 * 4. Selected Messages, Book 2 (2SM) [ID: 99] (1958)
 * 5. Selected Messages, Book 3 (3SM) [ID: 100] (1980)
 */
const SHIFT_7_BOOKS = [
  { id: 101, title: 'Sketches from the Life of Paul', code: 'lp', abbrev: 'LP', year: 1883 },
  { id: 138, title: 'The Sanctified Life', code: 'sl', abbrev: 'SL', year: 1889 },
  { id: 98, title: 'Selected Messages, Book 1', code: '1sm', abbrev: '1SM', year: 1958 },
  { id: 99, title: 'Selected Messages, Book 2', code: '2sm', abbrev: '2SM', year: 1958 },
  { id: 100, title: 'Selected Messages, Book 3', code: '3sm', abbrev: '3SM', year: 1980 }
];

async function runShift7() {
  console.log('🚀 Starting Shift 7: LP, SL, 1SM, 2SM, 3SM...\n');

  for (const b of SHIFT_7_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      const filePath = path.resolve(`public/egw/books/${b.code}.json`);
      const fileSize = fs.existsSync(filePath) ? (fs.statSync(filePath).size / 1024).toFixed(1) : 0;
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${fileSize} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 7 crawling finished! Ready to update master index.');
}

runShift7();

