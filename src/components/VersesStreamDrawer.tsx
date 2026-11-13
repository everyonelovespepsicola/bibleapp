import React, { useState, useMemo } from 'react';
import type { FlatVerse } from '../types/bible';
import { renderFormattedText, copyRichScripture } from '../utils/clipboard';
import {
  Copy,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowRightLeft,
} from 'lucide-react';

interface VersesStreamDrawerProps {
  strongsId: string;
  selectedWord: string;
  verses: FlatVerse[];
  onSelectVerse: (verse: FlatVerse) => void;
  onFlipBackToScriptureFirst: () => void;
  onClose?: () => void;
}

const PAGE_SIZE = 50; // Snappy side-drawer pagination

export const VersesStreamDrawer: React.FC<VersesStreamDrawerProps> = ({
  strongsId,
  selectedWord,
  verses,
  onSelectVerse,
  onFlipBackToScriptureFirst,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalVerses = verses.length;
  const totalPages = Math.max(1, Math.ceil(totalVerses / PAGE_SIZE));

  const paginatedVerses = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return verses.slice(start, start + PAGE_SIZE);
  }, [verses, currentPage]);

  const copyVerse = async (verse: FlatVerse) => {
    await copyRichScripture(verse.reference, [
      { verse: verse.verse, text: verse.text },
    ]);
    alert(`Copied ${verse.reference} with formatting!`);
  };

  const copyAll = async () => {
    await copyRichScripture(
      `All Verses with Strong's ${strongsId} (${selectedWord})`,
      verses.map((v) => ({ verse: v.verse, text: v.text }))
    );
    alert(`Copied all ${totalVerses} verses with formatting!`);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {strongsId}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {totalVerses.toLocaleString()} {totalVerses === 1 ? 'verse' : 'verses'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Bible occurrences for "{selectedWord || strongsId}"
          </p>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={copyAll}
            className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition"
            title="Copy all matching verses"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onFlipBackToScriptureFirst}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-lg transition border border-slate-700"
            title="Flip back to Scripture on Left, Lexicon on Right"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Flip Back</span>
          </button>
        </div>
      </div>

      {/* Verses Scroll Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {totalVerses === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No verses found for {strongsId}
          </div>
        ) : (
          paginatedVerses.map((v, idx) => (
            <div
              key={`${v.reference}-${idx}`}
              className="bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 p-3.5 rounded-xl transition duration-150 space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onSelectVerse(v)}
                  className="text-amber-400 hover:text-amber-300 font-semibold text-xs hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>{v.reference}</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-amber-300">→</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => copyVerse(v)}
                    className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 transition"
                    title="Copy verse"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onSelectVerse(v)}
                    className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded transition"
                  >
                    Read
                  </button>
                </div>
              </div>

              <p className="font-serif text-slate-300 text-xs sm:text-sm leading-relaxed">
                {renderFormattedText(v.text)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-1.5 rounded-lg border border-slate-800 transition ${
              currentPage === 1
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-slate-800 hover:text-amber-400 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span>
            Page <strong className="text-slate-200">{currentPage}</strong> of{' '}
            <strong className="text-slate-200">{totalPages}</strong>
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`p-1.5 rounded-lg border border-slate-800 transition ${
              currentPage === totalPages
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-slate-800 hover:text-amber-400 cursor-pointer'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
