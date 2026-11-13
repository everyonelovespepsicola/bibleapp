# ScriptureFlow Bible App

A high-performance modern Bible web application built with **React**, **TypeScript**, **Tailwind CSS**, and **IndexedDB** for offline reading. Designed to handle versatile JSON formats, complex verse range queries (such as `john 3:4-10` or `john 3 4-10`), full-text keyword searches, and rich paragraph/narrative reading modes.

- **Live Web App on GitHub Pages:** [https://everyonelovespepsicola.github.io/bibleapp/](https://everyonelovespepsicola.github.io/bibleapp/)
- **GitHub Repository:** [https://github.com/everyonelovespepsicola/bibleapp](https://github.com/everyonelovespepsicola/bibleapp)

---

## Bundled Public Domain Translations & Sources

All preloaded translations in ScriptureFlow are in the **Public Domain**, free of copyright restrictions, and enriched with **canonical paragraph break markers**:

| Translation | Abbr | Description | Source & Attribution |
| :--- | :--- | :--- | :--- |
| **King James Version** (1611/1769) | **KJV** | The historic Authorized Version in traditional English, enriched with 4,250+ canonical pilcrow paragraph break markers. | • Base text: [thiagobodruk/bible](https://github.com/thiagobodruk/bible)<br>• Paragraph Markers: [renniemaharaj/kjv-bible](https://github.com/renniemaharaj/kjv-bible) |
| **World English Bible** | **WEB** | Modern English public domain translation by Rainbow Missions / eBible.org, formatted with natural narrative paragraphs & poetry stanzas. | • Source: [eBible.org](https://ebible.org/web/)<br>• Structured USFM-to-JSON: [TehShrike/world-english-bible](https://github.com/TehShrike/world-english-bible) |

---

## Other Notable Public Domain Bibles with Paragraph / Format Data

If you wish to import additional public domain translations via the **"Import JSON"** button, here are high-quality open repositories:

1. **American Standard Version (1901) - ASV**
   - The classic literal American translation based on the 1881 Revised Version.
   - Sources:
     - [Bolls Life Translation API & Static Dumps](https://bolls.life/static/translations/ASV.json)
     - [eBible.org ASV USFM Sources](https://ebible.org/asv/)
2. **Young's Literal Translation (1862/1898) - YLT**
   - Extremely strict word-for-word translation reflecting original Hebrew and Greek tenses.
   - Sources:
     - [Bolls Life YLT Data](https://bolls.life/static/translations/YLT.json)
     - [Scrollmapper Bible Databases](https://github.com/scrollmapper/bible_databases)
3. **Cambridge Paragraph Bible (Scrivener 1873)**
   - The definitive 19th-century critical arrangement of the KJV text into natural paragraphs, poetry lines, and prose blocks.
   - Source: [DannyCarlton/xmlBible.org](https://github.com/DannyCarlton/xmlBible.org)
4. **Enhanced World English Bible (WEB Enhanced)**
   - Includes Strong's concordance numbers and cross-references.
   - Source: [DaveWyborn/scripture-scribbles](https://github.com/DaveWyborn/scripture-scribbles)

---

## Features

1. **Smart Verse Range Search**:
   - Parses colon syntax: `John 3:4-10`, `Gen 1:1-5`, `1 John 1:9`
   - Parses space syntax: `John 3 4-10`, `John 3 16`
   - Whole chapter queries: `Psalm 23`, `Romans 8`
2. **Full-Text Keyword Search**:
   - Search phrases across the entire Bible (e.g. `light world`, `faith hope love`).
3. **Paragraph vs. Verse-by-Verse Layout Toggle**:
   - **Paragraph Mode (Default)**: Renders scripture in natural indented reading paragraphs with subtle superscript verse numbers.
   - **Verses Mode**: Clean line-by-line format for studying and comparing individual verses.
4. **Universal JSON Importer ("Absorb JSON")**:
   - Drag and drop or browse any Bible JSON file.
   - Auto-detects hierarchical schemas (`{ books: [...] }`), array schemas (`[ { name, chapters: [...] } ]`), flat verse lists, and pilcrow paragraph markers (`¶`).
5. **Instant Local Storage (Offline Ready)**:
   - Uses browser **IndexedDB** so translations and preferences persist locally without requiring any external server.

---

## Development & Publishing

### Test locally
```bash
npm install
npm run dev
```

### Build & Publish
Automated dependency inspection, winget installation, and production bundling:
```powershell
.\publish.ps1
```

### Automated GitHub Pages Deployment
Every push to `main` automatically runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml) and publishes the site to GitHub Pages.
