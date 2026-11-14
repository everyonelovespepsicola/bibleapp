# AGENTS.md — ScriptureFlow Development Guide & Agent Instructions

This document provides system instructions, architectural guidelines, operational workflows, and domain context for AI agents and developers working on the **ScriptureFlow** codebase.

---

## 1. Project Overview & Architecture

**ScriptureFlow** is a modern, high-performance Bible study web application built with:
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS (via `@tailwindcss/vite`)
- **Icons**: `lucide-react`
- **Testing**: `vitest`
- **Build Tool**: Vite
- **Storage**: IndexedDB (via `idb`) for offline caching of translations and concordance dictionaries
- **Deployment**: Automated GitHub Pages deployment via `.github/workflows/deploy.yml`

Repository: `https://github.com/everyonelovespepsicola/bibleapp`
Live Site: `https://everyonelovespepsicola.github.io/bibleapp/`

---

## 2. Core Modules & Directory Layout

- `src/types/bible.ts`: Canonical TypeScript interfaces for translations, books, chapters, verses, Strong's entries, and search queries.
- `src/utils/referenceParser.ts`:
  - Parses colon (`John 3:16`, `Gen 1:1-5`), space (`John 3 16`, `mat 13 12`), and fused shorthand (`joh 113`).
  - Supports multi-reference queries separated by semicolons (`;`) or newlines (e.g., `Gen 1:1; John 3:16; Rom 8:28`).
  - Guards against parsing Strong's numbers (`^[HG]\d{1,5}$`) as scripture references.
- `src/utils/books.ts`: Full canonical meta-index of all 66 books with testament designation (`OT` / `NT`), chapter counts, and abbreviations/aliases.
- `src/utils/searchEngine.ts`: Full-Bible keyword, passage range, and Strong's concordance search engine.
- `src/utils/clipboard.tsx`: Dual-format HTML (`text/html`) and plain text clipboard generator that preserves translator-added italics (`<i>word</i>`) for seamless pasting into Microsoft PowerPoint, Word, and Google Slides.
- `src/components/ChapterReader.tsx`: Dual layout reader (Paragraph Flow vs. Verse-by-verse list) with interactive Strong's chips.
- `src/components/StudyDrawer.tsx`: Pinned right-hand study card showing lemma, phonetic pronunciation, definition, family roots, and concordance search.
- `src/components/SearchResultsView.tsx`: Displays keyword, multi-passage, and concordance matches with a unified track-riding page scrubber and direct jump input.
- `src/components/ConcordanceCardView.tsx`: Flipped layout main card presenting the exhaustive Greek/Hebrew lexicon view on the left.
- `src/components/VersesStreamDrawer.tsx`: Pinned right-hand companion stream listing every Bible occurrence of a selected Strong's root.
- `public/kjv.json`: 31,102 verses with canonical paragraph breaks, translator italics, and 781,600+ Strong's concordance mappings.
- `public/strongs_lexicon.json`: Exhaustive lexicon entries for Hebrew (`H1`–`H8674` + prefixes `H8711`–`H8714`) and Greek (`G1`–`G5624`).

---

## 3. Biblical Languages & Concordance Principles

When modifying concordance data, tags, or search features, agents must adhere to the following principles:

1. **Strict Language Separation**:
   - Old Testament is Biblical Hebrew/Aramaic (`H1`–`H8674`).
   - New Testament is Koine Greek (`G1`–`G5624`).
   - Old and New Testament never share Strong's numbers, even when the English translation uses identical words (e.g., *Peace* is `H7965` in Hebrew and `G1515` in Greek; *Love* is `H157`/`H2617` in Hebrew and `G25`/`G26`/`G5368` in Greek).
2. **Lexicon vs. Commentary**:
   - Concordance definitions must remain strictly linguistic and literal (dictionary definitions of roots, lemmas, and etymologies). Do not inject theological commentaries into lexical entries.
3. **Inseparable Prefixes & Fused Words**:
   - In Hebrew, prepositions and articles are prefixes (e.g., `הַ-` [H8712], `וְ-` [H8711], `בְּ-` [H8713], `לְ-` [H8714]). In Greek, particles and articles (`ὁ` [G3588], `καί` [G2532]) are distinct.
   - Verbs frequently fuse pronouns (e.g., *thou*, *thee*, *ye*, *I*). These map to the corresponding pronominal entries (`H859`, `G4771`, `G4675`, `G5210`, `H589`, `G1473`).

---

## 4. Coding Conventions & Invariants

1. **TypeScript Strictness**:
   - Ensure `verbatimModuleSyntax` compatibility: use `import type { ... }` for type-only imports.
   - Clean up any unused imports or variables (`TS6133`) to prevent build failures.
2. **Path Resolution**:
   - Vite `base` is configured as `./`. Assets must resolve relative to `import.meta.env.BASE_URL` so GitHub Pages subpaths operate cleanly.
3. **Formatting Preservation**:
   - Translator-added words in the KJV are bracketed with asterisks (`*word*`) in `text`.
   - Never strip these asterisks destructively from base text data; render them as italics (`<i>word</i>`) in the UI and clipboard helpers.
4. **Testing Before Pushing**:
   - Always run `npx vitest run` and `npm run build` before pushing commits to verify all unit and audit tests pass.

---

## 5. Deployment Workflow

- Deployments are automated through GitHub Actions upon pushing to the `main` branch.
- Windows deployment script: `publish.ps1` (verifies tools via `winget`, builds Vite project).
- When committing changes, push directly to `origin main` and verify with `gh run list --repo everyonelovespepsicola/bibleapp`.
