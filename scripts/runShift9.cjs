const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 9: Publishing, Church Leadership, Prayer & Pioneers
 * 1. The Story of Redemption (SR) [ID: 145] (1947)
 * 2. Prayer (Pr) [ID: 87] (2002)
 * 3. Pastoral Ministry (PaM) [ID: 83] (1995)
 * 4. Colporteur Ministry (CM) [ID: 16] (1953)
 * 5. Country Living (CL) [ID: 25] (1946)
 * 6. The Publishing Ministry (PM) [ID: 390] (1983)
 */
const SHIFT_9_BOOKS = [
  { id: 145, title: 'The Story of Redemption', code: 'sr', abbrev: 'SR', year: 1947 },
  { id: 87, title: 'Prayer', code: 'pr', abbrev: 'Pr', year: 2002 },
  { id: 83, title: 'Pastoral Ministry', code: 'pam', abbrev: 'PaM', year: 1995 },
  { id: 16, title: 'Colporteur Ministry', code: 'cm', abbrev: 'CM', year: 1953 },
  { id: 25, title: 'Country Living', code: 'cl', abbrev: 'CL', year: 1946 },
  { id: 390, title: 'The Publishing Ministry', code: 'pm', abbrev: 'PM', year: 1983 }
];

async function runShift9() {
  console.log('🚀 Starting Shift 9: SR, Pr, PaM, CM, CL, PM...\n');

  for (const b of SHIFT_9_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      const filePath = path.resolve(`public/egw/books/${b.code}.json`);
      const fileSize = fs.existsSync(filePath) ? (fs.statSync(filePath).size / 1024).toFixed(1) : 0;
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${fileSize} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 9 crawling finished! Ready to update master index.');
}

runShift9();

