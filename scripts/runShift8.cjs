const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 8: Educational, Health, Writing & Mind/Personality Counsels
 * 1. Counsels to Parents, Teachers, and Students (CT) [ID: 23] (1913)
 * 2. Counsels on Health (CH) [ID: 20] (1923)
 * 3. Counsels to Writers and Editors (CW) [ID: 24] (1946)
 * 4. Medical Ministry (MM) [ID: 75] (1932)
 * 5. Mind, Character, and Personality, Vol. 1 (1MCP) [ID: 77] (1977)
 * 6. Mind, Character, and Personality, Vol. 2 (2MCP) [ID: 78] (1977)
 */
const SHIFT_8_BOOKS = [
  { id: 23, title: 'Counsels to Parents, Teachers, and Students', code: 'ct', abbrev: 'CT', year: 1913 },
  { id: 20, title: 'Counsels on Health', code: 'ch', abbrev: 'CH', year: 1923 },
  { id: 24, title: 'Counsels to Writers and Editors', code: 'cw', abbrev: 'CW', year: 1946 },
  { id: 75, title: 'Medical Ministry', code: 'mm', abbrev: 'MM', year: 1932 },
  { id: 77, title: 'Mind, Character, and Personality, Vol. 1', code: '1mcp', abbrev: '1MCP', year: 1977 },
  { id: 78, title: 'Mind, Character, and Personality, Vol. 2', code: '2mcp', abbrev: '2MCP', year: 1977 }
];

async function runShift8() {
  console.log('🚀 Starting Shift 8: CT, CH, CW, MM, 1MCP, 2MCP...\n');

  for (const b of SHIFT_8_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      const filePath = path.resolve(`public/egw/books/${b.code}.json`);
      const fileSize = fs.existsSync(filePath) ? (fs.statSync(filePath).size / 1024).toFixed(1) : 0;
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${fileSize} KB)`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.title}:`, err);
    }
  }

  console.log('\n🎉 Shift 8 crawling finished! Ready to update master index.');
}

runShift8();

