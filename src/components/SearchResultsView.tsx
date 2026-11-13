import React, { useState, useEffect, useMemo } from 'react';
import type { SearchResult } from '../utils/searchEngine';
import type { FlatVerse } from '../types/bible';
import { Copy, BookOpen, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { renderFormattedText, copyRichScripture } from '../utils/clipboard';

interface SearchResultsViewProps {
  result: SearchResult;
  onSelectVerse: (verse: FlatVerse) => void;
  rawQuery?: string;
}

const PAGE_SIZE = 25; // Verses per page, snappy and easy to read

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  result,
  onSelectVerse,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

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
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Google-style pagination window: e.g. [1, 2, 3, 4, 5, '...', 45, 46, 47]
  const paginationRange = useMemo(() => {
    const delta = 2; // how many pages on each side of currentPage
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (typeof i === 'number') {
        if (l !== undefined) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }
    }

    return rangeWithDots;
  }, [totalPages, currentPage]);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
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

          {/* Google-Style Pagination Footer */}
          {totalPages > 1 && (
            <div className="pt-8 pb-12 flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto max-w-full">
                {/* First Page Button */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-xl text-xs font-medium transition flex items-center ${
                    currentPage === 1
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-amber-400 cursor-pointer'
                  }`}
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    currentPage === 1
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-amber-400 cursor-pointer'
                  }`}
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Numbered Page Buttons with Dots */}
                <div className="flex items-center space-x-1">
                  {paginationRange.map((item, index) => {
                    if (item === '...') {
                      return (
                        <span
                          key={`dots-${index}`}
                          className="px-2 py-1 text-slate-600 text-xs font-bold tracking-widest select-none"
                        >
                          …
                        </span>
                      );
                    }

                    const pageNum = item as number;
                    const isCurrent = pageNum === currentPage;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`min-w-8 h-8 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-extrabold scale-105'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-amber-400'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    currentPage === totalPages
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-amber-400 cursor-pointer'
                  }`}
                  title="Next Page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page Button */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-xl text-xs font-medium transition flex items-center ${
                    currentPage === totalPages
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-amber-400 cursor-pointer'
                  }`}
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-500">
                Page <span className="text-slate-300 font-bold">{currentPage}</span> of{' '}
                <span className="text-slate-300 font-bold">{totalPages.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
