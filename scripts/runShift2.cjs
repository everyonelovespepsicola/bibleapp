const fs = require('fs');
const path = require('path');
const { crawlBookSequential } = require('./sequentialCrawler.cjs');

/**
 * SHIFT 2: The Core Devotionals & Ministry Classics
 * 1. The Ministry of Healing (MH) [ID: 135] (1905)
 * 2. Early Writings (EW) [ID: 28] (1882)
 * 3. Gospel Workers (GW) [ID: 35] (1915)
 * 4. Testimonies to Ministers (TM) [ID: 123] (1923)
 * 5. Life Sketches of Ellen G. White (LS) [ID: 41] (1915)
 */
const SHIFT_2_BOOKS = [
  { id: 135, title: 'The Ministry of Healing', code: 'mh', abbrev: 'MH', year: 1905 },
  { id: 28, title: 'Early Writings', code: 'ew', abbrev: 'EW', year: 1882 },
  { id: 35, title: 'Gospel Workers', code: 'gw', abbrev: 'GW', year: 1915 },
  { id: 123, title: 'Testimonies to Ministers and Gospel Workers', code: 'tm', abbrev: 'TM', year: 1923 },
  { id: 41, title: 'Life Sketches of Ellen G. White', code: 'ls', abbrev: 'LS', year: 1915 }
];

const masterIndexPath = path.resolve('public/egw/egw_verse_index.json');
let masterIndex = {};
if (fs.existsSync(masterIndexPath)) {
  try {
    masterIndex = JSON.parse(fs.readFileSync(masterIndexPath, 'utf8'));
  } catch (e) {
    console.warn('Could not read existing master index:', e);
  }
}

async function runShift2() {
  console.log('🚀 Starting Shift 2: 5 Core Devotionals & Ministry Classics...\n');

  for (const b of SHIFT_2_BOOKS) {
    try {
      const bookData = await crawlBookSequential(b);
      console.log(`✅ Completed ${b.title}: ${bookData.chapters.length} sections (${(fs.statSync(path.resolve(`public/egw/books/${b.code}.json`)).size / 1024).toFixed(1)} KB)`);

      // Merge into master verse index
      let newVersesIndexed = 0;
      for (const ch of bookData.chapters) {
        for (const p of ch.paragraphs) {
          if (p.targetVerses && p.targetVerses.length > 0) {
            for (const verse of p.targetVerses) {
              if (!masterIndex[verse]) {
                masterIndex[verse] = [];
                newVersesIndexed++;
              }
              // Prevent duplicates
              const pId = `${b.code}-${p.pageRef.replace('.', '-')}`;
              if (!masterIndex[verse].some(item => item.id === pId)) {
                masterIndex[verse].push({
                  id: pId,
                  sourceBook: b.name,
                  sourceAbbrev: b.abbrev,
                  year: b.year,
                  pageRef: p.pageRef,
                  chapterNumber: ch.chapterNumber,
                  chapterTitle: ch.chapterTitle,
                  paragraphText: p.text,
                  targetVerses: p.targetVerses
                });
              }
            }
          }
        }
      }

      fs.writeFileSync(masterIndexPath, JSON.stringify(masterIndex, null, 2), 'utf8');
      console.log(`Checkpoint saved: Total indexed scripture verses so far: ${Object.keys(masterIndex).length}`);
    } catch (err) {
      console.error(`❌ Failed on book ${b.name}:`, err);
    }
  }

  console.log('\n🎉 Shift 2 completed successfully!');
}

runShift2();

