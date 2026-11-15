import React, { useState, useEffect } from 'react';
import type { EgwChapterData } from '../types/egw';
import { getEgwChapter, getEgwChapterAsync } from '../utils/egwService';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bookmark,
  Library,
} from 'lucide-react';
import egwBookMetaRaw from '../utils/egwBookMeta.json';

interface EgwBookReaderViewProps {
  bookAbbrev: string;
  initialChapterNumber?: number;
  initialPageRef?: string;
  onBackToBible: () => void;
  onOpenLibrary: () => void;
}

export const EgwBookReaderView: React.FC<EgwBookReaderViewProps> = ({
  bookAbbrev,
  initialChapterNumber = 1,
  initialPageRef,
  onBackToBible,
  onOpenLibrary,
}) => {
  const [currentChapterNum, setCurrentChapterNum] = useState<number>(initialChapterNumber);
  const [activePageRef, setActivePageRef] = useState<string | undefined>(initialPageRef);
  const [chapterData, setChapterData] = useState<EgwChapterData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const meta = (egwBookMetaRaw as any)[bookAbbrev.toLowerCase()];
  const displayTitle = meta?.title || bookAbbrev.toUpperCase();

  // Load chapter data whenever currentChapterNum changes
  useEffect(() => {
    setIsLoading(true);
    let mounted = true;

    // 1. Immediate sync lookup
    const syncData = getEgwChapter(bookAbbrev, currentChapterNum, activePageRef);
    if (syncData) {
      setChapterData(syncData);
      setIsLoading(false);
    }

    // 2. Full async fetch
    getEgwChapterAsync(bookAbbrev, currentChapterNum, activePageRef).then((data) => {
      if (!mounted) return;
      if (data) {
        setChapterData(data);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [bookAbbrev, currentChapterNum]);

  // Smooth scroll to quoted paragraph if present
  useEffect(() => {
    if (!activePageRef) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`egw-reader-p-${activePageRef}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [activePageRef, currentChapterNum]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Top Header Navigation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBackToBible}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
            title="Return to Scripture Reader"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Bible</span>
          </button>

          <button
            onClick={onOpenLibrary}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 text-xs font-medium transition cursor-pointer"
            title="Browse other books in Library"
          >
            <Library className="w-3.5 h-3.5 text-amber-400" />
            <span>Library</span>
          </button>
        </div>

        {/* Book & Chapter Indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
            {bookAbbrev.toUpperCase()} • Ch. {currentChapterNum}
          </span>
        </div>
      </div>

      {/* Main Chapter Content Card */}
      {isLoading && !chapterData ? (
        <div className="py-20 text-center space-y-3">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-400" />
          <p className="text-sm text-slate-400">Loading {displayTitle}...</p>
        </div>
      ) : chapterData ? (
        <article className="space-y-6">
          {/* Chapter Title Banner */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-900/30 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <BookOpen className="w-4 h-4" />
              <span>{chapterData.bookTitle}</span>
              {meta?.year && <span className="text-slate-400">• {meta.year}</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 tracking-tight leading-tight">
              {chapterData.chapterTitle.toLowerCase().startsWith('chapter ') ||
              chapterData.chapterTitle.toLowerCase().startsWith('section ') ||
              chapterData.chapterTitle.toLowerCase().startsWith('foreword') ||
              chapterData.chapterTitle.toLowerCase().startsWith('preface')
                ? chapterData.chapterTitle
                : `Chapter ${chapterData.chapterNumber}: ${chapterData.chapterTitle}`}
            </h1>
          </div>

          {/* Paragraphs Stream */}
          <div className="space-y-6 font-serif text-[1.14rem] sm:text-[1.22rem] leading-[2.2] text-slate-200">
            {chapterData.paragraphs.map((p, idx) => {
              const isQuotedParagraph = activePageRef && p.pageRef === activePageRef;

              return (
                <div
                  key={idx}
                  id={`egw-reader-p-${p.pageRef}`}
                  className={`p-4 sm:p-5 rounded-2xl transition relative group ${
                    isQuotedParagraph
                      ? 'bg-amber-500/15 border-l-4 border-amber-400 shadow-lg text-amber-50'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  <p className="indent-6 sm:indent-10 text-justify">
                    {p.text}
                    <span className="ml-2.5 inline-block font-sans font-bold text-xs tracking-wide bg-slate-800/90 text-amber-400/90 px-2 py-0.5 rounded border border-slate-700/80 select-none">
                      {chapterData.bookAbbrev} {p.pageRef}
                    </span>
                  </p>

                  {isQuotedParagraph && (
                    <div className="flex items-center gap-1.5 mt-2.5 text-xs font-sans font-bold text-amber-400 uppercase tracking-wider select-none">
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Referenced Passage</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Chapter Pagination Controls */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-8 mt-10">
            <button
              disabled={!chapterData.prevChapter}
              onClick={() => {
                if (chapterData.prevChapter) {
                  setCurrentChapterNum(chapterData.prevChapter.number);
                  setActivePageRef(undefined);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-800 text-xs sm:text-sm font-medium transition ${
                chapterData.prevChapter
                  ? 'text-slate-200 hover:bg-slate-800 hover:border-slate-700 cursor-pointer'
                  : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">
                {chapterData.prevChapter ? chapterData.prevChapter.title : 'First Chapter'}
              </span>
              <span className="sm:hidden">Prev Chapter</span>
            </button>

            <span className="text-xs text-slate-500 font-sans">
              Ch. {chapterData.chapterNumber} • {chapterData.paragraphs.length} paragraphs
            </span>

            <button
              disabled={!chapterData.nextChapter}
              onClick={() => {
                if (chapterData.nextChapter) {
                  setCurrentChapterNum(chapterData.nextChapter.number);
                  setActivePageRef(undefined);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-800 text-xs sm:text-sm font-medium transition ${
                chapterData.nextChapter
                  ? 'text-slate-200 hover:bg-slate-800 hover:border-slate-700 cursor-pointer'
                  : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <span className="hidden sm:inline">
                {chapterData.nextChapter ? chapterData.nextChapter.title : 'End of Book'}
              </span>
              <span className="sm:hidden">Next Chapter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </article>
      ) : (
        <div className="py-20 text-center space-y-4">
          <p className="text-slate-400">Chapter {currentChapterNum} not found in this book.</p>
          <button
            onClick={() => setCurrentChapterNum(1)}
            className="px-4 py-2 bg-slate-800 text-amber-400 rounded-xl text-xs font-semibold"
          >
            Go to Chapter 1
          </button>
        </div>
      )}
    </div>
  );
};
