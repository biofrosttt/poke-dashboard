import React, { useEffect, useState, useCallback } from 'react';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import { fetchPokemon, fetchPokemonSpecies, fetchEvolutionChain } from '../api/pokeApi';
import TypeBadge from './TypeBadge';
import StatBar from './StatBar';
import EvolutionChain from './EvolutionChain';
import { capitalize, getTypeColor, padId, parseEvolutionChain } from '../utils/helpers';

interface Props {
  pokemon: Pokemon;
  onClose: () => void;
}

type Tab = 'stats' | 'abilities' | 'moves';

const PokemonDetail: React.FC<Props> = ({ pokemon: initialPokemon, onClose }) => {
  const [pokemon, setPokemon] = useState<Pokemon>(initialPokemon);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evoChain, setEvoChain] = useState<{ name: string; id: number; minLevel?: number }[]>([]);
  const [shiny, setShiny] = useState(false);
  const [tab, setTab] = useState<Tab>('stats');
  const [loading, setLoading] = useState(true);

  const primaryType = pokemon.types[0]?.type.name ?? 'normal';
  const color = getTypeColor(primaryType);

  const sprite = shiny
    ? pokemon.sprites.other['official-artwork'].front_shiny ?? pokemon.sprites.front_shiny
    : pokemon.sprites.other['official-artwork'].front_default ?? pokemon.sprites.front_default;

  const loadSpecies = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const s = await fetchPokemonSpecies(id);
      setSpecies(s);
      const evo = await fetchEvolutionChain(s.evolution_chain.url);
      setEvoChain(parseEvolutionChain(evo.chain));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSpecies(pokemon.id);
  }, [pokemon.id, loadSpecies]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleEvoSelect = async (id: number) => {
    if (id === pokemon.id) return;
    const p = await fetchPokemon(id);
    setPokemon(p);
  };

  const flavorText = species?.flavor_text_entries
    .find(e => e.language.name === 'en')
    ?.flavor_text.replace(/\f/g, ' ') ?? '';

  const genus = species?.genera.find(g => g.language.name === 'en')?.genus ?? '';

  const totalStats = pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar
          bg-[#0d0d14] border border-white/10 rounded-3xl shadow-2xl animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent */}
        <div
          className={`absolute inset-x-0 top-0 h-48 opacity-15 bg-gradient-to-b ${color.bg} rounded-t-3xl`}
        />

        {/* Decorative circles */}
        <div
          className={`absolute right-8 top-8 w-40 h-40 rounded-full opacity-10 bg-gradient-to-br ${color.bg} blur-2xl`}
        />

        {/* Header row */}
        <div className="relative p-6 pb-0 flex justify-between items-start">
          <div>
            <span className="font-mono text-xs text-white/25 tracking-widest">#{padId(pokemon.id)}</span>
            {species?.is_legendary && (
              <span className="ml-2 text-[9px] font-mono px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 tracking-widest">
                LEGENDARY
              </span>
            )}
            {species?.is_mythical && (
              <span className="ml-2 text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 tracking-widest">
                MYTHICAL
              </span>
            )}
            <h2 className="font-display text-4xl tracking-widest text-white mt-1">
              {pokemon.name.toUpperCase()}
            </h2>
            {genus && <p className="text-sm text-white/35 mt-0.5 font-body">{genus}</p>}
            <div className="flex gap-2 mt-3 flex-wrap">
              {pokemon.types.map(t => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all text-sm"
          >
            ✕
          </button>
        </div>

        {/* Sprite + quick stats */}
        <div className="relative px-6 mt-4 flex gap-6 items-end">
          {/* Sprite */}
          <div className="relative shrink-0">
            <div
              className={`absolute inset-0 rounded-full blur-2xl opacity-30 bg-gradient-to-r ${color.bg}`}
              style={{ transform: 'scale(0.8) translateY(15%)' }}
            />
            <img
              src={sprite}
              alt={pokemon.name}
              className="relative w-40 h-40 object-contain drop-shadow-2xl pokemon-float"
            />
          </div>

          {/* Quick info */}
          <div className="flex-1 pb-2">
            {flavorText && (
              <p className="text-sm text-white/45 leading-relaxed mb-4 italic font-body">
                "{flavorText}"
              </p>
            )}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Height', value: `${(pokemon.height / 10).toFixed(1)}m` },
                { label: 'Weight', value: `${(pokemon.weight / 10).toFixed(1)}kg` },
                { label: 'Base EXP', value: pokemon.base_experience ?? '—' },
              ].map(item => (
                <div key={item.label} className="bg-white/5 rounded-xl p-2.5 text-center border border-white/5">
                  <div className="font-mono text-xs text-white/25 tracking-wider mb-1">{item.label}</div>
                  <div className="font-display text-lg text-white/80 tracking-wider">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shiny toggle */}
        <div className="px-6 mt-3">
          <button
            onClick={() => setShiny(s => !s)}
            className={`text-xs font-mono tracking-wider px-3 py-1.5 rounded-lg transition-all
              ${shiny ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-white/5 text-white/30 border border-white/10 hover:text-white/60'}`}
          >
            {shiny ? '✦ Shiny' : '✧ Normal'}
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 mt-5 border-b border-white/[0.06]">
          <div className="flex gap-0">
            {(['stats', 'abilities', 'moves'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-xs font-mono tracking-widest uppercase transition-all border-b-2 -mb-px
                  ${tab === t
                    ? 'text-white border-white/60'
                    : 'text-white/25 border-transparent hover:text-white/50'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {tab === 'stats' && (
            <div>
              <div className="space-y-1">
                {pokemon.stats.map((s, i) => (
                  <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} delay={i * 80} />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex justify-between items-center">
                <span className="font-mono text-xs text-white/25 tracking-wider">BASE TOTAL</span>
                <span className="font-display text-2xl tracking-wider text-white/80">{totalStats}</span>
              </div>
            </div>
          )}

          {tab === 'abilities' && (
            <div className="space-y-2">
              {pokemon.abilities.map(a => (
                <div
                  key={a.ability.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <span className="font-body text-sm text-white/70">{capitalize(a.ability.name)}</span>
                  {a.is_hidden && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 tracking-widest">
                      HIDDEN
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'moves' && (
            <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto no-scrollbar">
              {pokemon.moves.slice(0, 40).map(m => (
                <div
                  key={m.move.name}
                  className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-white/50"
                >
                  {capitalize(m.move.name)}
                </div>
              ))}
            </div>
          )}

          {/* Evolution chain */}
          {!loading && (
            <EvolutionChain chain={evoChain} currentId={pokemon.id} onSelect={handleEvoSelect} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
