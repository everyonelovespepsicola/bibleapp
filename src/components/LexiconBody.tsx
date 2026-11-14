import React from 'react';
import type { StrongsEntry } from '../types/bible';
import { parseLexiconDescription, tokenizeLexiconText } from '../utils/lexiconParser';
import strongsKjvMap from '../utils/strongsKjvMap.json';
import { Volume2, Layers, BookOpen, FileText } from 'lucide-react';

interface LexiconBodyProps {
  entry: StrongsEntry;
  selectedWord: string;
  onSelectStrongsId: (id: string) => void;
  className?: string;
}

export const LexiconBody: React.FC<LexiconBodyProps> = ({
  entry,
  selectedWord,
  onSelectStrongsId,
  className = '',
}) => {
  const isHebrew = entry.number.startsWith('H');
  const numberPadded = entry.number.replace(/^[HG]/i, '').padStart(5, '0');
  const parsed = parseLexiconDescription(entry.description);

  // Determine displayed English word:
  // If selectedWord is non-Latin (e.g. Hebrew or Greek lemma from a cross-link click), resolve to canonical KJV translation
  const isSelectedNonLatin = selectedWord && /[\u0590-\u05FF\u0370-\u03FF\u1F00-\u1FFF]/.test(selectedWord);
  const kjvLookup = (strongsKjvMap as Record<string, string>)[entry.number.toUpperCase()];
  const displayWord = !selectedWord || isSelectedNonLatin
    ? kjvLookup || parsed.kjvChips[0] || entry.xlit || '—'
    : selectedWord;

  // Infer part of speech if present in lexical description
  let partOfSpeech = isHebrew ? 'Noun / Root' : 'Preposition / Word';
  const descLower = entry.description.toLowerCase();
  if (descLower.includes('preposition')) partOfSpeech = 'Preposition';
  else if (descLower.includes('verb')) partOfSpeech = 'Verb';
  else if (descLower.includes('noun masculine') || descLower.includes('masculine noun')) partOfSpeech = 'Noun Masculine';
  else if (descLower.includes('noun feminine') || descLower.includes('feminine noun')) partOfSpeech = 'Noun Feminine';
  else if (descLower.includes('noun')) partOfSpeech = 'Noun';
  else if (descLower.includes('adjective')) partOfSpeech = 'Adjective';
  else if (descLower.includes('adverb')) partOfSpeech = 'Adverb';
  else if (descLower.includes('particle')) partOfSpeech = 'Particle';
  else if (descLower.includes('pronoun')) partOfSpeech = 'Pronoun';

  const renderTokenized = (text: string) => {
    const tokens = tokenizeLexiconText(text, entry.number);
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
            className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 text-xs font-serif bg-sky-950/80 hover:bg-sky-900 text-sky-200 hover:text-sky-100 border border-sky-700/60 rounded-md transition cursor-pointer align-baseline shadow-2xs group"
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

  // Convert outline points into hierarchical subpoints (1. -> a., b., c.)
  const outlineHierarchy: { main: string; subs: string[] }[] = [];
  if (parsed.outlinePoints.length === 1) {
    const raw = parsed.outlinePoints[0];
    const subParts = raw.split(/,\s*(?![^(]*\))/).map((s) => s.trim()).filter(Boolean);
    if (subParts.length > 1) {
      outlineHierarchy.push({ main: subParts[0], subs: subParts.slice(1) });
    } else {
      outlineHierarchy.push({ main: raw, subs: [] });
    }
  } else {
    for (const point of parsed.outlinePoints) {
      const subParts = point.split(/,\s*(?![^(]*\))/).map((s) => s.trim()).filter(Boolean);
      if (subParts.length > 2) {
        outlineHierarchy.push({ main: subParts[0], subs: subParts.slice(1) });
      } else {
        outlineHierarchy.push({ main: point, subs: [] });
      }
    }
  }

  const alphaLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Structured Lexicon Table Grid (matching Touch Bible structure in dark amber/slate) */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        {/* Top Header Row: Clicked KJV English Word + 5-digit number */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-5 py-3 flex items-center justify-between gap-3">
          {/* Left: Clicked KJV English Word in Context */}
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              KJV Word
            </span>
            <span className="text-base sm:text-lg font-serif font-bold tracking-wide uppercase text-amber-300 truncate">
              {displayWord}
            </span>
          </div>

          {/* Right: Strong's 5-Digit Number & Root Designation */}
          <div className="text-right flex-shrink-0">
            <div className="text-lg sm:text-xl font-bold font-mono tracking-wider text-amber-300">
              {numberPadded}
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium">
              {isHebrew ? 'Ancient Hebrew Root' : 'Koine Greek Word'}
            </div>
          </div>
        </div>

        {/* 2-Column Split: Lemma / Transliteration */}
        <div className="grid grid-cols-2 border-b border-slate-700/80 divide-x divide-slate-700/80">
          <div className="p-4 flex flex-col items-center justify-center bg-slate-950/40">
            <span
              className={`text-3xl sm:text-4xl font-serif text-amber-400 ${
                isHebrew ? 'text-right' : 'text-center'
              }`}
              dir={isHebrew ? 'rtl' : 'ltr'}
            >
              {entry.lemma}
            </span>
          </div>
          <div className="p-4 flex flex-col justify-center items-center bg-slate-900/60">
            <span className="text-base sm:text-lg font-serif italic text-slate-100 font-medium">
              "{entry.xlit}"
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-1">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>/{entry.pronounce}/</span>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Part of Speech / Derivation */}
        <div className="grid grid-cols-2 divide-x divide-slate-700/80">
          <div className="p-4 flex flex-col justify-center items-center text-center bg-slate-950/20">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Part of Speech
            </span>
            <span className="text-sm font-semibold text-sky-300">
              {partOfSpeech}
            </span>
          </div>

          <div className="p-4 flex flex-col justify-center bg-slate-900/40 text-xs sm:text-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Root Origin & Etymology
            </span>
            <span className="text-slate-300 font-serif leading-relaxed">
              {parsed.derivation ? renderTokenized(parsed.derivation) : 'a primitive root'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Full Lexical Paragraph (The Comprehensive Statement) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-md">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <FileText className="w-4 h-4" />
          <span>Exhaustive Strong's Lexical Definition</span>
        </div>

        <p className="text-base sm:text-lg font-serif text-slate-200 leading-relaxed pt-1">
          {renderTokenized(entry.description)}
        </p>
      </div>

      {/* 3. Numbered & Lettered Outline of Biblical Meanings (1. -> a., b., c.) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <BookOpen className="w-4 h-4" />
          <span>Outline of Biblical Meanings</span>
        </div>

        <div className="space-y-4 pt-1">
          {outlineHierarchy.map((item, idx) => (
            <div key={idx} className="space-y-2">
              {/* Primary Numbered Meaning (1., 2., etc.) */}
              <div className="flex items-start space-x-2 text-base sm:text-lg font-serif text-slate-100 font-medium">
                <span className="text-amber-400 font-sans font-bold text-sm sm:text-base mt-0.5">
                  {idx + 1}.
                </span>
                <span>{renderTokenized(item.main)}</span>
              </div>

              {/* Nested Lettered Subpoints (a., b., c.) */}
              {item.subs.length > 0 && (
                <div className="pl-6 sm:pl-8 space-y-1.5 border-l-2 border-slate-800 ml-2">
                  {item.subs.map((sub, subIdx) => {
                    const letter = alphaLabels[subIdx % alphaLabels.length];
                    return (
                      <div
                        key={subIdx}
                        className="flex items-start space-x-2 text-sm sm:text-base font-serif text-slate-300 leading-relaxed"
                      >
                        <span className="text-slate-400 font-sans font-bold text-xs mt-0.5">
                          {letter}.
                        </span>
                        <span>{renderTokenized(sub)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. KJV Translation Context Occurrences */}
      {parsed.kjvChips.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>KJV Translation Context Occurrences</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {parsed.kjvChips.map((chip, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-lg text-xs sm:text-sm font-sans font-medium"
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
