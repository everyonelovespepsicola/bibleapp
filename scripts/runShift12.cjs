const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 12: Eschatology, Faith, Sanctuary & Leadership
 * 1. Last Day Events (LDE) [ID: 39] (1992)
 * 2. Faith and Works (FW) [ID: 31] (1979)
 * 3. Christ in His Sanctuary (CSB) [ID: 12119] (1969)
 * 4. The Truth About Angels (TAA) [ID: 146] (1996)
 * 5. Counsels on Sabbath School Work (CSW) [ID: 21] (1938)
 * 6. Christian Leadership (ChL) [ID: 12] (1985)
 */
const SHIFT_12_BOOKS = [
  { id: 39, title: 'Last Day Events', code: 'lde', abbrev: 'LDE', year: 1992 },
  { id: 31, title: 'Faith and Works', code: 'fw', abbrev: 'FW', year: 1979 },
  { id: 12119, title: 'Christ in His Sanctuary', code: 'csb', abbrev: 'CSB', year: 1969 },
  { id: 146, title: 'The Truth About Angels', code: 'taa', abbrev: 'TAA', year: 1996 },
  { id: 21, title: 'Counsels on Sabbath School Work', code: 'csw', abbrev: 'CSW', year: 1938 },
  { id: 12, title: 'Christian Leadership', code: 'chl', abbrev: 'ChL', year: 1985 }
];

async function runShift12() {
  console.log('🚀 Starting Shift 12: LDE, FW, CSB, TAA, CSW, ChL...\n');

  for (const b of SHIFT_12_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      const filePath = path.resolve(`public/egw/books/${b.code}.json`);
      const fileSize = fs.existsSync(filePath) ? (fs.statSync(filePath).size / 1024).toFixed(1) : 0;
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${fileSize} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 12 crawling finished! Ready to update master index.');
}

runShift12();

