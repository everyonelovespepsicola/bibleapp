import React from 'react';
import type { EgwChapterData } from '../types/egw';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Bookmark } from 'lucide-react';

interface EgwChapterReaderProps {
  chapterData: EgwChapterData;
  activePageRef?: string;
  onBackToNotes: () => void;
  onNavigateChapter: (chapterNumber: number) => void;
}

export const EgwChapterReader: React.FC<EgwChapterReaderProps> = ({
  chapterData,
  activePageRef,
  onBackToNotes,
  onNavigateChapter,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Return to Notes */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <button
          onClick={onBackToNotes}
          className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 transition py-1 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Notes</span>
        </button>

        <span className="text-xs font-mono font-bold text-slate-400">
          {chapterData.bookAbbrev} Ch. {chapterData.chapterNumber}
        </span>
      </div>

      {/* Chapter Title Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-800/40 to-slate-800/20 border border-amber-500/30 rounded-2xl p-5">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>{chapterData.bookTitle}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 tracking-tight">
          {chapterData.chapterTitle.toLowerCase().startsWith('chapter ') ||
          chapterData.chapterTitle.toLowerCase().startsWith('section ') ||
          chapterData.chapterTitle.toLowerCase().startsWith('foreword') ||
          chapterData.chapterTitle.toLowerCase().startsWith('preface')
            ? chapterData.chapterTitle
            : `Chapter ${chapterData.chapterNumber}: ${chapterData.chapterTitle}`}
        </h2>
      </div>

      {/* Paragraphs Stream with Highlighted Quoted Paragraph */}
      <div className="space-y-4 font-serif text-[1.12rem] sm:text-[1.18rem] leading-[2.1] text-slate-200">
        {chapterData.paragraphs.map((p, idx) => {
          const isQuotedParagraph = activePageRef && p.pageRef === activePageRef;

          return (
            <div
              key={idx}
              id={`egw-p-${p.pageRef}`}
              className={`p-4 rounded-xl transition relative group ${
                isQuotedParagraph
                  ? 'bg-amber-500/15 border-l-4 border-amber-400 shadow-md text-amber-50'
                  : 'hover:bg-slate-800/40'
              }`}
            >
              <p className="indent-6 sm:indent-8 text-justify">
                {p.text}
                <span className="ml-2 inline-block font-sans font-bold text-xs tracking-wide bg-slate-800/80 text-amber-400/90 px-2 py-0.5 rounded border border-slate-700/80">
                  {chapterData.bookAbbrev} {p.pageRef}
                </span>
              </p>

              {isQuotedParagraph && (
                <div className="flex items-center gap-1.5 mt-2 text-xs font-sans font-bold text-amber-400 uppercase tracking-wider">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Quoted in Verse Notes</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chapter Navigation Bottom Arrows */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-8">
        <button
          disabled={!chapterData.prevChapter}
          onClick={() => {
            if (chapterData.prevChapter) {
              onNavigateChapter(chapterData.prevChapter.number);
            }
          }}
          className={`flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-800 font-medium transition ${
            chapterData.prevChapter
              ? 'text-slate-200 hover:bg-slate-800 hover:border-slate-700 cursor-pointer'
              : 'text-slate-600 opacity-40 cursor-not-allowed'
          }`}
          title={chapterData.prevChapter ? `Previous Chapter: ${chapterData.prevChapter.title}` : undefined}
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
              onNavigateChapter(chapterData.nextChapter.number);
            }
          }}
          className={`flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-800 font-medium transition ${
            chapterData.nextChapter
              ? 'text-slate-200 hover:bg-slate-800 hover:border-slate-700 cursor-pointer'
              : 'text-slate-600 opacity-40 cursor-not-allowed'
          }`}
          title={chapterData.nextChapter ? `Next Chapter: ${chapterData.nextChapter.title}` : undefined}
        >
          <span className="hidden sm:inline">
            {chapterData.nextChapter ? chapterData.nextChapter.title : 'End of Book'}
          </span>
          <span className="sm:hidden">Next Chapter</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

