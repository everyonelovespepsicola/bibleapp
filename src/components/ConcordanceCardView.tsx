import React, { useMemo } from 'react';
import type { StrongsEntry, FlatVerse } from '../types/bible';
import {
  Volume2,
  Copy,
  Link as LinkIcon,
  Sparkles,
  ArrowRightLeft,
  BookOpen,
} from 'lucide-react';

interface ConcordanceCardViewProps {
  entry: StrongsEntry | null;
  selectedWord: string;
  concordanceVerses: FlatVerse[];
  onSelectRelatedStrongs: (strongsId: string) => void;
  onSelectVerse: (verse: FlatVerse) => void;
  onFlipBackToScriptureFirst: () => void;
}

export const ConcordanceCardView: React.FC<ConcordanceCardViewProps> = ({
  entry,
  selectedWord,
  concordanceVerses,
  onSelectRelatedStrongs,
  onFlipBackToScriptureFirst,
}) => {
  if (!entry) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-serif font-bold text-slate-200">No Word Selected</h3>
        <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
          Click any word in Scripture Study Mode to explore its Hebrew or Greek concordance view.
        </p>
      </div>
    );
  }

  const isHebrew = entry.number.startsWith('H');
  const langLabel = isHebrew ? 'Ancient Hebrew Lexicon' : 'Koine Greek Lexicon';

  const rootMatches = useMemo(() => {
    return Array.from(
      new Set(entry.description.match(/[HG]\d{1,5}/gi) || [])
    ).filter((m) => m.toUpperCase() !== entry.number.toUpperCase());
  }, [entry]);

  const copyConcordanceSummary = async () => {
    const text = `${entry.number} - ${entry.lemma} (${entry.xlit} /${entry.pronounce}/)\n${entry.description}\n\nOccurrences in Bible: ${concordanceVerses.length} verses`;
    await navigator.clipboard.writeText(text);
    alert(`Copied Strong's ${entry.number} lexicon summary to clipboard!`);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Banner & Switch Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {entry.number}
          </span>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            {langLabel}
          </span>
        </div>

        {/* Flip Switch Button */}
        <button
          onClick={onFlipBackToScriptureFirst}
          className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-medium transition border border-slate-700 shadow-sm cursor-pointer self-start sm:self-auto"
          title="Flip layout back to Scripture Reader on left, Lexicon card on right"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Flip to Scripture-First View</span>
        </button>
      </div>

      {/* Hero Lexicon Spotlight */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="text-[11px] text-amber-400/80 font-bold uppercase tracking-widest">
          Original Biblical Root Lemma
        </div>

        <div
          className={`text-5xl sm:text-6xl font-serif text-amber-400 tracking-wide ${
            isHebrew ? 'text-center' : ''
          }`}
          dir={isHebrew ? 'rtl' : 'ltr'}
        >
          {entry.lemma}
        </div>

        <div className="flex items-center justify-center space-x-4 text-base text-slate-200">
          <span className="font-medium italic text-slate-300">"{entry.xlit}"</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 flex items-center gap-1 font-mono text-sm">
            <Volume2 className="w-4 h-4 text-amber-400" />
            /{entry.pronounce}/
          </span>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-center space-x-4 text-xs text-slate-400">
          <div>
            English translation context:{' '}
            <strong className="text-amber-300 font-semibold uppercase">{selectedWord}</strong>
          </div>
          <span className="text-slate-600">•</span>
          <div>
            Total occurrences:{' '}
            <strong className="text-slate-200 font-semibold">{concordanceVerses.length.toLocaleString()} verses</strong>
          </div>
        </div>
      </div>

      {/* Exhaustive Strong's Definition Box */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>Exhaustive Strong's Lexical Definition</span>
          </div>

          <button
            onClick={copyConcordanceSummary}
            className="flex items-center space-x-1.5 px-2.5 py-1 text-slate-400 hover:text-slate-200 text-xs bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
            title="Copy definition"
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" />
            <span>Copy Entry</span>
          </button>
        </div>

        <p className="font-serif text-slate-200 text-base leading-relaxed p-2">
          {entry.description}
        </p>
      </div>

      {/* Related Roots Family Tree */}
      {rootMatches.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-sky-400">
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Related Parent & Derivative Roots</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {rootMatches.map((rootId) => {
              const upper = rootId.toUpperCase();
              return (
                <button
                  key={upper}
                  onClick={() => onSelectRelatedStrongs(upper)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-sky-200 border border-slate-700 rounded-xl text-xs font-mono font-medium transition cursor-pointer flex items-center space-x-1.5 shadow-sm"
                >
                  <span>{upper}</span>
                  <span className="text-slate-500">→</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Helpful Hint on Right Pane */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-300 leading-relaxed">
        👉 <strong>Look to the right-hand panel</strong> to browse all{' '}
        <strong>{concordanceVerses.length.toLocaleString()} verses</strong> across the Bible that use this exact root! You can click any verse on the right to jump right into that chapter.
      </div>
    </div>
  );
};
