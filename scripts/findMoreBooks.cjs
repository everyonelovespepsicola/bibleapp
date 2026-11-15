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

async function findTargetBooks() {
  const seen = new Set();
  for (let page = 1; page <= 6; page++) {
    const html = await fetchUrl('https://m.egwwritings.org/en/folders/4?page=' + page);
    const regex = /<h4 class="book-title"><a href="\/en\/book\/(\d+)\.0">([^<]+)<\/a><\/h4>/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      const id = match[1];
      const title = match[2].trim();
      if (!seen.has(id)) {
        seen.add(id);
        const lower = title.toLowerCase();
        if (
          lower.includes('object lessons') ||
          lower.includes('testimonies for the church') ||
          lower.includes('ministry of healing') ||
          lower.includes('gospel workers') ||
          lower.includes('sketches from the life of paul')
        ) {
          console.log(`${id}: ${title}`);
        }
      }
    }
  }
}

findTargetBooks().catch(console.error);
