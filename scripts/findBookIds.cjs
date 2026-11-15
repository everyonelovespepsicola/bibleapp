const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function listAllBooks() {
  const books = [];
  for (let page = 1; page <= 6; page++) {
    const html = await fetchUrl('https://m.egwwritings.org/en/folders/4?page=' + page);
    const regex = /<h4 class="book-title"><a href="\/en\/book\/(\d+)\.0">([^<]+)<\/a><\/h4>/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      books.push({ id: match[1], title: match[2].trim() });
    }
  }
  console.log('Total books found on m.egwwritings.org/en/folders/4:', books.length);
  const targetTitles = [
    'Steps to Christ',
    'The Desire of Ages',
    'The Great Controversy',
    'Patriarchs and Prophets',
    'Prophets and Kings',
    'The Acts of the Apostles',
    "Christ's Object Lessons",
    'Education',
    'Thoughts from the Mount of Blessing',
    'Early Writings'
  ];
  const matches = books.filter(b => targetTitles.some(t => b.title.toLowerCase().includes(t.toLowerCase())));
  console.log(matches);
}

listAllBooks().catch(console.error);
