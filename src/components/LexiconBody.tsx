import React from 'react';
import { parseLexiconDescription, tokenizeLexiconText } from '../utils/lexiconParser';
import { Sparkles, BookOpen, Layers } from 'lucide-react';

interface LexiconBodyProps {
  description: string;
  currentStrongsId?: string;
  onSelectStrongsId: (id: string) => void;
  className?: string;
}

export const LexiconBody: React.FC<LexiconBodyProps> = ({
  description,
  currentStrongsId,
  onSelectStrongsId,
  className = '',
}) => {
  const parsed = parseLexiconDescription(description);

  const renderTokenized = (text: string) => {
    const tokens = tokenizeLexiconText(text, currentStrongsId);
    return tokens.map((t, idx) => {
      if (t.type === 'strongs_id' && t.strongsId) {
        return (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectStrongsId(t.strongsId!);
            }}
            className="inline-flex items-center px-1.5 py-0.5 mx-0.5 text-xs font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 rounded transition cursor-pointer align-baseline"
            title={`Jump to root ${t.strongsId}`}
          >
            <span>{t.text}</span>
          </button>
        );
      }

      if ((t.type === 'greek_word' || t.type === 'hebrew_word') && t.strongsId) {
        const isHeb = t.type === 'hebrew_word';
        return (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectStrongsId(t.strongsId!);
            }}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 text-xs font-serif bg-sky-950/70 hover:bg-sky-900/80 text-sky-200 hover:text-sky-100 border border-sky-700/60 rounded-md transition cursor-pointer align-baseline shadow-2xs group"
            title={`Jump to ${t.strongsId} (${t.text})`}
            dir={isHeb ? 'rtl' : 'ltr'}
          >
            <span className="font-semibold">{t.text}</span>
            <span className="text-[10px] font-mono text-sky-400 group-hover:text-sky-300 border-l border-sky-700/50 pl-1">
              {t.strongsId}
            </span>
          </button>
        );
      }

      return <span key={idx}>{t.text}</span>;
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. Outline of Biblical Meanings / Primary Definitions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Outline of Biblical Meanings</span>
        </div>

        <ol className="list-decimal list-inside space-y-1.5 text-sm leading-relaxed text-slate-200 font-serif">
          {parsed.outlinePoints.map((point, idx) => (
            <li key={idx} className="pl-1 text-slate-200">
              <span className="text-slate-300 font-sans text-xs mr-1"></span>
              {renderTokenized(point)}
            </li>
          ))}
        </ol>
      </div>

      {/* 2. Exhaustive Definition & Etymology (with clickable links) */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 space-y-2">
        <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Exhaustive Strong's Lexical Definition</span>
        </div>

        {parsed.derivation && (
          <div className="text-xs text-amber-300/90 font-mono bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Etymology:</span>
            <span>{renderTokenized(parsed.derivation)}</span>
          </div>
        )}

        <div className="text-sm leading-relaxed text-slate-300 font-serif pt-1">
          {renderTokenized(parsed.fullDefinition)}
        </div>
      </div>

      {/* 3. KJV Translation Renderings */}
      {parsed.kjvChips.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>KJV Translation Context Occurrences</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {parsed.kjvChips.map((chip, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-800/90 text-slate-300 border border-slate-700/80 rounded-md text-xs font-sans"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

