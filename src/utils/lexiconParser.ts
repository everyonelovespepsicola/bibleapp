/**
 * Parses and annotates Strong's lexicon entries with:
 * 1. Derivation / Etymology breakdown
 * 2. Numbered Outline of Biblical Usage / Definitions
 * 3. KJV Translation usages
 * 4. Interactive tokenization linking both Greek/Hebrew words and Strong's IDs (e.g. G575, H7218)
 */

export interface ParsedLexicon {
  derivation: string | null;
  outlinePoints: string[];
  fullDefinition: string;
  kjvUsage: string | null;
  kjvChips: string[];
}

export interface LexiconToken {
  type: 'text' | 'strongs_id' | 'greek_word' | 'hebrew_word';
  text: string;
  strongsId?: string;
  isCurrent?: boolean;
}

// Maps built lazily from the lexicon dataset
let greekLemmaMap: Map<string, string> | null = null;
let hebrewLemmaMap: Map<string, string> | null = null;

function normalizeGreek(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function normalizeHebrew(text: string): string {
  return text.replace(/[\u0591-\u05C7]/g, '').trim();
}

/**
 * Initialize word-to-Strong's lookup maps for Greek and Hebrew
 */
export function initLexiconWordMaps(lexicon: Record<string, { lemma: string }>) {
  if (greekLemmaMap && hebrewLemmaMap) return;

  greekLemmaMap = new Map();
  hebrewLemmaMap = new Map();

  for (const key in lexicon) {
    const item = lexicon[key];
    if (!item?.lemma) continue;

    if (key.startsWith('G')) {
      const raw = item.lemma.trim();
      const clean = normalizeGreek(raw);
      if (!greekLemmaMap.has(raw)) greekLemmaMap.set(raw, key);
      if (!greekLemmaMap.has(clean)) greekLemmaMap.set(clean, key);
    } else if (key.startsWith('H')) {
      const raw = item.lemma.trim();
      const clean = normalizeHebrew(raw);
      if (!hebrewLemmaMap.has(raw)) hebrewLemmaMap.set(raw, key);
      if (!hebrewLemmaMap.has(clean)) hebrewLemmaMap.set(clean, key);
    }
  }
}

/**
 * Parses a raw description string into structured sections
 */
export function parseLexiconDescription(description: string): ParsedLexicon {
  const desc = description || '';
  const parts = desc.split(/(?:\s*:--|:--|\s*--)\s*/);
  const mainPart = parts[0].trim();
  const kjvPart = parts.length > 1 ? parts.slice(1).join('; ').trim() : null;

  let derivation: string | null = null;
  let remainingDef = mainPart;

  const semi = mainPart.indexOf(';');
  if (semi !== -1 && semi < 120) {
    const candidate = mainPart.substring(0, semi).trim();
    if (
      /^(from|of|a primitive|a primary|prolonged from|apparently a primary|by contraction|active participle|feminine of|masculine of|plural of|perhaps from)/i.test(
        candidate
      )
    ) {
      derivation = candidate;
      remainingDef = mainPart.substring(semi + 1).trim();
    }
  }

  // Generate numbered outline points
  const rawPoints = remainingDef
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean);
  const outlinePoints = rawPoints.length > 0 ? rawPoints : [remainingDef];

  // Parse KJV translation chips
  const kjvChips: string[] = [];
  if (kjvPart) {
    const cleanStr = kjvPart
      .replace(/\bOften used in composition[\s\S]*/i, '')
      .replace(/Compare [^.]*\.?/gi, '');
    const tokens = cleanStr.split(/,\s*/);
    for (const t of tokens) {
      const clean = t.replace(/[+X]/g, '').trim();
      if (clean && clean.length > 0 && !kjvChips.includes(clean)) {
        kjvChips.push(clean);
      }
    }
  }

  return {
    derivation,
    outlinePoints,
    fullDefinition: remainingDef,
    kjvUsage: kjvPart,
    kjvChips,
  };
}

/**
 * Tokenizes text into plain text and clickable Strong's numbers or Greek/Hebrew words
 */
export function tokenizeLexiconText(
  text: string,
  currentStrongsId?: string
): LexiconToken[] {
  if (!text) return [];

  // Match:
  // 1. Strong's IDs: [HG]\d{1,5}
  // 2. Greek words: [\u0370-\u03FF\u1F00-\u1FFF]+
  // 3. Hebrew words: [\u0590-\u05FF]+
  const tokenRegex = /([HG]\d{1,5})|([\u0370-\u03FF\u1F00-\u1FFF]+)|([\u0590-\u05FF]+)/g;
  let lastIdx = 0;
  const tokens: LexiconToken[] = [];
  let m: RegExpExecArray | null;

  const curUpper = currentStrongsId ? currentStrongsId.toUpperCase() : '';

  while ((m = tokenRegex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      tokens.push({ type: 'text', text: text.slice(lastIdx, m.index) });
    }

    if (m[1]) {
      const sid = m[1].toUpperCase();
      tokens.push({
        type: 'strongs_id',
        text: m[1],
        strongsId: sid,
        isCurrent: sid === curUpper,
      });
    } else if (m[2]) {
      const gWord = m[2];
      const sid =
        greekLemmaMap?.get(gWord) || greekLemmaMap?.get(normalizeGreek(gWord));
      if (sid && sid.toUpperCase() !== curUpper) {
        tokens.push({
          type: 'greek_word',
          text: gWord,
          strongsId: sid,
        });
      } else {
        tokens.push({ type: 'text', text: gWord });
      }
    } else if (m[3]) {
      const hWord = m[3];
      const sid =
        hebrewLemmaMap?.get(hWord) || hebrewLemmaMap?.get(normalizeHebrew(hWord));
      if (sid && sid.toUpperCase() !== curUpper) {
        tokens.push({
          type: 'hebrew_word',
          text: hWord,
          strongsId: sid,
        });
      } else {
        tokens.push({ type: 'text', text: hWord });
      }
    }

    lastIdx = tokenRegex.lastIndex;
  }

  if (lastIdx < text.length) {
    tokens.push({ type: 'text', text: text.slice(lastIdx) });
  }

  return tokens;
}
