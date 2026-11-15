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

function cleanHtml(html) {
  return html
    .replace(/<span class="egw_refcode"[\s\S]*?<\/span>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/\s+/g, ' ')
    .trim();
}

async function testScrape() {
  const html = await fetchUrl('https://m.egwwritings.org/en/book/130.21');
  const regex = /<p[^>]*class="[^"]*egw_content_wrapper[^"]*"[^>]*data-refcode="DA\s+([^"]+)"[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  let count = 0;
  while ((match = regex.exec(html)) !== null && count < 5) {
    const pageRef = match[1];
    const text = cleanHtml(match[2]);
    console.log(`[DA ${pageRef}] ${text.slice(0, 110)}...`);
    count++;
  }
}

testScrape().catch(console.error);
