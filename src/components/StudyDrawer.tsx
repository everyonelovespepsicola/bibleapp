import React, { useState, useEffect } from 'react';
import type { StrongsEntry } from '../types/bible';
import type { EgwComment, EgwChapterData, StudyDrawerTab } from '../types/egw';
import { getEgwChapter, getEgwChapterAsync } from '../utils/egwService';
import { X, Search, Link as LinkIcon, Compass, ArrowRightLeft, ChevronLeft, ChevronRight, BookOpen, Feather, ArrowLeft } from 'lucide-react';
import { LexiconBody } from './LexiconBody';
import { EgwNotesBody } from './EgwNotesBody';
import { EgwChapterReader } from './EgwChapterReader';

interface StudyDrawerProps {
  entry: StrongsEntry | null;
  selectedWord: string;
  onClose: () => void;
  onSearchStrongs: (strongsId: string) => void;
  onSelectRelatedStrongs: (strongsId: string) => void;
  onFlipToConcordanceFirst?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onHistoryBack?: () => void;
  onHistoryForward?: () => void;

  // EGW Notes tab props
  activeTab?: StudyDrawerTab;
  onTabChange?: (tab: StudyDrawerTab) => void;
  currentVerseReference?: string;
  currentVerseText?: string;
  egwComments?: EgwComment[];

  // External chapter reader direct trigger
  directEgwChapterTarget?: { bookAbbrev: string; chapterNumber: number; activePageRef?: string } | null;
  onClearDirectEgwChapterTarget?: () => void;
}

export const StudyDrawer: React.FC<StudyDrawerProps> = ({
  entry,
  selectedWord,
  onClose,
  onSearchStrongs,
  onSelectRelatedStrongs,
  onFlipToConcordanceFirst,
  canGoBack = false,
  canGoForward = false,
  onHistoryBack,
  onHistoryForward,
  activeTab = 'strongs',
  onTabChange,
  currentVerseReference = '',
  currentVerseText = '',
  egwComments = [],
  directEgwChapterTarget = null,
  onClearDirectEgwChapterTarget,
}) => {
  // Reading chapter state for EGW books
  const [readingChapterTarget, setReadingChapterTarget] = useState<{
    bookAbbrev: string;
    chapterNumber: number;
    activePageRef?: string;
  } | null>(null);

  const [activeEgwChapterData, setActiveEgwChapterData] = useState<EgwChapterData | null>(null);

  // When user clicks a new verse in the scripture reader, automatically reset full-chapter reader back to Notes view
  useEffect(() => {
    setReadingChapterTarget(null);
  }, [currentVerseReference]);

  // Handle external direct open from Library modal
  useEffect(() => {
    if (directEgwChapterTarget) {
      setReadingChapterTarget(directEgwChapterTarget);
    }
  }, [directEgwChapterTarget]);

  useEffect(() => {
    if (!readingChapterTarget) {
      setActiveEgwChapterData(null);
      return;
    }
    // First try synchronous lookup from memory cache
    const cached = getEgwChapter(
      readingChapterTarget.bookAbbrev,
      readingChapterTarget.chapterNumber,
      readingChapterTarget.activePageRef
    );
    if (cached) {
      setActiveEgwChapterData(cached);
    }
    // Then ensure async fetch from IndexedDB / JSON if not found or to ensure full book
    getEgwChapterAsync(
      readingChapterTarget.bookAbbrev,
      readingChapterTarget.chapterNumber,
      readingChapterTarget.activePageRef
    ).then((data) => {
      if (data) {
        setActiveEgwChapterData(data);
      }
    });
  }, [readingChapterTarget]);

  const isHebrew = entry ? entry.number.startsWith('H') : false;
  const langLabel = isHebrew ? 'Ancient Hebrew' : 'Koine Greek';

  // Find linked root numbers in the description like "H7218" or "G3056"
  const rootMatches = entry
    ? Array.from(new Set(entry.description.match(/[HG]\d{1,5}/gi) || [])).filter(
        (m) => m.toUpperCase() !== entry.number.toUpperCase()
      )
    : [];

  const handleOpenChapter = (comment: EgwComment) => {
    if (comment.chapterNumber) {
      setReadingChapterTarget({
        bookAbbrev: comment.sourceAbbrev,
        chapterNumber: comment.chapterNumber,
        activePageRef: comment.pageRef,
      });
    }
  };

  const handleNavigateChapter = (chapNum: number) => {
    if (readingChapterTarget) {
      setReadingChapterTarget({
        ...readingChapterTarget,
        chapterNumber: chapNum,
        activePageRef: undefined,
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 shadow-2xl overflow-y-auto">
      {/* Top Bar: Navigation / Close */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {activeTab === 'strongs' && (
            <div className="flex items-center space-x-1 mr-1">
              <button
                onClick={onHistoryBack}
                disabled={!canGoBack}
                className={`p-1.5 rounded-lg border transition ${
                  canGoBack
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 cursor-pointer shadow-xs active:scale-95'
                    : 'bg-slate-900/60 text-slate-600 border-slate-800/80 cursor-not-allowed'
                }`}
                title="Previous Word (Back)"
                aria-label="Previous Word"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onHistoryForward}
                disabled={!canGoForward}
                className={`p-1.5 rounded-lg border transition ${
                  canGoForward
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 cursor-pointer shadow-xs active:scale-95'
                    : 'bg-slate-900/60 text-slate-600 border-slate-800/80 cursor-not-allowed'
                }`}
                title="Next Word (Forward)"
                aria-label="Next Word"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === 'strongs' && entry ? (
            <>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {entry.number}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {langLabel}
              </span>
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              {readingChapterTarget && (
                <button
                  onClick={() => setReadingChapterTarget(null)}
                  className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg transition cursor-pointer shadow-xs active:scale-95 normal-case"
                  title="Return to verse notes list"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>Back to Notes</span>
                </button>
              )}
              <div className="flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5" />
                <span>
                  {readingChapterTarget && activeEgwChapterData
                    ? `${activeEgwChapterData.bookAbbrev} Ch. ${activeEgwChapterData.chapterNumber}`
                    : currentVerseReference || 'Verse Notes'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'strongs' && onFlipToConcordanceFirst && (
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

      {/* Segmented Option 1 Tab Switcher (Strong's Lexicon vs. EGW Notes) */}
      <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-800/80 bg-slate-900/90">
        <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setReadingChapterTarget(null);
              onTabChange?.('strongs');
            }}
            className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-bold transition ${
              activeTab === 'strongs'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Strong's Lexicon</span>
          </button>

          <button
            onClick={() => onTabChange?.('egw')}
            className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-bold transition ${
              activeTab === 'egw'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>EGW Notes {egwComments.length > 0 && `(${egwComments.length})`}</span>
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-6 flex-1">
        {activeTab === 'strongs' ? (
          !entry ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/40 border-l border-slate-800">
              <div className="p-3 bg-amber-500/10 rounded-2xl mb-4 text-amber-400">
                <Compass className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-200">Study & Lexicon Inspector</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                Click on any tagged word in the Scripture to dive into its original Hebrew/Greek root, pronunciation, Strong's definition, and occurrences.
              </p>
            </div>
          ) : (
            <>
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
            </>
          )
        ) : readingChapterTarget && activeEgwChapterData ? (
          /* Ellen G. White Full Chapter View */
          <EgwChapterReader
            chapterData={activeEgwChapterData}
            activePageRef={readingChapterTarget.activePageRef}
            onBackToNotes={() => {
              setReadingChapterTarget(null);
              if (onClearDirectEgwChapterTarget) onClearDirectEgwChapterTarget();
            }}
            onNavigateChapter={handleNavigateChapter}
          />
        ) : (
          /* Ellen G. White Notes List */
          <EgwNotesBody
            reference={currentVerseReference}
            comments={egwComments}
            verseText={currentVerseText}
            onOpenChapter={handleOpenChapter}
          />
        )}
      </div>
    </div>
  );
};
