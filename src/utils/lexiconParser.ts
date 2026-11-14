/**
 * Parses and annotates Strong's lexicon entries with:
 * 1. Derivation / Etymology & Spelling Variants breakdown
 * 2. Clean Numbered Outline of Biblical Meanings / Definitions
 * 3. KJV Translation Context Occurrences (cleans [phrase], [idiom], (+ -out), etc.)
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

  // 1. Separate definition part from translation usage list
  let defPart = desc;
  let usagePart: string | null = null;

  const explicitSplit = desc.split(/(?:\s*:--|:--|\s*--)\s*/);
  if (explicitSplit.length > 1) {
    defPart = explicitSplit[0].trim();
    usagePart = explicitSplit.slice(1).join('; ').trim();
  } else {
    // In Hebrew entries without ':--', translation lists often begin after definition with [phrase] or [idiom]
    const clauses = desc.split(';').map((c) => c.trim());
    let splitIdx = -1;
    for (let i = 0; i < clauses.length; i++) {
      if (/\[phrase\]|\[idiom\]/i.test(clauses[i])) {
        splitIdx = i;
        break;
      }
    }
    if (splitIdx !== -1) {
      defPart = clauses.slice(0, splitIdx).join('; ').trim();
      usagePart = clauses.slice(splitIdx).join('; ').trim();
    }
  }

  // 2. Identify etymology/origin/spelling-variant clauses vs actual definition
  // Clauses at the start can be:
  // - 'or (Isaiah 21:11) לֵיל'
  // - 'also לַיְלָה'
  // - 'from the same as לוּל'
  // - 'from an unused root meaning to be hot'
  // - 'a primitive word'
  const rawClauses = defPart.split(';').map((c) => c.trim()).filter(Boolean);
  const etymologyClauses: string[] = [];
  const definitionClauses: string[] = [];

  let stillInEtymology = true;
  for (let i = 0; i < rawClauses.length; i++) {
    const c = rawClauses[i];
    const isEtym = /^(or\s*\(|also\s+|from\s+|of\s+|a\s+primitive|a\s+primary|prolonged\s+from|apparently\s+a\s+primary|by\s+contraction|active\s+participle|feminine\s+of|masculine\s+of|plural\s+of|perhaps\s+from)/i.test(
      c
    );

    if (stillInEtymology && isEtym) {
      etymologyClauses.push(c);
    } else {
      stillInEtymology = false;
      definitionClauses.push(c);
    }
  }

  const outlinePoints =
    definitionClauses.length > 0 ? definitionClauses : rawClauses;
  const derivation =
    etymologyClauses.length > 0 ? etymologyClauses.join('; ') : null;
  const fullDefinition = outlinePoints.join('; ');

  // 3. Parse and clean KJV translation occurrences chips
  const kjvChips: string[] = [];
  if (usagePart) {
    const cleanStr = usagePart
      .replace(/\[phrase\]/gi, '')
      .replace(/\[idiom\]/gi, '')
      .replace(/\bOften used in composition[\s\S]*/i, '')
      .replace(/Compare [^.]*\.?/gi, '');

    const tokens = cleanStr.split(/,\s*/);
    for (const t of tokens) {
      let clean = t
        .replace(/[+X]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      // Clean dangling unclosed parentheses
      if (clean.startsWith('(') && !clean.includes(')')) clean = clean.slice(1);
      if (clean.endsWith(')') && !clean.includes('(')) clean = clean.slice(0, -1);
      clean = clean.replace(/\(\s*\)/g, '').trim();

      if (clean && clean.length > 0 && !kjvChips.includes(clean)) {
        kjvChips.push(clean);
      }
    }
  }

  return {
    derivation,
    outlinePoints,
    fullDefinition,
    kjvUsage: usagePart,
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
