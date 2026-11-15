import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  Library,
} from 'lucide-react';
import egwBookMetaRaw from '../utils/egwBookMeta.json';
import { EgwBookCover } from './EgwBookCover';

interface BookItem {
  key: string;
  title: string;
  abbrev: string;
  year: number;
}

const ALL_BOOKS: BookItem[] = Object.entries(egwBookMetaRaw).map(([key, meta]: [string, any]) => ({
  key,
  title: meta.title,
  abbrev: meta.abbrev,
  year: meta.year,
}));

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEgwBook: (abbrev: string, chapterNumber?: number) => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectEgwBook,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'conflict' | 'testimonies' | 'early' | 'life'>('all');

  const filteredBooks = useMemo(() => {
    return ALL_BOOKS.filter((b) => {
      // Category filter
      const up = b.abbrev.toUpperCase();
      if (categoryFilter === 'conflict' && !['DA', 'GC', 'PP', 'PK', 'AA'].includes(up)) {
        return false;
      }
      if (categoryFilter === 'testimonies' && !/^[1-9]T$/.test(up)) {
        return false;
      }
      if (
        categoryFilter === 'early' &&
        !(up.includes('SG') || up.includes('SP') || ['EW', 'EXV', 'EXV54', 'WLF'].includes(up))
      ) {
        return false;
      }
      if (
        categoryFilter === 'life' &&
        !['SC', 'MB', 'COL', 'ED', 'MH', 'CT', 'CH', 'HL'].includes(up)
      ) {
        return false;
      }

      // Text query
      if (!filterQuery.trim()) return true;
      const q = filterQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.abbrev.toLowerCase().includes(q) ||
        b.year.toString().includes(q)
      );
    });
  }, [filterQuery, categoryFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[92vh] max-h-[900px]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-xl shadow-md shadow-amber-500/20 text-slate-950 font-bold">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>ScriptureFlow Library</span>
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Reader Mode
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                59 Public Domain Ellen G. White historical works (≤ 1923)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
            title="Close Library"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ELLEN G. WHITE BOOKS (Grid View) */}
          <div className="space-y-4">
            {/* Filter & Search Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-base text-slate-200">
                  Ellen G. White Collection
                </h3>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                  {filteredBooks.length} of {ALL_BOOKS.length} Works
                </span>
              </div>

              {/* Quick Filters & Search Box */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  {filterQuery && (
                    <button
                      onClick={() => setFilterQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center space-x-1 text-xs">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                      categoryFilter === 'all'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setCategoryFilter('conflict')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                      categoryFilter === 'conflict'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Conflict
                  </button>
                  <button
                    onClick={() => setCategoryFilter('testimonies')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                      categoryFilter === 'testimonies'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Testimonies
                  </button>
                  <button
                    onClick={() => setCategoryFilter('life')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                      categoryFilter === 'life'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Christian Life
                  </button>
                </div>
              </div>
            </div>

            {/* Book Grid */}
            {filteredBooks.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                No books found matching "{filterQuery}".
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredBooks.map((b) => (
                  <div
                    key={b.key}
                    onClick={() => {
                      onSelectEgwBook(b.abbrev, 1);
                      onClose();
                    }}
                    className="group cursor-pointer flex flex-col"
                  >
                    <EgwBookCover
                      title={b.title}
                      abbrev={b.abbrev}
                      year={b.year}
                      className="w-full mb-2"
                    />
                    <div className="px-1 text-center">
                      <div className="font-serif font-semibold text-xs text-slate-200 line-clamp-1 group-hover:text-amber-400 transition">
                        {b.title}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {b.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
