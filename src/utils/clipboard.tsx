import React from 'react';

/**
 * Parses markdown italics like `*word*` into:
 * 1. React elements with <i> tags for display
 * 2. HTML string `<i>word</i>` for PowerPoint/Word clipboard
 * 3. Clean plain text without asterisks for standard clipboard
 */

export function renderFormattedText(text: string): React.ReactNode {
  if (!text.includes('*')) {
    return text;
  }

  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={index} className="italic text-slate-100 font-serif not-italic-markers">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
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
