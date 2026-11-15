const { crawlBookSequential } = require('./sequentialCrawler.cjs');

const shift18Books = [
  { id: '1', code: 'cme', abbrev: 'CME', title: 'A Call to Medical Evangelism', year: 1910 },
  { id: '806', code: 'cev', abbrev: 'CEv', title: 'The Colporteur Evangelist', year: 1920 },
  { id: '18', code: 'con', abbrev: 'Con', title: 'Confrontation', year: 1971 },
  { id: '14042', code: 'rc', abbrev: 'RC', title: 'God’s Remnant Church', year: 1950 },
  { id: '14086', code: 'ic', abbrev: 'IC', title: 'The Impending Conflict', year: 1888 },
  { id: '45', code: 'mc', abbrev: 'MC', title: 'Manual for Canvassers', year: 1902 },
];

async function runShift18() {
  console.log(`Starting Shift 18: Ingesting ${shift18Books.length} books...`);
  for (const book of shift18Books) {
    console.log(`\n========================================`);
    console.log(`[Shift 18] Crawling ${book.title} (${book.code.toUpperCase()}) - Book ID ${book.id}`);
    console.log(`========================================`);
    try {
      await crawlBookSequential(book);
      console.log(`[Shift 18] Completed ${book.code.toUpperCase()}`);
    } catch (err) {
      console.error(`[Shift 18] Error crawling ${book.code}:`, err.message);
    }
  }
  console.log('\n[Shift 18] All books crawled successfully!');
}

runShift18();
