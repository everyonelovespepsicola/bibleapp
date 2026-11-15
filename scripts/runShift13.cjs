const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 13: Pioneer History, Health Pioneer Writings & Voice/Speech
 * 1. Historical Sketches of Foreign Missions (HS) [ID: 389] (1886)
 * 2. Healthful Living (HL) [ID: 388] (1897)
 * 3. The Southern Work (SW) [ID: 139] (1898/1901)
 * 4. Christian Temperance and Bible Hygiene (CTBH) [ID: 14] (1890)
 * 5. A Word to the Little Flock (WLF) [ID: 1445] (1847)
 * 6. The Voice in Speech and Song (VSS) [ID: 148] (1988)
 */
const SHIFT_13_BOOKS = [
  { id: 389, title: 'Historical Sketches of Foreign Missions', code: 'hs', abbrev: 'HS', year: 1886 },
  { id: 388, title: 'Healthful Living', code: 'hl', abbrev: 'HL', year: 1897 },
  { id: 139, title: 'The Southern Work', code: 'sw', abbrev: 'SW', year: 1898 },
  { id: 14, title: 'Christian Temperance and Bible Hygiene', code: 'ctbh', abbrev: 'CTBH', year: 1890 },
  { id: 1445, title: 'A Word to the Little Flock', code: 'wlf', abbrev: 'WLF', year: 1847 },
  { id: 148, title: 'The Voice in Speech and Song', code: 'vss', abbrev: 'VSS', year: 1988 }
];

async function runShift13() {
  console.log('🚀 Starting Shift 13: HS, HL, SW, CTBH, WLF, VSS...\n');

  for (const b of SHIFT_13_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      const filePath = path.resolve(`public/egw/books/${b.code}.json`);
      const fileSize = fs.existsSync(filePath) ? (fs.statSync(filePath).size / 1024).toFixed(1) : 0;
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${fileSize} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 13 crawling finished! Ready to update master index.');
}

runShift13();

