const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 6: Evangelism, Service & Education
 * 1. Evangelism (Ev) [ID: 30] (1946)
 * 2. Christian Service (ChS) [ID: 13] (1925)
 * 3. Fundamentals of Christian Education (FE) [ID: 32] (1923)
 * 4. Temperance (Te) [ID: 110] (1949)
 * 5. Welfare Ministry (WM) [ID: 152] (1952)
 */
const SHIFT_6_BOOKS = [
  { id: 30, title: 'Evangelism', code: 'ev', abbrev: 'Ev', year: 1946 },
  { id: 13, title: 'Christian Service', code: 'chs', abbrev: 'ChS', year: 1925 },
  { id: 32, title: 'Fundamentals of Christian Education', code: 'fe', abbrev: 'FE', year: 1923 },
  { id: 110, title: 'Temperance', code: 'te', abbrev: 'Te', year: 1949 },
  { id: 152, title: 'Welfare Ministry', code: 'wm', abbrev: 'WM', year: 1952 }
];

async function runShift6() {
  console.log('🚀 Starting Shift 6: Evangelism, Service & Education (Ev, ChS, FE, Te, WM)...\n');

  for (const b of SHIFT_6_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      const filePath = path.resolve(`public/egw/books/${b.code}.json`);
      const fileSize = fs.existsSync(filePath) ? (fs.statSync(filePath).size / 1024).toFixed(1) : 0;
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${fileSize} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 6 crawling finished! Ready to update master index.');
}

runShift6();

