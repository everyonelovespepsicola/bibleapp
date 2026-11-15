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

async function searchFolders() {
  // Folder 4 is Books, Folder 5 is Compilations or Manuscripts, Folder 1 etc.
  for (const f of [1, 2, 3, 4, 5, 6, 7]) {
    try {
      const html = await fetchUrl(`https://m.egwwritings.org/en/folders/${f}?page=1`);
      const regex = /<h4 class="book-title"><a href="\/en\/book\/(\d+)\.0">([^<]+)<\/a><\/h4>/g;
      let m;
      let count = 0;
      while ((m = regex.exec(html)) !== null) {
        count++;
        if (/selected messages|sanctified/i.test(m[2])) {
          console.log(`Folder ${f}: [ID: ${m[1]}] ${m[2].trim()}`);
        }
      }
      if (count > 0) console.log(`Folder ${f} had books.`);
    } catch (e) {}
  }
}

searchFolders();

