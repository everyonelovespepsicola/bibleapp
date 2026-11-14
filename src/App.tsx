import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  Upload,
  ChevronDown,
  Sparkles,
  Library,
  Trash2,
  GraduationCap,
  PanelRightClose,
  PanelRightOpen,
  ArrowRightLeft,
} from 'lucide-react';
import type { BibleTranslation, FlatVerse, StrongsEntry } from './types/bible';
import { parseVerseReference } from './utils/referenceParser';
import { searchBible, type SearchResult } from './utils/searchEngine';
import { ChapterReader } from './components/ChapterReader';
import { SearchResultsView } from './components/SearchResultsView';
import { BookNavigator } from './components/BookNavigator';
import { JsonImporterModal } from './components/JsonImporterModal';
import { StudyDrawer } from './components/StudyDrawer';
import { ConcordanceCardView } from './components/ConcordanceCardView';
import { VersesStreamDrawer } from './components/VersesStreamDrawer';
import { SwipeableBottomSheet } from './components/SwipeableBottomSheet';
import {
  getAllTranslations,
  saveTranslation,
  deleteTranslation,
} from './services/db';

export function App() {
  const [translations, setTranslations] = useState<BibleTranslation[]>([]);
  const [activeTranslationId, setActiveTranslationId] = useState<string>('kjv');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Navigation State
  const [currentBookIndex, setCurrentBookIndex] = useState<number>(0); // Genesis
  const [currentChapter, setCurrentChapter] = useState<number>(1); // Chapter 1
  const [highlightRange, setHighlightRange] = useState<{ start?: number; end?: number } | undefined>(undefined);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submittedQuery, setSubmittedQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [viewMode, setViewMode] = useState<'reader' | 'search'>('reader');

  // Study Mode & Lexicon State
  const [isStudyMode, setIsStudyMode] = useState<boolean>(false);
  const [studyLayoutOrientation, setStudyLayoutOrientation] = useState<'scripture-first' | 'concordance-first'>('scripture-first');
  const [strongsLexicon, setStrongsLexicon] = useState<Record<string, StrongsEntry>>({});
  const [selectedStrongsEntry, setSelectedStrongsEntry] = useState<StrongsEntry | null>(null);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [isStudyDrawerOpen, setIsStudyDrawerOpen] = useState<boolean>(false);

  // Modals & Panels
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
  const [isTranslationMenuOpen, setIsTranslationMenuOpen] = useState(false);
  const translationMenuRef = useRef<HTMLDivElement>(null);

  // Close translation dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isTranslationMenuOpen &&
        translationMenuRef.current &&
        !translationMenuRef.current.contains(event.target as Node)
      ) {
        setIsTranslationMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTranslationMenuOpen]);

  // 1. Initialize Bibles and Strong's Lexicon
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const base = import.meta.env.BASE_URL.endsWith('/')
          ? import.meta.env.BASE_URL
          : `${import.meta.env.BASE_URL}/`;

        const stored = await getAllTranslations();
        let defaultKjv: BibleTranslation | null = null;

        // Ensure KJV with 100% full-lexical Strongs coverage is loaded
        const existingKjv = stored.find((t) => t.id === 'kjv');
        const exoVerse = existingKjv?.books?.[0]?.chapters?.[0]?.verses?.[20]?.strongsText;
        const hasFullCoverage = exoVerse && exoVerse.includes('living[H2416]') && exoVerse.includes('every[H3605]') && exoVerse.includes('brought[H935]');

        if (!existingKjv || !hasFullCoverage) {
          const resp = await fetch(`${base}kjv.json`);
          if (resp.ok) {
            defaultKjv = await resp.json();
            if (defaultKjv) {
              await saveTranslation(defaultKjv);
            }
          }
        }

        // Ensure WEB is loaded
        const existingWeb = stored.find((t) => t.id === 'web');
        if (!existingWeb) {
          try {
            const respWeb = await fetch(`${base}web.json`);
            if (respWeb.ok) {
              const webData = await respWeb.json();
              if (webData) {
                await saveTranslation(webData);
              }
            }
          } catch (errWeb) {
            console.warn('Could not preload WEB:', errWeb);
          }
        }

        const freshList = await getAllTranslations();
        setTranslations(freshList);

        if (freshList.length > 0) {
          const kjv = freshList.find((t) => t.id === 'kjv');
          setActiveTranslationId(kjv ? kjv.id : freshList[0].id);
        }

        // Preload Strong's Lexicon
        try {
          const respLex = await fetch(`${base}strongs_lexicon.json`);
          if (respLex.ok) {
            const lexData = await respLex.json();
            setStrongsLexicon(lexData);
          }
        } catch (eLex) {
          console.warn('Failed to load Strongs Lexicon:', eLex);
        }
      } catch (e) {
        console.error('Failed to load translations:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const activeTranslation =
    translations.find((t) => t.id === activeTranslationId) || translations[0];

  const currentBook = activeTranslation?.books[currentBookIndex] || activeTranslation?.books[0];
  const currentChapterObj = currentBook?.chapters.find((c) => c.chapter === currentChapter) || currentBook?.chapters[0];

  // Memoized concordance occurrences for currently selected Strong's root
  const currentStrongsVerses = React.useMemo(() => {
    if (!selectedStrongsEntry || !activeTranslation) return [];
    const searchRes = searchBible(activeTranslation, selectedStrongsEntry.number);
    return searchRes.verses;
  }, [selectedStrongsEntry?.number, activeTranslation]);

  // Strong's interaction
  const handleWordClick = (word: string, strongsId: string) => {
    const entry = strongsLexicon[strongsId.toUpperCase()];
    if (entry) {
      setSelectedStrongsEntry(entry);
      setSelectedWord(word);
      setIsStudyDrawerOpen(true);
    }
  };

  const handleSelectRelatedStrongs = (relatedId: string) => {
    const entry = strongsLexicon[relatedId.toUpperCase()];
    if (entry) {
      setSelectedStrongsEntry(entry);
      setSelectedWord(entry.lemma);
      setIsStudyDrawerOpen(true);
    }
  };

  const handleSearchStrongs = (strongsId: string) => {
    setSearchQuery(strongsId);
    const result = searchBible(activeTranslation, strongsId);
    setSearchResult(result);
    setSubmittedQuery(strongsId);
    setViewMode('search');
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query || !activeTranslation) return;

    const ref = parseVerseReference(query);
    const result = searchBible(activeTranslation, query);

    setSearchResult(result);
    setSubmittedQuery(query);

    if (ref && result.type === 'reference' && ref.startVerse === undefined) {
      setCurrentBookIndex(ref.matchedBookIndex);
      setCurrentChapter(ref.chapter);
      setHighlightRange(undefined);
      setViewMode('reader');
    } else {
      setViewMode('search');
    }
  };

  const handleSelectVerseFromSearch = (verse: FlatVerse) => {
    if (!activeTranslation) return;
    const bIdx = activeTranslation.books.findIndex((b) => b.name === verse.bookName);
    if (bIdx !== -1) {
      setCurrentBookIndex(bIdx);
      setCurrentChapter(verse.chapter);
      setHighlightRange({ start: verse.verse, end: verse.verse });
      setViewMode('reader');
      setTimeout(() => {
        const el = document.getElementById(`verse-${verse.verse}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  };

  const handleImportSuccess = async (newTranslation: BibleTranslation) => {
    await saveTranslation(newTranslation);
    const updated = await getAllTranslations();
    setTranslations(updated);
    setActiveTranslationId(newTranslation.id);
  };

  const handleDeleteCustomTranslation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this custom translation?')) {
      await deleteTranslation(id);
      const updated = await getAllTranslations();
      setTranslations(updated);
      if (activeTranslationId === id) {
        setActiveTranslationId(updated[0]?.id || 'kjv');
      }
    }
  };

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
      setHighlightRange(undefined);
    } else if (currentBookIndex > 0) {
      const prevBook = activeTranslation.books[currentBookIndex - 1];
      setCurrentBookIndex(currentBookIndex - 1);
      setCurrentChapter(prevBook.chapters.length);
      setHighlightRange(undefined);
    }
  };

  const handleNextChapter = () => {
    if (!currentBook) return;
    if (currentChapter < currentBook.chapters.length) {
      setCurrentChapter(currentChapter + 1);
      setHighlightRange(undefined);
    } else if (currentBookIndex < activeTranslation.books.length - 1) {
      setCurrentBookIndex(currentBookIndex + 1);
      setCurrentChapter(1);
      setHighlightRange(undefined);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-serif">Preparing Holy Scriptures & Strong's Lexicon...</h2>
        <p className="text-xs text-slate-500 mt-2">Loading King James Version (KJV) & Hebrew/Greek Concordance</p>
      </div>
    );
  }

  return (
    <div className="h-full h-[100dvh] bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex-shrink-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Current Book Button */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-xl shadow-md shadow-amber-500/20 text-slate-950 font-bold">
                <Library className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-lg tracking-tight text-white hidden md:inline">
                ScriptureFlow
              </span>
            </div>

            {/* Book & Chapter Picker Pill */}
            <button
              onClick={() => setIsNavigatorOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-sm font-medium transition cursor-pointer text-slate-200"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>
                {currentBook?.name} {currentChapter}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Translation Picker Dropdown */}
            <div className="relative" ref={translationMenuRef}>
              <button
                onClick={() => setIsTranslationMenuOpen(!isTranslationMenuOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-semibold uppercase tracking-wider text-amber-400 transition cursor-pointer"
              >
                <span>{activeTranslation?.abbreviation || 'KJV'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isTranslationMenuOpen && (
                <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Available Translations
                  </div>
                  {translations.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setActiveTranslationId(t.id);
                        setIsTranslationMenuOpen(false);
                      }}
                      className={`px-3 py-2 text-xs flex items-center justify-between cursor-pointer hover:bg-slate-800 ${
                        activeTranslationId === t.id ? 'bg-amber-500/10 text-amber-300 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="font-bold mr-1.5">{t.abbreviation}:</span>
                        <span>{t.name}</span>
                      </div>
                      {t.isCustom && (
                        <button
                          onClick={(e) => handleDeleteCustomTranslation(t.id, e)}
                          className="text-slate-500 hover:text-red-400 p-1"
                          title="Delete translation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="border-t border-slate-800 mt-2 pt-2 px-2">
                    <button
                      onClick={() => {
                        setIsTranslationMenuOpen(false);
                        setIsImporterOpen(true);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg text-xs font-medium transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Absorb / Import JSON Bible</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Study Mode Toggle Button */}
            <button
              onClick={() => {
                const nextMode = !isStudyMode;
                setIsStudyMode(nextMode);
                // On desktop, auto-open drawer only if an entry is selected or user clicks a word
                if (nextMode && selectedStrongsEntry) {
                  setIsStudyDrawerOpen(true);
                } else if (!nextMode) {
                  setIsStudyDrawerOpen(false);
                }
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer border ${
                isStudyMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Toggle Strong's Concordance and Interlinear Study Mode"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Study Mode</span>
            </button>

            {/* Concordance-First vs Scripture-First Flip Switch */}
            {isStudyMode && selectedStrongsEntry && (
              <button
                onClick={() =>
                  setStudyLayoutOrientation((prev) =>
                    prev === 'scripture-first' ? 'concordance-first' : 'scripture-first'
                  )
                }
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                  studyLayoutOrientation === 'concordance-first'
                    ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-md shadow-sky-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700'
                }`}
                title="Flip View: Put Concordance/Lexicon on Main Left, Bible Verses stream on Right"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>
                  {studyLayoutOrientation === 'concordance-first'
                    ? 'Concordance View'
                    : 'Flip to Concordance'}
                </span>
              </button>
            )}
          </div>

          {/* Search Bar Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full sm:max-w-md flex items-center relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder='Search "John 3:4-10", "H7225", or words...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-24 py-2 bg-slate-800/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />

              <button
                type="submit"
                className="absolute right-1.5 top-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg transition shadow-xs cursor-pointer"
              >
                Go
              </button>
            </div>
          </form>

          {/* Actions: Import & Drawer Toggle */}
          <div className="hidden sm:flex items-center space-x-2">
            {isStudyMode && (
              <button
                onClick={() => setIsStudyDrawerOpen(!isStudyDrawerOpen)}
                className="p-2 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-800 transition border border-slate-800"
                title={isStudyDrawerOpen ? 'Collapse Study Panel' : 'Expand Study Panel'}
              >
                {isStudyDrawerOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={() => setIsImporterOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-medium transition cursor-pointer shadow-xs"
              title="Absorb custom JSON translation"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Import JSON</span>
            </button>
          </div>
        </div>

        {/* Quick Examples Helper Strip */}
        <div className="bg-slate-900/60 border-t border-slate-800/40 px-4 py-1.5 text-[11px] text-slate-400 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="font-medium text-slate-300">Try quick lookups:</span>
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pl-3">
            {[
              'John 3:4-10',
              'John 3 4-10',
              'Genesis 1:1-5',
              'H7225',
              'G3056',
              'Psalm 23',
              'light of the world',
            ].map((eg) => (
              <button
                key={eg}
                onClick={() => {
                  setSearchQuery(eg);
                  const ref = parseVerseReference(eg);
                  const result = searchBible(activeTranslation, eg);
                  setSearchResult(result);
                  setSubmittedQuery(eg);
                  if (ref && result.type === 'reference' && ref.startVerse === undefined) {
                    setCurrentBookIndex(ref.matchedBookIndex);
                    setCurrentChapter(ref.chapter);
                    setHighlightRange(undefined);
                    setViewMode('reader');
                  } else {
                    setViewMode('search');
                  }
                }}
                className="hover:text-amber-300 bg-slate-800/80 hover:bg-slate-700 px-2 py-0.5 rounded text-[11px] whitespace-nowrap transition cursor-pointer"
              >
                {eg}
              </button>
            ))}
          </div>
          {viewMode === 'search' && (
            <button
              onClick={() => setViewMode('reader')}
              className="ml-4 text-xs font-semibold text-amber-400 hover:underline flex-shrink-0"
            >
              Back to Full Reader →
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area (Dual Split Screen in Study Mode) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left / Center: Main Scripture Reader or Search View with Independent Scrolling */}
        <main className={`flex-1 h-full overflow-y-auto pb-16 transition-all duration-300 ${
          isStudyMode && isStudyDrawerOpen ? 'lg:pr-4' : ''
        }`}>
          {viewMode === 'search' && searchResult ? (
            <SearchResultsView
              result={searchResult}
              rawQuery={submittedQuery}
              onSelectVerse={handleSelectVerseFromSearch}
              onBackToReader={() => setViewMode('reader')}
              previousLocation={{
                bookName: currentBook?.name || 'Scripture',
                chapter: currentChapter,
              }}
            />
          ) : isStudyMode && studyLayoutOrientation === 'concordance-first' && selectedStrongsEntry ? (
            <ConcordanceCardView
              entry={selectedStrongsEntry}
              selectedWord={selectedWord}
              concordanceVerses={currentStrongsVerses}
              onSelectRelatedStrongs={handleSelectRelatedStrongs}
              onSelectVerse={handleSelectVerseFromSearch}
              onFlipBackToScriptureFirst={() => setStudyLayoutOrientation('scripture-first')}
            />
          ) : (
            <ChapterReader
              bookName={currentBook?.name || 'Genesis'}
              chapterNumber={currentChapter}
              verses={currentChapterObj?.verses || []}
              highlightRange={highlightRange}
              onPrevChapter={handlePrevChapter}
              onNextChapter={handleNextChapter}
              hasPrev={currentBookIndex > 0 || currentChapter > 1}
              hasNext={
                currentBookIndex < (activeTranslation?.books.length || 0) - 1 ||
                currentChapter < (currentBook?.chapters.length || 0)
              }
              isStudyMode={isStudyMode}
              onWordClick={handleWordClick}
            />
          )}
        </main>

        {/* Desktop Right Pane: Permanent Side-by-Side on Desktop/Tablets */}
        {isStudyMode && isStudyDrawerOpen && (
          <aside className="hidden md:flex md:w-[380px] lg:w-[460px] xl:w-[520px] flex-shrink-0 h-full border-l border-slate-800 overflow-hidden">
            {studyLayoutOrientation === 'concordance-first' ? (
              <VersesStreamDrawer
                strongsId={selectedStrongsEntry?.number || ''}
                selectedWord={selectedWord}
                verses={currentStrongsVerses}
                onSelectVerse={handleSelectVerseFromSearch}
                onFlipBackToScriptureFirst={() => setStudyLayoutOrientation('scripture-first')}
                onClose={() => setIsStudyDrawerOpen(false)}
              />
            ) : (
              <StudyDrawer
                entry={selectedStrongsEntry}
                selectedWord={selectedWord}
                onClose={() => setIsStudyDrawerOpen(false)}
                onSearchStrongs={handleSearchStrongs}
                onSelectRelatedStrongs={handleSelectRelatedStrongs}
                onFlipToConcordanceFirst={() => setStudyLayoutOrientation('concordance-first')}
              />
            )}
          </aside>
        )}
      </div>

      {/* Mobile Swipeable Bottom Sheet: Scripture text stays full-width underneath; inspector slides over lower half */}
      <SwipeableBottomSheet
        isOpen={Boolean(isStudyMode && isStudyDrawerOpen && selectedStrongsEntry)}
        onClose={() => setIsStudyDrawerOpen(false)}
      >
        {studyLayoutOrientation === 'concordance-first' ? (
          <VersesStreamDrawer
            strongsId={selectedStrongsEntry?.number || ''}
            selectedWord={selectedWord}
            verses={currentStrongsVerses}
            onSelectVerse={(v) => {
              handleSelectVerseFromSearch(v);
              setIsStudyDrawerOpen(false);
            }}
            onFlipBackToScriptureFirst={() => setStudyLayoutOrientation('scripture-first')}
            onClose={() => setIsStudyDrawerOpen(false)}
          />
        ) : (
          <StudyDrawer
            entry={selectedStrongsEntry}
            selectedWord={selectedWord}
            onClose={() => setIsStudyDrawerOpen(false)}
            onSearchStrongs={(id) => {
              handleSearchStrongs(id);
              setIsStudyDrawerOpen(false);
            }}
            onSelectRelatedStrongs={handleSelectRelatedStrongs}
            onFlipToConcordanceFirst={() => setStudyLayoutOrientation('concordance-first')}
          />
        )}
      </SwipeableBottomSheet>

      {/* Book & Chapter Modal Navigator */}
      <BookNavigator
        isOpen={isNavigatorOpen}
        onClose={() => setIsNavigatorOpen(false)}
        books={activeTranslation?.books || []}
        selectedBookIndex={currentBookIndex}
        selectedChapter={currentChapter}
        onSelect={(bIdx, chap) => {
          setCurrentBookIndex(bIdx);
          setCurrentChapter(chap);
          setHighlightRange(undefined);
          setViewMode('reader');
        }}
      />

      {/* JSON Absorption Importer Modal */}
      <JsonImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}

export default App;
