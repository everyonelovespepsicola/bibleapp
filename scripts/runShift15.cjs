const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 15: Early Education, Experience, Food Ministry & Christ Our Saviour
 * 1. A Solemn Appeal (SA) [ID: 4] (1870)
 * 2. Christian Experience and Teachings of Ellen G. White (CET) [ID: 11] (1922)
 * 3. Christian Education (CE) [ID: 10] (1893/1894)
 * 4. Special Testimonies on Education (SpTEd) [ID: 103] (1897)
 * 5. The Health Food Ministry (HFM) [ID: 387] (1970)
 * 6. Christ Our Saviour (COS) [ID: 11267] (1896)
 */
const SHIFT_15_BOOKS = [
  { id: 4, title: 'A Solemn Appeal', code: 'sa', abbrev: 'SA', year: 1870 },
  { id: 11, title: 'Christian Experience and Teachings of Ellen G. White', code: 'cet', abbrev: 'CET', year: 1922 },
  { id: 10, title: 'Christian Education', code: 'ce', abbrev: 'CE', year: 1893 },
  { id: 103, title: 'Special Testimonies on Education', code: 'spted', abbrev: 'SpTEd', year: 1897 },
  { id: 387, title: 'The Health Food Ministry', code: 'hfm', abbrev: 'HFM', year: 1970 },
  { id: 11267, title: 'Christ Our Saviour', code: 'cos', abbrev: 'COS', year: 1896 }
];

async function runShift15() {
  console.log('🚀 Starting Shift 15: SA, CET, CE, SpTEd, HFM, COS...\n');

  for (const b of SHIFT_15_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      const filePath = path.resolve(`public/egw/books/${b.code}.json`);
      const fileSize = fs.existsSync(filePath) ? (fs.statSync(filePath).size / 1024).toFixed(1) : 0;
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${fileSize} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 15 crawling finished! Ready to update master index.');
}

runShift15();

