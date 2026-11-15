import https from 'https';

const liveBase = 'https://everyonelovespepsicola.github.io/bibleapp/';

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed ${url}: HTTP ${res.statusCode}`));
      }
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e: any) {
          reject(new Error(`JSON parse error from ${url}: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

export async function testLiveSiteEgwIndex(): Promise<{
  uniqueVerses: number;
  sampleVersesFound: Record<string, number>;
}> {
  const index = await fetchJson(liveBase + 'egw/egw_verse_index.json');
  const samples = ['Genesis 1:1', 'John 3:16', 'Matthew 1:23', 'Romans 8:28'];
  const sampleVersesFound: Record<string, number> = {};
  samples.forEach((ref) => {
    sampleVersesFound[ref] = index[ref] ? index[ref].length : 0;
  });
  return {
    uniqueVerses: Object.keys(index).length,
    sampleVersesFound,
  };
}

export async function testLiveBookAvailability(bookCode: string): Promise<{
  status: number;
  title: string;
  year: number;
  chaptersCount: number;
}> {
  const data = await fetchJson(`${liveBase}egw/books/${bookCode}.json`);
  return {
    status: 200,
    title: data.title,
    year: data.year,
    chaptersCount: data.chapters ? data.chapters.length : 0,
  };
}

