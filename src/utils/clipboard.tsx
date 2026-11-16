import React from 'react';

/**
 * Escapes regex special characters.
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extracts searchable terms from a query string.
 * Filters out single letters, digits, and punctuation.
 */
export function extractSearchTerms(query: string): string[] {
  if (!query || !query.trim()) return [];

  // Ignore Strong's references e.g. "H7225", "G3056" as word highlight terms
  if (/^[HG]\d{1,5}$/i.test(query.trim())) {
    return [];
  }

  return query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.replace(/[^a-zA-Z0-9]/g, ''))
    .filter((term) => term.length >= 2);
}

/**
 * Renders text with optional search term highlighting and KJV translator italics (*word*).
 * Highlights words with a radiant golden glow mark.
 */
export function renderFormattedText(text: string, highlightQuery?: string): React.ReactNode {
  if (!text) return null;

  const terms = highlightQuery ? extractSearchTerms(highlightQuery) : [];

  // Helper to highlight terms inside a plain string chunk
  const highlightTermsInChunk = (chunk: string, keyPrefix: string): React.ReactNode => {
    if (terms.length === 0 || !chunk) return chunk;

    // Build regex matching whole word or word prefixes for terms
    const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
    const subParts = chunk.split(pattern);

    if (subParts.length === 1) return chunk;

    return subParts.map((subPart, subIdx) => {
      const isMatch = terms.some((t) => t.toLowerCase() === subPart.toLowerCase());
      if (isMatch) {
        return (
          <mark
            key={`${keyPrefix}-m-${subIdx}`}
            className="bg-amber-400/30 text-amber-200 font-semibold px-0.5 py-0.5 rounded border-b border-amber-400/80 shadow-xs"
          >
            {subPart}
          </mark>
        );
      }
      return subPart;
    });
  };

  if (!text.includes('*')) {
    return highlightTermsInChunk(text, 'plain');
  }

  // Handle *italic* text while also highlighting terms inside and outside italics
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const innerText = part.slice(1, -1);
      return (
        <em key={index} className="italic text-slate-100 font-serif not-italic-markers">
          {highlightTermsInChunk(innerText, `em-${index}`)}
        </em>
      );
    }
    return highlightTermsInChunk(part, `txt-${index}`);
  });
}

export function toHtmlFormatted(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '<i>$1</i>');
}

export function toCleanPlainText(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '$1');
}

/**
 * Copies both HTML (for PowerPoint, Word, Google Slides) and Plain text
 * to the clipboard using the modern Clipboard API.
 */
export async function copyRichScripture(
  referenceTitle: string,
  verses: { verse: number; text: string }[]
): Promise<void> {
  // 1. Generate Rich HTML for PowerPoint / Word
  let html = `<div style="font-family: Georgia, 'Times New Roman', serif; font-size: 16pt; color: #1e293b; line-height: 1.6;">`;
  html += `<p style="font-size: 18pt; font-weight: bold; margin-bottom: 12pt; color: #b45309;">${referenceTitle}</p>`;

  // Clean plain text version
  let plain = `${referenceTitle}\n\n`;

  verses.forEach((v) => {
    const verseHtmlText = toHtmlFormatted(v.text);
    const versePlainText = toCleanPlainText(v.text);

    html += `<p style="margin-bottom: 8pt;"><sup style="font-size: 10pt; font-weight: bold; color: #b45309;">${v.verse}</sup> ${verseHtmlText}</p>`;
    plain += `[${v.verse}] ${versePlainText}\n`;
  });
  html += `</div>`;

  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const blobHtml = new Blob([html], { type: 'text/html' });
      const blobText = new Blob([plain], { type: 'text/plain' });
      const item = new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText,
      });
      await navigator.clipboard.write([item]);
    } else {
      await navigator.clipboard.writeText(plain);
    }
  } catch (err) {
    // Fallback to text copy
    console.warn('ClipboardItem not supported or denied, falling back to writeText:', err);
    await navigator.clipboard.writeText(plain);
  }
}
