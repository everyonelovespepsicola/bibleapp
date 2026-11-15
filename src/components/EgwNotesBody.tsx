import React from 'react';
import type { EgwComment } from '../types/egw';
import { BookOpen, ExternalLink, Bookmark, Sparkles } from 'lucide-react';

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
            As additional pre-1929 Ellen G. White public domain volumes are indexed into the local offline library, matching references for <span className="text-amber-400">{reference}</span> will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ellen G. White Excerpts ({comments.length})</span>
            </div>
            <span className="text-[11px] text-slate-500">Public Domain Collection</span>
          </div>

          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition space-y-3"
            >
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
                <div className="text-right flex-shrink-0">
                  <span className="inline-block text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-700/60 text-slate-300">
                    {c.sourceAbbrev} {c.pageRef}
                  </span>
                  {c.year && (
                    <span className="text-[10px] text-slate-500 block">
                      ({c.year})
                    </span>
                  )}
                </div>
              </div>

              <blockquote className="font-serif text-[1.05rem] leading-relaxed text-slate-200 border-l-2 border-amber-500/40 pl-3 italic">
                "{c.text}"
              </blockquote>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-500">
                  <ExternalLink className="w-3 h-3" />
                  Cross-linked to: {c.targetVerses.join(', ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
