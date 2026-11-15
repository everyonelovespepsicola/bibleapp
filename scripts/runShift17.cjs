const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 17: Faith, Daily Living, Heaven & Christian Leadership
 * 1. Heaven (Hvn) [ID: 36] (2003)
 * 2. Help in Daily Living (HDL) [ID: 37] (1951)
 * 3. Darkness Before Dawn (DBD) [ID: 26] (1997)
 * 4. A New Life (NL) [ID: 386] (1981)
 * 5. True Revival (TR) [ID: 11974] (2000)
 * 6. Principles for Christian Leaders (PCL) [ID: 14222] (2018)
 */
const SHIFT_17_BOOKS = [
  { id: 36, title: 'Heaven', code: 'hvn', abbrev: 'Hvn', year: 2003 },
  { id: 37, title: 'Help in Daily Living', code: 'hdl', abbrev: 'HDL', year: 1951 },
  { id: 26, title: 'Darkness Before Dawn', code: 'dbd', abbrev: 'DBD', year: 1997 },
  { id: 386, title: 'A New Life (Revival and Beyond)', code: 'nl', abbrev: 'NL', year: 1981 },
  { id: 11974, title: 'True Revival', code: 'tr', abbrev: 'TR', year: 2000 },
  { id: 14222, title: 'Principles for Christian Leaders', code: 'pcl', abbrev: 'PCL', year: 2018 }
];

async function runShift17() {
  console.log('🚀 Starting Shift 17: Hvn, HDL, DBD, NL, TR, PCL...\n');

  for (const b of SHIFT_17_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      const filePath = path.resolve(`public/egw/books/${b.code}.json`);
      const fileSize = fs.existsSync(filePath) ? (fs.statSync(filePath).size / 1024).toFixed(1) : 0;
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${fileSize} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 17 crawling finished! Ready to update master index.');
}

runShift17();

