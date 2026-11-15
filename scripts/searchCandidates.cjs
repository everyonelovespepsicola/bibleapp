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

async function searchAllInFolder4() {
  const allBooks = [];
  for (let p = 1; p <= 12; p++) {
    const html = await fetchUrl('https://m.egwwritings.org/en/folders/4?page=' + p);
    const regex = /<h4 class="book-title"><a href="\/en\/book\/(\d+)\.0">([^<]+)<\/a><\/h4>/g;
    let m;
    while ((m = regex.exec(html)) !== null) {
      allBooks.push({ id: m[1], title: m[2].trim() });
    }
  }

  // Find other popular practical/devotional titles in Folder 4
  const patterns = [
    'call to stand',
    'christian education',
    'life sketches',
    'gospel',
    'pastoral',
    'prayer',
    'spiritual gifts',
    'spirit of prophecy',
    'story of',
    'redemption'
  ];

  for (const b of allBooks) {
    if (patterns.some(p => b.title.toLowerCase().includes(p))) {
      console.log(`[ID: ${b.id}] ${b.title}`);
    }
  }
}

searchAllInFolder4();

