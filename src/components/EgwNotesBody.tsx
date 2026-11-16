import React from 'react';
import type { EgwComment } from '../types/egw';
import { BookOpen, Bookmark, Sparkles, Copy, Check, ChevronRight } from 'lucide-react';

interface EgwNotesBodyProps {
  reference: string;
  comments: EgwComment[];
  verseText?: string;
  onOpenChapter?: (comment: EgwComment) => void;
}

export const EgwNotesBody: React.FC<EgwNotesBodyProps> = ({
  reference,
  comments,
  verseText,
  onOpenChapter,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyParagraph = async (e: React.MouseEvent, c: EgwComment) => {
    e.stopPropagation();
    const citation = `${c.sourceAbbrev} ${c.pageRef} (${c.sourceBook}, p. ${c.pageRef})`;
    const fullText = `"${c.paragraphText}" — ${citation}`;
    await navigator.clipboard.writeText(fullText);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /**
   * Highlights occurrences of the target scripture reference (e.g. "Genesis 1:1" or "In the beginning")
   * directly within Ellen White's paragraph text.
   */
  const renderParagraphContent = (text: string, ref: string) => {
    if (!ref) return text;

    // Build regex for the reference itself (e.g. "Genesis 1:1", "Gen 1:1")
    const escapedRef = ref.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedRef}|'[^']*${escapedRef}[^']*'|"[^"]*${escapedRef}[^"]*")`, 'gi');

    const parts = text.split(regex);
    if (parts.length === 1) return text;

    return parts.map((part, idx) => {
      if (regex.test(part)) {
        return (
          <mark
            key={idx}
            className="bg-amber-400/25 text-amber-200 font-semibold px-1 py-0.5 rounded border-b border-amber-400/60"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
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
            <span className="text-[11px] text-slate-500">Exhaustive Verse Notes</span>
          </div>

          {comments.map((c) => {
            const citationCode = `${c.sourceAbbrev} ${c.pageRef}`;

            return (
              <div
                key={c.id}
                className="bg-slate-800/40 border border-slate-800 rounded-xl p-5 transition space-y-3 relative group shadow-sm"
              >
                {/* Book & Chapter Header with standalone 'Read Chapter' Button */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
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

                  {c.chapterNumber && onOpenChapter && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenChapter(c);
                      }}
                      className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/40 hover:bg-amber-900/50 text-yellow-400 hover:text-yellow-300 border border-yellow-600/50 hover:border-yellow-500/70 transition cursor-pointer shadow-xs active:scale-95 flex-shrink-0"
                      title={`Read full chapter (${c.chapterTitle || `Ch. ${c.chapterNumber}`})`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Chapter</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Full Paragraph Text with Quote and Ending Reference Code */}
                <div className="font-serif text-[1.05rem] leading-[1.8] text-slate-200 border-l-2 border-amber-500/50 pl-3.5 py-0.5">
                  <span>{renderParagraphContent(c.paragraphText, reference)}</span>
                  {/* Inline Ending Reference Code: Book, Page, Paragraph (e.g. Ed 134.2, COL 35.2) */}
                  <span className="ml-2 inline-block font-sans font-bold text-yellow-400 text-xs tracking-wide bg-amber-950/40 px-2 py-0.5 rounded border border-yellow-600/50 selection:bg-yellow-400 selection:text-slate-950">
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
                    onClick={(e) => copyParagraph(e, c)}
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
