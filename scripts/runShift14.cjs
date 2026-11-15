const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 14: Marriage, Church, Family & Women's Ministry
 * 1. Letters to Young Lovers (LYL) [ID: 40] (1983)
 * 2. Counsels for the Church (CCh) [ID: 19] (1991)
 * 3. Testimonies on Sexual Behavior, Adultery, and Divorce (TSB) [ID: 122] (1989)
 * 4. Daughters of God (DG) [ID: 27] (1998)
 * 5. An Appeal to the Youth (AY) [ID: 7] (1864)
 * 6. An Appeal to Mothers (AM) [ID: 6] (1864)
 */
const SHIFT_14_BOOKS = [
  { id: 40, title: 'Letters to Young Lovers', code: 'lyl', abbrev: 'LYL', year: 1983 },
  { id: 19, title: 'Counsels for the Church', code: 'cch', abbrev: 'CCh', year: 1991 },
  { id: 122, title: 'Testimonies on Sexual Behavior, Adultery, and Divorce', code: 'tsb', abbrev: 'TSB', year: 1989 },
  { id: 27, title: 'Daughters of God', code: 'dg', abbrev: 'DG', year: 1998 },
  { id: 7, title: 'An Appeal to the Youth', code: 'ay', abbrev: 'AY', year: 1864 },
  { id: 6, title: 'An Appeal to Mothers', code: 'am', abbrev: 'AM', year: 1864 }
];

async function runShift14() {
  console.log('🚀 Starting Shift 14: LYL, CCh, TSB, DG, AY, AM...\n');

  for (const b of SHIFT_14_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      const filePath = path.resolve(`public/egw/books/${b.code}.json`);
      const fileSize = fs.existsSync(filePath) ? (fs.statSync(filePath).size / 1024).toFixed(1) : 0;
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${fileSize} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 14 crawling finished! Ready to update master index.');
}

runShift14();

