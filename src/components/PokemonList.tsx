import React, { useEffect, useState, useCallback, useRef } from 'react';
import { fetchPokemonList, fetchPokemon, searchPokemon } from '../api/pokeApi';
import { Pokemon } from '../types/pokemon';
import PokemonCard from './PokemonCard';
import PokemonDetail from './PokemonDetail';
import { typeColors } from '../utils/helpers';

const ALL_TYPES = Object.keys(typeColors);
const PAGE_SIZE = 40;

const PokemonList: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState('');
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState<Pokemon | null | undefined>(undefined);
  const [searchLoading, setSearchLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial load
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const list = await fetchPokemonList(PAGE_SIZE, 0);
      const data = await Promise.all(list.map((p: { name: string }) => fetchPokemon(p.name)));
      setPokemons(data);
      setLoading(false);
    };
    load();
  }, []);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !query && activeTypes.length === 0) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, query, activeTypes, offset]);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const newOffset = offset + PAGE_SIZE;
    const list = await fetchPokemonList(PAGE_SIZE, newOffset);
    if (list.length === 0) { setHasMore(false); setLoadingMore(false); return; }
    const data = await Promise.all(list.map((p: { name: string }) => fetchPokemon(p.name)));
    setPokemons(prev => {
      const ids = new Set(prev.map(p => p.id));
      return [...prev, ...data.filter(p => !ids.has(p.id))];
    });
    setOffset(newOffset);
    setLoadingMore(false);
  };

  // Search debounce
  const handleSearch = useCallback((val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setSearchResult(undefined); return; }
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      const result = await searchPokemon(val);
      setSearchResult(result);
      setSearchLoading(false);
    }, 500);
  }, []);

  const toggleType = (type: string) => {
    setActiveTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Filtered list
  const filtered = (query.trim() && searchResult !== undefined)
    ? (searchResult ? [searchResult] : [])
    : pokemons.filter(p =>
        activeTypes.length === 0 ||
        p.types.some(t => activeTypes.includes(t.type.name))
      );

  return (
    <div>
      {/* Search bar */}
      <div className="mb-6 relative max-w-md">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search by name or ID..."
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-11 pr-4 py-3
            text-sm font-body text-white/80 placeholder-white/20
            focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all"
        />
        {searchLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Type filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {ALL_TYPES.map(type => {
          const c = typeColors[type];
          const active = activeTypes.includes(type);
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`type-pill transition-all ${active ? c.pill + ' scale-105' : 'bg-white/5 text-white/25 border border-white/10 hover:text-white/50'}`}
            >
              {type}
            </button>
          );
        })}
        {activeTypes.length > 0 && (
          <button
            onClick={() => setActiveTypes([])}
            className="type-pill bg-white/10 text-white/40 border border-white/10 hover:text-white/70 transition-all"
          >
            ✕ clear
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] h-44 shimmer-bg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-white/25 font-mono tracking-widest text-sm">
          {query ? 'NO POKÉMON FOUND' : 'NO RESULTS'}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((p, i) => (
            <PokemonCard key={p.id} pokemon={p} index={i} onClick={() => setSelected(p)} />
          ))}
        </div>
      )}

      {/* Infinite scroll loader */}
      {!query && activeTypes.length === 0 && (
        <div ref={loaderRef} className="mt-8 flex justify-center py-4">
          {loadingMore && (
            <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <PokemonDetail pokemon={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default PokemonList;
