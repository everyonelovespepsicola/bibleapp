import React from 'react';
import { Copy, Check, AlignLeft, List } from 'lucide-react';
import type { Verse } from '../types/bible';
import { renderFormattedText, copyRichScripture } from '../utils/clipboard';

interface ChapterReaderProps {
  bookName: string;
  chapterNumber: number;
  verses: Verse[];
  highlightRange?: { start?: number; end?: number };
  onPrevChapter?: () => void;
  onNextChapter?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({
  bookName,
  chapterNumber,
  verses,
  highlightRange,
  onPrevChapter,
  onNextChapter,
  hasPrev,
  hasNext,
}) => {
  const [copiedVerse, setCopiedVerse] = React.useState<number | null>(null);
  const [layoutMode, setLayoutMode] = React.useState<'paragraph' | 'verse'>('paragraph');

  const copySingleVerse = async (verseNum: number, text: string) => {
    await copyRichScripture(`${bookName} ${chapterNumber}:${verseNum}`, [
      { verse: verseNum, text },
    ]);
    setCopiedVerse(verseNum);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const copyWholePassage = async () => {
    await copyRichScripture(
      `${bookName} Chapter ${chapterNumber}`,
      verses.map((v) => ({ verse: v.verse, text: v.text }))
    );
    alert('Copied entire chapter with rich formatting (ready to paste into PowerPoint, Word, or Notes)!');
  };

  // Group verses into paragraphs based on isParagraphStart
  const paragraphs: Verse[][] = [];
  let currentParagraph: Verse[] = [];

  verses.forEach((v, idx) => {
    if (v.isParagraphStart && idx > 0 && currentParagraph.length > 0) {
      paragraphs.push(currentParagraph);
      currentParagraph = [v];
    } else {
      currentParagraph.push(v);
    }
  });
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph);
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6">
      {/* Chapter Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
            Holy Scripture
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight mt-1">
            {bookName} <span className="text-amber-400 font-normal">{chapterNumber}</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Paragraph vs Verse View Toggle */}
          <div className="flex bg-slate-800/90 p-0.5 rounded-xl border border-slate-700/80 text-xs">
            <button
              onClick={() => setLayoutMode('paragraph')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition font-medium ${
                layoutMode === 'paragraph'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Paragraph narrative view"
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Paragraphs</span>
            </button>
            <button
              onClick={() => setLayoutMode('verse')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition font-medium ${
                layoutMode === 'verse'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Verse-by-verse list view"
            >
              <List className="w-3.5 h-3.5" />
              <span>Verses</span>
            </button>
          </div>

          <button
            onClick={copyWholePassage}
            className="text-xs flex items-center space-x-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 rounded-xl transition border border-slate-700/60"
            title="Copy Chapter for PowerPoint/Word"
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" />
            <span>Copy All</span>
          </button>
        </div>
      </div>

      {/* Render: Paragraph Flow Mode */}
      {layoutMode === 'paragraph' ? (
        <div className="space-y-6 font-serif text-[1.15rem] leading-[2.1] text-slate-200">
          {paragraphs.map((para, pIdx) => (
            <p key={pIdx} className="indent-6 sm:indent-8 text-justify">
              {para.map((v) => {
                const isHighlighted =
                  highlightRange?.start !== undefined &&
                  v.verse >= highlightRange.start &&
                  v.verse <= (highlightRange.end ?? highlightRange.start);

                return (
                  <span
                    key={v.verse}
                    id={`verse-${v.verse}`}
                    onClick={() => copySingleVerse(v.verse, v.text)}
                    className={`inline group cursor-pointer transition rounded px-1 py-0.5 ${
                      isHighlighted
                        ? 'bg-amber-500/20 text-amber-200 font-medium ring-1 ring-amber-400/40'
                        : 'hover:bg-slate-800/70'
                    }`}
                    title={`Click to copy ${bookName} ${chapterNumber}:${v.verse} for PowerPoint/Word`}
                  >
                    <sup className="text-xs font-sans font-bold text-amber-400/80 mr-1 select-none">
                      {v.verse}
                    </sup>
                    <span>{renderFormattedText(v.text)} </span>
                  </span>
                );
              })}
            </p>
          ))}
        </div>
      ) : (
        /* Render: Verse-by-Verse Mode */
        <div className="space-y-3 font-serif text-lg leading-relaxed text-slate-200">
          {verses.map((v) => {
            const isHighlighted =
              highlightRange?.start !== undefined &&
              v.verse >= highlightRange.start &&
              v.verse <= (highlightRange.end ?? highlightRange.start);

            return (
              <div
                key={v.verse}
                id={`verse-${v.verse}`}
                className={`group flex items-baseline gap-3 p-2.5 rounded-xl transition duration-150 relative ${
                  isHighlighted
                    ? 'bg-amber-500/15 border-l-4 border-amber-400 shadow-sm'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <span className="text-xs font-sans font-bold text-amber-400/80 select-none w-6 text-right flex-shrink-0">
                  {v.verse}
                </span>
                <p className="flex-1 text-slate-100 text-[1.12rem] leading-8 font-serif selection:bg-amber-400 selection:text-slate-950">
                  {renderFormattedText(v.text)}
                </p>

                <button
                  onClick={() => copySingleVerse(v.verse, v.text)}
                  className="opacity-0 group-hover:opacity-100 transition p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 absolute right-2 top-2"
                  title="Copy verse (PowerPoint/Word rich text)"
                >
                  {copiedVerse === v.verse ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation bottom */}
      <div className="flex items-center justify-between border-t border-slate-800 mt-12 pt-6">
        <button
          disabled={!hasPrev}
          onClick={onPrevChapter}
          className={`px-4 py-2 text-sm rounded-xl border border-slate-800 font-medium transition ${
            hasPrev
              ? 'text-slate-200 hover:bg-slate-800 hover:border-slate-700 cursor-pointer'
              : 'text-slate-600 opacity-40 cursor-not-allowed'
          }`}
        >
          ← Previous Chapter
        </button>

        <span className="text-xs text-slate-500 font-sans">
          {bookName} {chapterNumber} • {paragraphs.length} paragraphs • {verses.length} verses
        </span>

        <button
          disabled={!hasNext}
          onClick={onNextChapter}
          className={`px-4 py-2 text-sm rounded-xl border border-slate-800 font-medium transition ${
            hasNext
              ? 'text-slate-200 hover:bg-slate-800 hover:border-slate-700 cursor-pointer'
              : 'text-slate-600 opacity-40 cursor-not-allowed'
          }`}
        >
          Next Chapter →
        </button>
      </div>
    </div>
  );
};
