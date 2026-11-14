import React from 'react';
import type { StrongsEntry } from '../types/bible';
import { X, Search, Link as LinkIcon, Compass, ArrowRightLeft } from 'lucide-react';
import { LexiconBody } from './LexiconBody';

interface StudyDrawerProps {
  entry: StrongsEntry | null;
  selectedWord: string;
  onClose: () => void;
  onSearchStrongs: (strongsId: string) => void;
  onSelectRelatedStrongs: (strongsId: string) => void;
  onFlipToConcordanceFirst?: () => void;
}

export const StudyDrawer: React.FC<StudyDrawerProps> = ({
  entry,
  selectedWord,
  onClose,
  onSearchStrongs,
  onSelectRelatedStrongs,
  onFlipToConcordanceFirst,
}) => {
  if (!entry) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/40 border-l border-slate-800">
        <div className="p-3 bg-amber-500/10 rounded-2xl mb-4 text-amber-400">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-lg font-serif font-bold text-slate-200">Study & Lexicon Inspector</h3>
        <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
          Click on any tagged word in the Scripture to dive into its original Hebrew/Greek root, pronunciation, Strong's definition, and occurrences.
        </p>
      </div>
    );
  }

  const isHebrew = entry.number.startsWith('H');
  const langLabel = isHebrew ? 'Ancient Hebrew' : 'Koine Greek';

  // Find linked root numbers in the description like "H7218" or "G3056"
  const rootMatches = Array.from(
    new Set(entry.description.match(/[HG]\d{1,5}/gi) || [])
  ).filter((m) => m.toUpperCase() !== entry.number.toUpperCase());

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {entry.number}
          </span>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            {langLabel}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onFlipToConcordanceFirst && (
            <button
              onClick={onFlipToConcordanceFirst}
              className="flex items-center space-x-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-lg transition border border-slate-700 cursor-pointer shadow-xs mr-1"
              title="Flip layout: Concordance on Left, Verses on Right"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Flip View</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
            title="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Lexicon Card with Touch Bible Table Structure */}
        <LexiconBody
          entry={entry}
          selectedWord={selectedWord}
          onSelectStrongsId={onSelectRelatedStrongs}
        />

        {/* Related Root Words / Rabbit Hole */}
        {rootMatches.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              <LinkIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>Related Root & Parent Words</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {rootMatches.map((rootId) => {
                const upper = rootId.toUpperCase();
                return (
                  <button
                    key={upper}
                    onClick={() => onSelectRelatedStrongs(upper)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-lg text-xs font-mono font-medium transition cursor-pointer flex items-center space-x-1"
                  >
                    <span>{upper}</span>
                    <span className="text-slate-500">→</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Concordance Search Button */}
        <div className="pt-2">
          <button
            onClick={() => onSearchStrongs(entry.number)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Find All Verses with {entry.number} in Bible</span>
          </button>
          <p className="text-[11px] text-center text-slate-500 mt-2">
            Deep search scans the entire Old and New Testament for this root.
          </p>
        </div>
      </div>
    </div>
  );
};
