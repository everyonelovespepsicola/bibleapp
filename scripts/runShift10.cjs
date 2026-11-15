const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 10: Early Advent Heritage — Spiritual Gifts & A Call to Stand Apart
 * 1. Spiritual Gifts, Vol. 1 (1SG) [ID: 104] (1858)
 * 2. Spiritual Gifts, Vol. 2 (2SG) [ID: 105] (1860)
 * 3. Spiritual Gifts, Vol. 3 (3SG) [ID: 106] (1864)
 * 4. Spiritual Gifts, Vol. 4a (4aSG) [ID: 107] (1864)
 * 5. Spiritual Gifts, Vol. 4b (4bSG) [ID: 385] (1864)
 * 6. A Call to Stand Apart (CSA) [ID: 2] (2002)
 */
const SHIFT_10_BOOKS = [
  { id: 104, title: 'Spiritual Gifts, Vol. 1', code: '1sg', abbrev: '1SG', year: 1858 },
  { id: 105, title: 'Spiritual Gifts, Vol. 2', code: '2sg', abbrev: '2SG', year: 1860 },
  { id: 106, title: 'Spiritual Gifts, Vol. 3', code: '3sg', abbrev: '3SG', year: 1864 },
  { id: 107, title: 'Spiritual Gifts, Vol. 4a', code: '4asg', abbrev: '4aSG', year: 1864 },
  { id: 385, title: 'Spiritual Gifts, Vol. 4b', code: '4bsg', abbrev: '4bSG', year: 1864 },
  { id: 2, title: 'A Call to Stand Apart', code: 'csa', abbrev: 'CSA', year: 2002 }
];

async function runShift10() {
  console.log('🚀 Starting Shift 10: 1SG, 2SG, 3SG, 4aSG, 4bSG, CSA...\n');

  for (const b of SHIFT_10_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      const filePath = path.resolve(`public/egw/books/${b.code}.json`);
      const fileSize = fs.existsSync(filePath) ? (fs.statSync(filePath).size / 1024).toFixed(1) : 0;
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${fileSize} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 10 crawling finished! Ready to update master index.');
}

runShift10();

