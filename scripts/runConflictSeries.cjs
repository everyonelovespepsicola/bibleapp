const fs = require('fs');
const path = require('path');
const catalog = require('./coreEgwCatalog.cjs');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

async function runBigBatch() {
  // Download the core 5 Conflict of the Ages series
  const targetCodes = ['pp', 'pk', 'da', 'aa', 'gc'];
  const targetBooks = catalog.filter(b => targetCodes.includes(b.code));

  console.log(`Starting sequential crawl for ${targetBooks.length} Conflict of the Ages books...`);

  const indexPath = path.join(__dirname, '..', 'public', 'egw', 'egw_verse_index.json');
  let masterIndex = {};
  if (fs.existsSync(indexPath)) {
    try {
      masterIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    } catch {
      masterIndex = {};
    }
  }

  for (const book of targetBooks) {
    const entries = await crawlBookSequential(book);
    for (const e of entries) {
      if (!masterIndex[e.verse]) {
        masterIndex[e.verse] = [];
      }
      if (!masterIndex[e.verse].some(c => c.id === e.comment.id)) {
        masterIndex[e.verse].push(e.comment);
      }
    }
    // Checkpoint master index after every book
    fs.writeFileSync(indexPath, JSON.stringify(masterIndex, null, 2), 'utf-8');
    console.log(`Checkpoint saved: Total indexed scripture verses so far: ${Object.keys(masterIndex).length}`);
  }

  console.log(`\n🎉 All Conflict of the Ages books crawled successfully!`);
}

runBigBatch().catch(console.error);

