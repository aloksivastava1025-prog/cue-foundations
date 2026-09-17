/**
 * Cue Foundations · Expandable Book Search Palette
 * ────────────────────────────────────────────
 * An expandable search bar that reveals a filterable genre grid via a grid-rows accordion trick, styled with clean editorial typography.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/expandable-book-search-palette.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue075
 *
 * Original Cue ID: cue075
 * Category: Forms
 * ────────────────────────────────────────────
 */

/**
 * Book Search Palette — Expandable Command Bar with Genre Grid
 *
 * Zero deps. Pure CSS grid-rows accordion + substring filter.
 *
 * Usage:
 *   <BookSearchPalette onSelect={(g) => navigate(`/genre/${g}`)} />
 *
 * With custom genres:
 *   <BookSearchPalette genres={['Design', 'Poetry', ...]} />
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';

interface BookSearchPaletteProps {
  title?: string;
  placeholder?: string;
  genres?: string[];
  onSelect?: (genre: string) => void;
}

const DEFAULT_GENRES = [
  'Art', 'Biography', 'Business', "Children's",
  'Christian', 'Classics', 'Comics', 'Cookbooks',
  'Ebooks', 'Fantasy', 'Fiction', 'Graphic Novels',
  'Historical Fiction', 'History', 'Horror', 'Memoir',
  'Music', 'Mystery', 'Nonfiction', 'Poetry',
  'Psychology', 'Romance', 'Science', 'Science Fiction',
  'Self Help', 'Sports', 'Thriller', 'Travel',
  'Young Adult', 'More genres',
];

export default function BookSearchPalette({
  title = 'Search and browse books',
  placeholder = 'Title / Author / ISBN',
  genres = DEFAULT_GENRES,
  onSelect,
}: BookSearchPaletteProps) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!query) return genres;
    const q = query.toLowerCase();
    return genres.filter(g => g.toLowerCase().includes(q));
  }, [query, genres]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('click', onDown);
    return () => document.removeEventListener('click', onDown);
  }, []);

  function handleSelect(g: string) {
    onSelect?.(g);
    setExpanded(false);
    setQuery('');
  }

  return (
    <>
      <style>{CSS}</style>
      <div ref={wrapperRef} className={`bsp-wrapper ${expanded ? 'expanded' : ''}`}>
        <h2 className="bsp-title">{title}</h2>

        <div className="bsp-search">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setExpanded(true)}
          />
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <div className="bsp-modal-wrap">
          <div className="bsp-modal">
            <div className="bsp-content">
              {filtered.length > 0 ? (
                <div className="bsp-grid">
                  {filtered.map(g => (
                    <a key={g} className="bsp-link" onClick={() => handleSelect(g)}>{g}</a>
                  ))}
                </div>
              ) : (
                <div className="bsp-empty">No genres found matching your search.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const CSS = `
.bsp-wrapper {
  width: 700px; max-width: 100%;
  display: flex; flex-direction: column; gap: 12px;
  font-family: 'Inter', system-ui, sans-serif;
  color: #1a1a1a;
  animation: bsp-popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes bsp-popIn {
  from { transform: scale(0.95); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.bsp-title {
  font-size: 18px; font-weight: 500;
  margin: 0 0 4px 4px;
  letter-spacing: -0.2px;
}

.bsp-search {
  background: #fff; border-radius: 12px;
  padding: 16px 20px; display: flex; align-items: center; gap: 12px;
  border: 1px solid transparent;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}
.bsp-search:focus-within {
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  border-color: #e0e0e0;
}
.bsp-search input {
  border: none; outline: none;
  font-size: 15px; font-family: inherit;
  flex: 1; color: #1a1a1a; background: transparent;
}
.bsp-search input::placeholder { color: #a0a0a0; }
.bsp-search svg { color: #a0a0a0; width: 20px; height: 20px; flex-shrink: 0; }

.bsp-modal-wrap {
  display: grid; grid-template-rows: 0fr;
  opacity: 0; pointer-events: none;
  transform: translateY(-10px);
  transition: grid-template-rows 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.4s ease,
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.bsp-wrapper.expanded .bsp-modal-wrap {
  grid-template-rows: 1fr; opacity: 1; pointer-events: auto; transform: translateY(0);
}
.bsp-modal {
  background: #fff; border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  overflow: hidden;
  display: flex; flex-direction: column;
  min-height: 0;
}
.bsp-content {
  padding: 24px; max-height: 400px; overflow-y: auto;
}
.bsp-content::-webkit-scrollbar { width: 6px; }
.bsp-content::-webkit-scrollbar-track { background: transparent; }
.bsp-content::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }

.bsp-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 12px 16px;
}
.bsp-link {
  font-size: 13px; color: #00635d;
  text-decoration: none; cursor: pointer;
  padding: 4px 0; display: block;
  transition: color 0.2s;
}
.bsp-link:hover { color: #004d48; text-decoration: underline; }

.bsp-empty {
  text-align: center; padding: 20px;
  color: #888888; font-size: 14px;
}

@media (max-width: 700px) {
  .bsp-wrapper { width: calc(100% - 32px); }
  .bsp-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 500px) {
  .bsp-grid { grid-template-columns: repeat(2, 1fr); }
  .bsp-title { font-size: 16px; }
  .bsp-search { padding: 14px 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .bsp-wrapper { animation: none; }
  .bsp-modal-wrap { transition: opacity 0.2s ease !important; }
}
`;
