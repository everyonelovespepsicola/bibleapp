const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 5: Christian Living, Home & Practical Counsels
 * 1. Messages to Young People (MYP) [ID: 76] (1930)
 * 2. The Adventist Home (AH) [ID: 128] (1952)
 * 3. Child Guidance (CG) [ID: 8] (1954)
 * 4. Counsels on Diet and Foods (CD) [ID: 384] (1938)
 * 5. Counsels on Stewardship (CS) [ID: 22] (1940)
 */
const SHIFT_5_BOOKS = [
  { id: 76, title: 'Messages to Young People', code: 'myp', abbrev: 'MYP', year: 1930 },
  { id: 128, title: 'The Adventist Home', code: 'ah', abbrev: 'AH', year: 1952 },
  { id: 8, title: 'Child Guidance', code: 'cg', abbrev: 'CG', year: 1954 },
  { id: 384, title: 'Counsels on Diet and Foods', code: 'cd', abbrev: 'CD', year: 1938 },
  { id: 22, title: 'Counsels on Stewardship', code: 'cs', abbrev: 'CS', year: 1940 }
];

async function runShift5() {
  console.log('🚀 Starting Shift 5: Christian Living & Practical Counsels (MYP, AH, CG, CD, CS)...\n');

  for (const b of SHIFT_5_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      const filePath = path.resolve(`public/egw/books/${b.code}.json`);
      const fileSize = fs.existsSync(filePath) ? (fs.statSync(filePath).size / 1024).toFixed(1) : 0;
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${fileSize} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 5 crawling finished! Ready to update master index.');
}

runShift5();

