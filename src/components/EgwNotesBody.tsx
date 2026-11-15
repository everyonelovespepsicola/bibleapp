import React from 'react';
import type { EgwComment } from '../types/egw';
import { BookOpen, Bookmark, Sparkles, Copy, Check } from 'lucide-react';

interface EgwNotesBodyProps {
  reference: string;
  comments: EgwComment[];
  verseText?: string;
}

export const EgwNotesBody: React.FC<EgwNotesBodyProps> = ({
  reference,
  comments,
  verseText,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyParagraph = async (c: EgwComment) => {
    const citation = `${c.sourceAbbrev} ${c.pageRef} (${c.sourceBook}, p. ${c.pageRef})`;
    const fullText = `"${c.paragraphText}" — ${citation}`;
    await navigator.clipboard.writeText(fullText);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Passage Header Context */}
      <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60">
        <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-1">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <Bookmark className="w-3.5 h-3.5" />
            Scripture Reference
          </span>
          <span className="text-slate-400 font-mono text-[11px]">{reference}</span>
        </div>
        {verseText && (
          <p className="font-serif text-slate-200 text-sm italic leading-relaxed pt-1 border-t border-slate-700/40 mt-1">
            "{verseText}"
          </p>
        )}
      </div>

      {/* Commentary List */}
      {comments.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400/70 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-slate-300">No Direct Excerpts Indexed Yet</h4>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
            As additional pre-1929 Ellen G. White public domain volumes are indexed into the local offline library, matching paragraphs referencing <span className="text-amber-400">{reference}</span> will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ellen G. White Paragraphs ({comments.length})</span>
            </div>
            <span className="text-[11px] text-slate-500">Full Context Flow</span>
          </div>

          {comments.map((c) => {
            const citationCode = `${c.sourceAbbrev} ${c.pageRef}`;

            return (
              <div
                key={c.id}
                className="bg-slate-800/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition space-y-3 relative group"
              >
                {/* Book & Chapter Header */}
                <div className="flex items-baseline justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div>
                    <span className="text-sm font-bold text-amber-300 font-serif">
                      {c.sourceBook}
                    </span>
                    {c.chapterTitle && (
                      <span className="text-xs text-slate-400 block sm:inline sm:ml-2">
                        • {c.chapterTitle}
                      </span>
                    )}
                  </div>

                  {c.year && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({c.year})
                    </span>
                  )}
                </div>

                {/* Full Paragraph Text with Quote and Ending Reference Code */}
                <div className="font-serif text-[1.05rem] leading-[1.8] text-slate-200 border-l-2 border-amber-500/50 pl-3.5 py-0.5">
                  <span>{c.paragraphText}</span>
                  {/* Inline Ending Reference Code: Book, Page, Paragraph (e.g. COL 35.2) */}
                  <span className="ml-2 inline-block font-sans font-bold text-amber-400/90 text-xs tracking-wide bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 selection:bg-amber-400 selection:text-slate-950">
                    — {citationCode}
                  </span>
                </div>

                {/* Footer Metadata & One-click Copy */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                  <div className="text-[11px] text-slate-400 font-sans">
                    <span className="text-slate-500">Citation:</span>{' '}
                    <strong className="text-slate-300">{c.sourceBook}</strong>, p.{' '}
                    <span className="font-mono text-amber-400">{c.pageRef}</span>{' '}
                    <span className="text-slate-500">({citationCode})</span>
                  </div>

                  <button
                    onClick={() => copyParagraph(c)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs transition border border-slate-700 cursor-pointer"
                    title="Copy paragraph and citation to clipboard"
                  >
                    {copiedId === c.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
