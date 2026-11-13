import React, { useState } from 'react';
import type { Book as BookType } from '../types/bible';
import { CANONICAL_BOOKS, findBookMeta } from '../utils/books';
import { BookOpen, ChevronRight, X } from 'lucide-react';

interface BookNavigatorProps {
  books: BookType[];
  selectedBookIndex: number;
  selectedChapter: number;
  onSelect: (bookIndex: number, chapter: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const BookNavigator: React.FC<BookNavigatorProps> = ({
  books,
  selectedBookIndex,
  selectedChapter,
  onSelect,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'OT' | 'NT'>('OT');
  const [activeBookIdx, setActiveBookIdx] = useState<number>(selectedBookIndex);

  if (!isOpen) return null;

  const currentBook = books[activeBookIdx] || books[0];
  const currentChaptersCount = currentBook ? currentBook.chapters.length : 1;

  // Split books into OT / NT
  const otBooks: { book: BookType; originalIndex: number }[] = [];
  const ntBooks: { book: BookType; originalIndex: number }[] = [];

  books.forEach((b, idx) => {
    const meta = findBookMeta(b.name) || CANONICAL_BOOKS[idx];
    if (meta?.testament === 'NT') {
      ntBooks.push({ book: b, originalIndex: idx });
    } else {
      otBooks.push({ book: b, originalIndex: idx });
    }
  });

  const displayedList = activeTab === 'OT' ? otBooks : ntBooks;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-slate-100">Browse Books & Chapters</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 px-6 pt-3 space-x-4 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('OT')}
            className={`pb-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'OT'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Old Testament ({otBooks.length})
          </button>
          <button
            onClick={() => setActiveTab('NT')}
            className={`pb-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'NT'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            New Testament ({ntBooks.length})
          </button>
        </div>

        {/* 2-Column selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-hidden">
          {/* Books List */}
          <div className="overflow-y-auto p-4 border-r border-slate-800 max-h-[50vh] md:max-h-[60vh] space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
              Select Book
            </div>
            {displayedList.map(({ book, originalIndex }) => {
              const isSelected = activeBookIdx === originalIndex;
              return (
                <button
                  key={book.name}
                  onClick={() => setActiveBookIdx(originalIndex)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{book.name}</span>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                    <span>{book.chapters.length} ch</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chapters Grid */}
          <div className="overflow-y-auto p-4 max-h-[50vh] md:max-h-[60vh] bg-slate-950/20">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
              Select Chapter in {currentBook?.name}
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {Array.from({ length: currentChaptersCount }, (_, i) => i + 1).map((ch) => {
                const isCurrent =
                  activeBookIdx === selectedBookIndex && ch === selectedChapter;
                return (
                  <button
                    key={ch}
                    onClick={() => {
                      onSelect(activeBookIdx, ch);
                      onClose();
                    }}
                    className={`h-11 rounded-xl text-sm font-medium flex items-center justify-center transition border ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800/80 border-slate-700/60 text-slate-200 hover:bg-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
