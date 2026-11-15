const fs = require('fs');
const path = require('path');
const catalog = require('./coreEgwCatalog.cjs');
const { downloadBook } = require('./bookDownloader.cjs');

async function pullBooks() {
  // Pull the primary 4 books for immediate high-density study
  const targetCodes = ['sc', 'col', 'mb', 'ed'];
  const targetBooks = catalog.filter(b => targetCodes.includes(b.code));

  console.log(`Starting download for ${targetBooks.length} books...`);

  // Load existing verse index if present
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
    const entries = await downloadBook(book);
    for (const e of entries) {
      if (!masterIndex[e.verse]) {
        masterIndex[e.verse] = [];
      }
      // Avoid duplicate comments
      if (!masterIndex[e.verse].some(c => c.id === e.comment.id)) {
        masterIndex[e.verse].push(e.comment);
      }
    }
  }

  fs.writeFileSync(indexPath, JSON.stringify(masterIndex, null, 2), 'utf-8');
  console.log(`\n🎉 Updated master verse index at: ${indexPath}`);
  console.log(`Total indexed scripture verses: ${Object.keys(masterIndex).length}`);
}

pullBooks().catch(console.error);
