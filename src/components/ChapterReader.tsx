import React from 'react';
import { Copy, Check } from 'lucide-react';
import type { Verse } from '../types/bible';

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

  const copyToClipboard = (verseNum: number, text: string) => {
    const formatted = `${bookName} ${chapterNumber}:${verseNum} - "${text}"`;
    navigator.clipboard.writeText(formatted);
    setCopiedVerse(verseNum);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const copyWholePassage = () => {
    let passage = `${bookName} Chapter ${chapterNumber}\n\n`;
    verses.forEach((v) => {
      passage += `[${v.verse}] ${v.text}\n`;
    });
    navigator.clipboard.writeText(passage);
    alert('Passage copied to clipboard!');
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6">
      {/* Chapter Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
            Holy Scripture
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight mt-1">
            {bookName} <span className="text-amber-400 font-normal">{chapterNumber}</span>
          </h1>
        </div>

        <button
          onClick={copyWholePassage}
          className="text-xs flex items-center space-x-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 rounded-lg transition border border-slate-700/60"
          title="Copy Chapter"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy All</span>
        </button>
      </div>

      {/* Verses stream */}
      <div className="space-y-4 font-serif text-lg leading-relaxed text-slate-200">
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
                {v.text}
              </p>

              <button
                onClick={() => copyToClipboard(v.verse, v.text)}
                className="opacity-0 group-hover:opacity-100 transition p-1 text-slate-400 hover:text-amber-400 absolute right-2 top-2"
                title="Copy verse"
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
          {bookName} {chapterNumber} of {verses.length} verses
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
