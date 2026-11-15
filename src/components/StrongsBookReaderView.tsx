import React, { useState, useMemo } from 'react';
import type { StrongsEntry } from '../types/bible';
import {
  Volume2,
  Copy,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Search,
  Library,
} from 'lucide-react';
import { LexiconBody } from './LexiconBody';

interface StrongsBookReaderViewProps {
  strongsLexicon: Record<string, StrongsEntry>;
  initialStrongsId?: string;
  onBackToBible: () => void;
  onOpenLibrary: () => void;
  onSearchOccurrences: (strongsId: string) => void;
}

export const StrongsBookReaderView: React.FC<StrongsBookReaderViewProps> = ({
  strongsLexicon,
  initialStrongsId = 'H1',
  onBackToBible,
  onOpenLibrary,
  onSearchOccurrences,
}) => {
  const [currentId, setCurrentId] = useState<string>(initialStrongsId.toUpperCase());
  const [inputSearch, setInputSearch] = useState<string>('');
  const [activeDictionary, setActiveDictionary] = useState<'hebrew' | 'greek'>(
    initialStrongsId.toUpperCase().startsWith('G') ? 'greek' : 'hebrew'
  );

  const entry = strongsLexicon[currentId] || null;
  const isHebrew = currentId.startsWith('H');
  const numericVal = parseInt(currentId.slice(1), 10) || 1;

  // Compute prev/next Strong's ID
  const prevId = useMemo(() => {
    if (numericVal <= 1) return null;
    const prefix = isHebrew ? 'H' : 'G';
    const target = `${prefix}${numericVal - 1}`;
    return strongsLexicon[target] ? target : null;
  }, [currentId, numericVal, isHebrew, strongsLexicon]);

  const nextId = useMemo(() => {
    const prefix = isHebrew ? 'H' : 'G';
    const maxVal = isHebrew ? 8674 : 5624;
    if (numericVal >= maxVal) return null;
    const target = `${prefix}${numericVal + 1}`;
    return strongsLexicon[target] ? target : null;
  }, [currentId, numericVal, isHebrew, strongsLexicon]);

  // Jump handler
  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSearch.trim()) return;
    let clean = inputSearch.trim().toUpperCase();
    if (/^\d+$/.test(clean)) {
      clean = (activeDictionary === 'hebrew' ? 'H' : 'G') + clean;
    }
    if (strongsLexicon[clean]) {
      setCurrentId(clean);
      setInputSearch('');
    } else {
      alert(`Entry "${clean}" not found in Strong's dictionary.`);
    }
  };

  const copyLexiconSummary = async () => {
    if (!entry) return;
    const text = `${entry.number} - ${entry.lemma} (${entry.xlit} /${entry.pronounce}/)\n${entry.description}`;
    await navigator.clipboard.writeText(text);
    alert(`Copied Strong's ${entry.number} to clipboard!`);
  };

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
            title="Browse library of books"
          >
            <Library className="w-3.5 h-3.5 text-amber-400" />
            <span>Library</span>
          </button>
        </div>

        {/* Hebrew / Greek Dictionary Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveDictionary('hebrew');
              if (!currentId.startsWith('H')) setCurrentId('H1');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeDictionary === 'hebrew'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hebrew OT (H1–H8674)
          </button>
          <button
            onClick={() => {
              setActiveDictionary('greek');
              if (!currentId.startsWith('G')) setCurrentId('G1');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeDictionary === 'greek'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Greek NT (G1–G5624)
          </button>
        </div>
      </div>

      {/* Search / Jump Bar */}
      <form
        onSubmit={handleJump}
        className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-2 rounded-xl"
      >
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder={`Jump to entry (e.g. ${activeDictionary === 'hebrew' ? 'H7225 or 7225' : 'G3056 or 3056'})...`}
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer"
        >
          Jump
        </button>
      </form>

      {/* Main Lexicon Book Entry Page */}
      {entry ? (
        <article className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-900/30 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
                  {entry.number}
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  {isHebrew ? 'Ancient Hebrew / Aramaic Lexicon' : 'Koine Greek Lexicon'}
                </span>
              </div>

              <button
                onClick={copyLexiconSummary}
                className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-amber-300 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 transition cursor-pointer"
                title="Copy Lexicon Entry"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Entry</span>
              </button>
            </div>

            {/* Lemma Spotlight */}
            <div className="text-center py-4 space-y-3">
              <div
                className="text-6xl sm:text-7xl font-serif font-bold text-amber-400 tracking-wide"
                dir={isHebrew ? 'rtl' : 'ltr'}
              >
                {entry.lemma}
              </div>

              <div className="flex items-center justify-center space-x-4 text-base sm:text-lg text-slate-200">
                <span className="font-medium italic text-slate-300">"{entry.xlit}"</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 flex items-center gap-1 font-mono text-sm sm:text-base">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  /{entry.pronounce}/
                </span>
              </div>
            </div>
          </div>

          {/* Lexicon Body Definitions & Biblical Outlines */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 pb-2 border-b border-slate-800">
              Lexical Definitions & Strong's Etymology
            </div>

            <LexiconBody
              entry={entry}
              selectedWord=""
              onSelectStrongsId={(relatedId: string) => {
                if (strongsLexicon[relatedId]) {
                  setCurrentId(relatedId);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />

            {/* Action: Search Bible for this word */}
            <div className="pt-6 border-t border-slate-800">
              <button
                onClick={() => onSearchOccurrences(entry.number)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Bible for all occurrences of {entry.number} ({entry.lemma})</span>
              </button>
            </div>
          </div>

          {/* Pagination Controls between entries (like turning book pages) */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-8">
            <button
              disabled={!prevId}
              onClick={() => {
                if (prevId) {
                  setCurrentId(prevId);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-800 text-xs sm:text-sm font-medium transition ${
                prevId
                  ? 'text-slate-200 hover:bg-slate-800 hover:border-slate-700 cursor-pointer'
                  : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Root ({prevId || 'None'})</span>
            </button>

            <span className="text-xs text-slate-500 font-mono">
              {entry.number} of {isHebrew ? 'H8674' : 'G5624'}
            </span>

            <button
              disabled={!nextId}
              onClick={() => {
                if (nextId) {
                  setCurrentId(nextId);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-800 text-xs sm:text-sm font-medium transition ${
                nextId
                  ? 'text-slate-200 hover:bg-slate-800 hover:border-slate-700 cursor-pointer'
                  : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <span>Next Root ({nextId || 'None'})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </article>
      ) : (
        <div className="py-20 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400">Entry {currentId} not found in lexicon.</p>
          <button
            onClick={() => setCurrentId('H1')}
            className="px-4 py-2 bg-slate-800 text-amber-400 rounded-xl text-xs font-semibold"
          >
            Reset to H1
          </button>
        </div>
      )}
    </div>
  );
};
