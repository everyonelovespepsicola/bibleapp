const fs = require('fs');
const path = require('path');

const BOOKS_DIR = path.resolve('public/egw/books');
const OUTPUT_INDEX = path.resolve('public/egw/egw_verse_index.json');

// Metadata mapping for all ingested books
const BOOK_META = {
  pp: { title: 'Patriarchs and Prophets', abbrev: 'PP', year: 1890 },
  pk: { title: 'Prophets and Kings', abbrev: 'PK', year: 1917 },
  da: { title: 'The Desire of Ages', abbrev: 'DA', year: 1898 },
  aa: { title: 'The Acts of the Apostles', abbrev: 'AA', year: 1911 },
  gc: { title: 'The Great Controversy', abbrev: 'GC', year: 1888 },
  sc: { title: 'Steps to Christ', abbrev: 'SC', year: 1892 },
  col: { title: "Christ's Object Lessons", abbrev: 'COL', year: 1900 },
  mb: { title: 'Thoughts From the Mount of Blessing', abbrev: 'MB', year: 1896 },
  ed: { title: 'Education', abbrev: 'Ed', year: 1903 },
  mh: { title: 'The Ministry of Healing', abbrev: 'MH', year: 1905 },
  ew: { title: 'Early Writings', abbrev: 'EW', year: 1882 },
  gw: { title: 'Gospel Workers', abbrev: 'GW', year: 1915 },
  tm: { title: 'Testimonies to Ministers and Gospel Workers', abbrev: 'TM', year: 1923 },
  ls: { title: 'Life Sketches of Ellen G. White', abbrev: 'LS', year: 1915 },
  '1t': { title: 'Testimonies for the Church, Vol. 1', abbrev: '1T', year: 1868 },
  '2t': { title: 'Testimonies for the Church, Vol. 2', abbrev: '2T', year: 1871 },
  '3t': { title: 'Testimonies for the Church, Vol. 3', abbrev: '3T', year: 1875 },
  '4t': { title: 'Testimonies for the Church, Vol. 4', abbrev: '4T', year: 1881 },
  '5t': { title: 'Testimonies for the Church, Vol. 5', abbrev: '5T', year: 1889 },
  '6t': { title: 'Testimonies for the Church, Vol. 6', abbrev: '6T', year: 1901 },
  '7t': { title: 'Testimonies for the Church, Vol. 7', abbrev: '7T', year: 1902 },
  '8t': { title: 'Testimonies for the Church, Vol. 8', abbrev: '8T', year: 1904 },
  '9t': { title: 'Testimonies for the Church, Vol. 9', abbrev: '9T', year: 1909 }
};

function reindexAll() {
  console.log('🔄 Building complete verse index from all public/egw/books/*.json...');
  const files = fs.readdirSync(BOOKS_DIR).filter(f => f.endsWith('.json') && f !== 'undefined.json');
  console.log(`Found ${files.length} book files.`);

  const masterIndex = {};
  let totalParagraphs = 0;
  let totalCitations = 0;

  for (const file of files) {
    const code = file.replace('.json', '');
    const meta = BOOK_META[code] || { title: code.toUpperCase(), abbrev: code.toUpperCase(), year: 1900 };
    const filePath = path.join(BOOKS_DIR, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const chapters = content.chapters || [];
    for (const ch of chapters) {
      const paragraphs = ch.paragraphs || [];
      totalParagraphs += paragraphs.length;

      for (const p of paragraphs) {
        if (p.targetVerses && Array.isArray(p.targetVerses) && p.targetVerses.length > 0) {
          for (const verse of p.targetVerses) {
            if (!masterIndex[verse]) {
              masterIndex[verse] = [];
            }
            const pId = `${code}-${p.pageRef.replace('.', '-')}`;
            if (!masterIndex[verse].some(item => item.id === pId)) {
              masterIndex[verse].push({
                id: pId,
                sourceBook: meta.title,
                sourceAbbrev: meta.abbrev,
                year: meta.year,
                pageRef: p.pageRef,
                chapterNumber: ch.chapterNumber,
                chapterTitle: ch.chapterTitle,
                paragraphText: p.text,
                targetVerses: p.targetVerses
              });
              totalCitations++;
            }
          }
        }
      }
    }
  }

  // Preserve canonical manual mapping for 8t-258-4 on Genesis 1:1 if not present
  const gen1 = 'Genesis 1:1';
  if (!masterIndex[gen1]) masterIndex[gen1] = [];
  if (!masterIndex[gen1].some(item => item.id === '8t-258-4')) {
    masterIndex[gen1].push({
      id: '8t-258-4',
      sourceBook: 'Testimonies for the Church, Vol. 8',
      sourceAbbrev: '8T',
      year: 1904,
      pageRef: '258.4',
      chapterNumber: 42,
      chapterTitle: 'God in Nature',
      paragraphText: "The theory that God did not create matter when He brought the world into existence is without foundation. In the formation of our world, God was not indebted to pre-existing matter. On the contrary, all things, material or spiritual, stood up before the Lord Jehovah at His voice and were created for His own purpose. The heavens and all the host of them, the earth and all things therein, are not only the work of His hand; they came into existence by the breath of His mouth.",
      targetVerses: ['Genesis 1:1', 'Psalm 33:6', 'Psalm 33:9', 'Hebrews 11:3']
    });
    totalCitations++;
  }

  fs.writeFileSync(OUTPUT_INDEX, JSON.stringify(masterIndex, null, 2), 'utf8');
  console.log(`\n🎉 Re-indexing complete!`);
  console.log(`- Total Books: ${files.length}`);
  console.log(`- Total Paragraphs Scanned: ${totalParagraphs}`);
  console.log(`- Total Unique Verses Indexed: ${Object.keys(masterIndex).length}`);
  console.log(`- Total Citations Indexed: ${totalCitations}`);
}

reindexAll();

