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

async function search() {
  const allBooks = [];
  for (let p = 1; p <= 12; p++) {
    const html = await fetchUrl('https://m.egwwritings.org/en/folders/4?page=' + p);
    const regex = /<h4 class="book-title"><a href="\/en\/book\/(\d+)\.0">([^<]+)<\/a><\/h4>/g;
    let m;
    while ((m = regex.exec(html)) !== null) {
      allBooks.push({ id: m[1], title: m[2].trim() });
    }
  }

  const targets = [
    'Sketches from the Life of Paul',
    'Selected Messages, Book 1',
    'Selected Messages, Book 2',
    'Selected Messages, Book 3',
    'The Sanctified Life',
    'Sanctified Life'
  ];

  for (const t of targets) {
    const found = allBooks.filter(b => b.title.toLowerCase().includes(t.toLowerCase()));
    console.log(`Target: ${t} ->`, found[0] || 'NOT FOUND');
  }
}

search().catch(console.error);

