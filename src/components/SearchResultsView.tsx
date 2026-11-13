import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { SearchResult } from '../utils/searchEngine';
import type { FlatVerse } from '../types/bible';
import {
  Copy,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { renderFormattedText, copyRichScripture } from '../utils/clipboard';

interface SearchResultsViewProps {
  result: SearchResult;
  onSelectVerse: (verse: FlatVerse) => void;
  onBackToReader?: () => void;
  rawQuery?: string;
  previousLocation?: {
    bookName: string;
    chapter: number;
  };
}

const PAGE_SIZE = 250; // Verses per page

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  result,
  onSelectVerse,
  onBackToReader,
  previousLocation,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);

  // Reset to page 1 whenever the query / search result changes
  useEffect(() => {
    setCurrentPage(1);
  }, [result.title, result.count]);

  const totalVerses = result.verses.length;
  const totalPages = Math.max(1, Math.ceil(totalVerses / PAGE_SIZE));

  const paginatedVerses = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return result.verses.slice(start, start + PAGE_SIZE);
  }, [result.verses, currentPage]);

  const copyVerse = async (verse: FlatVerse) => {
    await copyRichScripture(verse.reference, [
      { verse: verse.verse, text: verse.text },
    ]);
    alert(`Copied ${verse.reference} with formatting (ready to paste in PowerPoint/Word)!`);
  };

  const copyAllResults = async () => {
    await copyRichScripture(
      result.title,
      result.verses.map((v) => ({ verse: v.verse, text: v.text }))
    );
    alert(`Copied all ${result.verses.length} verses with formatting to clipboard!`);
  };

  const copyCurrentPageResults = async () => {
    await copyRichScripture(
      `${result.title} (Page ${currentPage} of ${totalPages})`,
      paginatedVerses.map((v) => ({ verse: v.verse, text: v.text }))
    );
    alert(`Copied page ${currentPage} (${paginatedVerses.length} verses) with formatting!`);
  };

  const handlePageChange = (page: number) => {
    const target = Math.max(1, Math.min(totalPages, page));
    if (target !== currentPage) {
      setCurrentPage(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Percentage along track for the floating indicator (0% to 100%)
  const progressPercent = totalPages > 1
    ? ((currentPage - 1) / (totalPages - 1)) * 100
    : 0;

  // Selected landmark pages (e.g., 1, 25%, 50%, 75%, 100%)
  const landmarkPages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const step = Math.floor(totalPages / 6) || 1;
    const marks: number[] = [1];
    for (let p = step; p < totalPages; p += step) {
      if (!marks.includes(p)) marks.push(p);
    }
    if (!marks.includes(totalPages)) marks.push(totalPages);
    return marks;
  }, [totalPages]);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      {/* Return to Scripture Banner Button */}
      {onBackToReader && (
        <div className="mb-4">
          <button
            onClick={onBackToReader}
            className="inline-flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-semibold transition border border-slate-750 shadow-md cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>
              Return to {previousLocation ? `${previousLocation.bookName} ${previousLocation.chapter}` : 'Scripture Reader'}
            </span>
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-6 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                result.type === 'reference'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}
            >
              {result.type === 'reference' ? 'Passage / Range Match' : 'Concordance / Keyword Search'}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {totalVerses.toLocaleString()} {totalVerses === 1 ? 'verse' : 'verses'} found
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-100 mt-1">
            {result.title}
          </h2>
          {totalPages > 1 && (
            <p className="text-xs text-slate-500 mt-0.5">
              Showing verses {((currentPage - 1) * PAGE_SIZE + 1).toLocaleString()} -{' '}
              {Math.min(currentPage * PAGE_SIZE, totalVerses).toLocaleString()} of {totalVerses.toLocaleString()}
            </p>
          )}
        </div>

        {totalVerses > 0 && (
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            {totalPages > 1 && (
              <button
                onClick={copyCurrentPageResults}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition border border-slate-700"
                title="Copy current page verses"
              >
                <Copy className="w-3.5 h-3.5 text-sky-400" />
                <span>Copy Page</span>
              </button>
            )}
            <button
              onClick={copyAllResults}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition border border-slate-700"
              title="Copy all matching verses across all pages for PowerPoint/Word"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>Copy All ({totalVerses.toLocaleString()})</span>
            </button>
          </div>
        )}
      </div>

      {totalVerses === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800/80">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-medium text-slate-300">No verses found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try searching with references like "John 3:16", "John 3:4-10", "John 3 4-10", a Strong's number like "H7225", or words like "grace love".
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {paginatedVerses.map((v, idx) => (
            <div
              key={`${v.reference}-${idx}`}
              className="group bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition duration-150 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1.5">
                  <button
                    onClick={() => onSelectVerse(v)}
                    className="text-amber-400 hover:text-amber-300 font-semibold text-sm hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{v.reference}</span>
                  </button>
                </div>
                <p className="font-serif text-slate-200 text-base leading-relaxed">
                  {renderFormattedText(v.text)}
                </p>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-start flex-shrink-0">
                <button
                  onClick={() => onSelectVerse(v)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-lg transition"
                >
                  View in Chapter
                </button>
                <button
                  onClick={() => copyVerse(v)}
                  className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition"
                  title="Copy verse for PowerPoint/Word"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Unified Sleek Integrated Slider & Track-Riding Number Rail */}
          {totalPages > 1 && (
            <div className="pt-10 pb-14 max-w-2xl mx-auto w-full px-2">
              <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-5">
                
                {/* Header of Rail Controller */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-slate-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>Concordance Navigator</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-400">Jump to:</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) handlePageChange(val);
                      }}
                      className="w-14 px-2 py-1 bg-slate-800/90 border border-slate-700 rounded-lg text-xs font-bold text-amber-400 text-center focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="text-slate-500 text-xs font-semibold">of {totalPages.toLocaleString()}</span>
                  </div>
                </div>

                {/* The Integrated Rail with Live Floating Badge Riding on Top */}
                <div className="relative pt-7 pb-2 px-3" ref={trackRef}>
                  {/* Floating Thumb Badge that directly rides the rail */}
                  <div
                    className="absolute top-0 -translate-x-1/2 transition-all duration-75 pointer-events-none z-20 flex flex-col items-center"
                    style={{ left: `calc(${progressPercent}% + ${12 - progressPercent * 0.24}px)` }}
                  >
                    <div className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs rounded-full shadow-lg shadow-amber-500/30 whitespace-nowrap border border-amber-300 flex items-center gap-1 scale-105">
                      <span>p.{currentPage}</span>
                    </div>
                    {/* Tiny downward arrow indicator */}
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-amber-500 -mt-0.5" />
                  </div>

                  {/* Track Bar Container */}
                  <div className="relative w-full h-3 bg-slate-800/90 rounded-full border border-slate-700/60 overflow-hidden flex items-center">
                    {/* Active Golden Progress Fill */}
                    <div
                      className="h-full bg-gradient-to-r from-amber-500/80 to-amber-400 rounded-full transition-all duration-75"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* HTML Range Input Overlay for 100% Native Touch and Drag Dragging */}
                  <input
                    type="range"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => handlePageChange(parseInt(e.target.value, 10))}
                    className="absolute top-7 left-3 right-3 w-[calc(100%-24px)] h-3 opacity-0 cursor-pointer z-30"
                    title={`Slide anywhere from page 1 to ${totalPages}`}
                  />

                  {/* Landmark Numbers Stationed Along the Rail */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-2.5 px-0.5 select-none">
                    {landmarkPages.map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`hover:text-amber-400 transition cursor-pointer font-semibold ${
                          pageNum === currentPage ? 'text-amber-400 font-bold scale-110' : ''
                        }`}
                        title={`Jump to page ${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Controls Bar: First, Prev, Step, Next, Last */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition border border-slate-800 ${
                        currentPage === 1
                          ? 'text-slate-600 border-transparent cursor-not-allowed'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-amber-400 cursor-pointer'
                      }`}
                      title="First Page"
                    >
                      <ChevronsLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">First</span>
                    </button>

                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border border-slate-800 ${
                        currentPage === 1
                          ? 'text-slate-600 border-transparent cursor-not-allowed'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-amber-400 cursor-pointer'
                      }`}
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-400 font-medium">
                    Showing <strong className="text-slate-200">{((currentPage - 1) * PAGE_SIZE + 1).toLocaleString()}</strong> -{' '}
                    <strong className="text-slate-200">{Math.min(currentPage * PAGE_SIZE, totalVerses).toLocaleString()}</strong>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border border-slate-800 ${
                        currentPage === totalPages
                          ? 'text-slate-600 border-transparent cursor-not-allowed'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-amber-400 cursor-pointer'
                      }`}
                      title="Next Page"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition border border-slate-800 ${
                        currentPage === totalPages
                          ? 'text-slate-600 border-transparent cursor-not-allowed'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-amber-400 cursor-pointer'
                      }`}
                      title="Last Page"
                    >
                      <span className="hidden sm:inline">Last</span>
                      <ChevronsRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
