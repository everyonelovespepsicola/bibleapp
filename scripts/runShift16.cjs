const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 16: Pioneer Memoirs & Early Landmark Editions
 * 1. Life Sketches of James White and Ellen G. White (1880 ed.) (LS80) [ID: 42]
 * 2. Life Sketches of James White and Ellen G. White (1888 ed.) (LS88) [ID: 43]
 * 3. Gospel Workers (1892 ed.) (GW92) [ID: 34]
 * 4. A Sketch of the Christian Experience and Views of Ellen G. White (ExV) [ID: 3]
 * 5. Supplement to Experience and Views (ExV54) [ID: 109]
 */
const SHIFT_16_BOOKS = [
  { id: 42, title: 'Life Sketches of James and Ellen White (1880)', code: 'ls80', abbrev: 'LS80', year: 1880 },
  { id: 43, title: 'Life Sketches of James and Ellen White (1888)', code: 'ls88', abbrev: 'LS88', year: 1888 },
  { id: 34, title: 'Gospel Workers (1892 ed.)', code: 'gw92', abbrev: 'GW92', year: 1892 },
  { id: 3, title: 'Christian Experience and Views (1851)', code: 'exv', abbrev: 'ExV', year: 1851 },
  { id: 109, title: 'Supplement to Experience and Views (1854)', code: 'exv54', abbrev: 'ExV54', year: 1854 }
];

async function runShift16() {
  console.log('🚀 Starting Shift 16: LS80, LS88, GW92, ExV, ExV54...\n');

  for (const b of SHIFT_16_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      const filePath = path.resolve(`public/egw/books/${b.code}.json`);
      const fileSize = fs.existsSync(filePath) ? (fs.statSync(filePath).size / 1024).toFixed(1) : 0;
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${fileSize} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 16 crawling finished! Ready to update master index.');
}

runShift16();

