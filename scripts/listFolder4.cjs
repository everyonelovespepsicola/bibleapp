const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

async function listFolder4Remaining() {
  const allBooks = [];
  for (let p = 1; p <= 12; p++) {
    const html = await fetchUrl('https://m.egwwritings.org/en/folders/4?page=' + p);
    const regex = /<h4 class="book-title"><a href="\/en\/book\/(\d+)\.0">([^<]+)<\/a><\/h4>/g;
    let m;
    while ((m = regex.exec(html)) !== null) {
      allBooks.push({ id: m[1], title: m[2].trim() });
    }
  }

  // Deduplicate
  const seen = new Set();
  const unique = [];
  for (const b of allBooks) {
    if (!seen.has(b.id)) {
      seen.add(b.id);
      unique.push(b);
    }
  }

  // Filter out books we already ingested
  const ingested = [
    'pp','pk','da','aa','gc','sc','col','mb','ed','mh','ew','gw','tm','ls',
    '1t','2t','3t','4t','5t','6t','7t','8t','9t','myp','ah','cg','cd','cs',
    'ev','chs','fe','te','wm','lp','sl','1sm','2sm','3sm','ct','ch','cw','mm',
    '1mcp','2mcp','sr','pr','pam','cm','cl','pm','1sg','2sg','3sg','4asg','4bsg',
    'csa','1sp','2sp','3sp','4sp','sj'
  ];

  console.log(`Unique books in Folder 4: ${unique.length}`);
  for (const b of unique) {
    console.log(`[ID: ${b.id}] ${b.title}`);
  }
}

listFolder4Remaining();

