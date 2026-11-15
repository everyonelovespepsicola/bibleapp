const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 4: Testimonies for the Church (Volumes 5 through 9)
 * 1. Testimonies for the Church, Vol. 5 (5T) [ID: 113] (1889)
 * 2. Testimonies for the Church, Vol. 6 (6T) [ID: 118] (1901)
 * 3. Testimonies for the Church, Vol. 7 (7T) [ID: 117] (1902)
 * 4. Testimonies for the Church, Vol. 8 (8T) [ID: 112] (1904)
 * 5. Testimonies for the Church, Vol. 9 (9T) [ID: 115] (1909)
 */
const SHIFT_4_BOOKS = [
  { id: 113, title: 'Testimonies for the Church, Vol. 5', code: '5t', abbrev: '5T', year: 1889 },
  { id: 118, title: 'Testimonies for the Church, Vol. 6', code: '6t', abbrev: '6T', year: 1901 },
  { id: 117, title: 'Testimonies for the Church, Vol. 7', code: '7t', abbrev: '7T', year: 1902 },
  { id: 112, title: 'Testimonies for the Church, Vol. 8', code: '8t', abbrev: '8T', year: 1904 },
  { id: 115, title: 'Testimonies for the Church, Vol. 9', code: '9t', abbrev: '9T', year: 1909 }
];

async function runShift4() {
  console.log('🚀 Starting Shift 4: Testimonies for the Church (Vols. 5–9)...\n');

  for (const b of SHIFT_4_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${(fs.statSync(path.resolve(`public/egw/books/${b.code}.json`)).size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 4 crawling finished! Ready to update master index.');
}

runShift4();

