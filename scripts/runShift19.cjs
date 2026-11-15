const { crawlBookSequential } = require('./sequentialCrawler.cjs');

const shift19Books = [
  { id: '12399', code: 'mciti', abbrev: 'MCiti', title: 'Ministry to the Cities', year: 2012 },
  { id: '86', code: 'pcp', abbrev: 'PCP', title: 'Peter’s Counsel to Parents', year: 1981 },
  { id: '137', code: 'ry', abbrev: 'RY', title: 'The Retirement Years', year: 1990 },
  { id: '121', code: 'tssw', abbrev: 'TSSW', title: 'Testimonies on Sabbath-School Work', year: 1900 },
  { id: '124', code: 'tsa', abbrev: 'TSA', title: 'Testimonies to Southern Africa', year: 1977 },
  { id: '125', code: 'tsdf', abbrev: 'TSDF', title: 'Testimony Studies on Diet and Foods', year: 1926 },
];

async function runShift19() {
  console.log(`Starting Shift 19: Ingesting ${shift19Books.length} books...`);
  for (const book of shift19Books) {
    console.log(`\n========================================`);
    console.log(`[Shift 19] Crawling ${book.title} (${book.code.toUpperCase()}) - Book ID ${book.id}`);
    console.log(`========================================`);
    try {
      await crawlBookSequential(book);
      console.log(`[Shift 19] Completed ${book.code.toUpperCase()}`);
    } catch (err) {
      console.error(`[Shift 19] Error crawling ${book.code}:`, err.message);
    }
  }
  console.log('\n[Shift 19] All books crawled successfully!');
}

runShift19();

