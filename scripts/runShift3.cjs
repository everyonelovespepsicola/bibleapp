const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 3: Testimonies for the Church (Volumes 1 through 4)
 * 1. Testimonies for the Church, Vol. 1 (1T) [ID: 116] (1868)
 * 2. Testimonies for the Church, Vol. 2 (2T) [ID: 120] (1871)
 * 3. Testimonies for the Church, Vol. 3 (3T) [ID: 119] (1875)
 * 4. Testimonies for the Church, Vol. 4 (4T) [ID: 114] (1881)
 */
const SHIFT_3_BOOKS = [
  { id: 116, title: 'Testimonies for the Church, Vol. 1', code: '1t', abbrev: '1T', year: 1868 },
  { id: 120, title: 'Testimonies for the Church, Vol. 2', code: '2t', abbrev: '2T', year: 1871 },
  { id: 119, title: 'Testimonies for the Church, Vol. 3', code: '3t', abbrev: '3T', year: 1875 },
  { id: 114, title: 'Testimonies for the Church, Vol. 4', code: '4t', abbrev: '4T', year: 1881 }
];

async function runShift3() {
  console.log('🚀 Starting Shift 3: Testimonies for the Church (Vols. 1–4)...\n');

  for (const b of SHIFT_3_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${(fs.statSync(path.resolve(`public/egw/books/${b.code}.json`)).size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 3 crawling finished! Ready to update master index.');
}

runShift3();

