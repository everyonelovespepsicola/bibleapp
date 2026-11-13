import React from 'react';
import type { SearchResult } from '../utils/searchEngine';
import type { FlatVerse } from '../types/bible';
import { Copy, BookOpen } from 'lucide-react';
import { renderFormattedText, copyRichScripture } from '../utils/clipboard';

interface SearchResultsViewProps {
  result: SearchResult;
  onSelectVerse: (verse: FlatVerse) => void;
  rawQuery?: string;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  result,
  onSelectVerse,
}) => {
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

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                result.type === 'reference'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}
            >
              {result.type === 'reference' ? 'Passage / Range Match' : 'Keyword Search'}
            </span>
            <span className="text-xs text-slate-400">
              {result.count} {result.count === 1 ? 'verse' : 'verses'} found
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-100 mt-1">
            {result.title}
          </h2>
        </div>

        {result.verses.length > 0 && (
          <button
            onClick={copyAllResults}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition border border-slate-700"
            title="Copy all matching verses for PowerPoint/Word"
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" />
            <span>Copy All</span>
          </button>
        )}
      </div>

      {result.verses.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800/80">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-medium text-slate-300">No verses found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try searching with references like "John 3:16", "John 3:4-10", "John 3 4-10" or words like "grace love".
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {result.verses.map((v, idx) => (
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
        </div>
      )}
    </div>
  );
};
