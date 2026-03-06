export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');

export const padId = (id: number) => String(id).padStart(4, '0');

export const typeColors: Record<string, { bg: string; text: string; glow: string; pill: string }> = {
  fire:     { bg: 'from-red-500 to-orange-500',    text: '#ef4444', glow: 'rgba(239,68,68,0.4)',    pill: 'bg-red-500/20 text-red-300 border border-red-500/30' },
  water:    { bg: 'from-blue-500 to-cyan-500',     text: '#3b82f6', glow: 'rgba(59,130,246,0.4)',   pill: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
  grass:    { bg: 'from-green-500 to-lime-500',    text: '#22c55e', glow: 'rgba(34,197,94,0.4)',    pill: 'bg-green-500/20 text-green-300 border border-green-500/30' },
  electric: { bg: 'from-yellow-400 to-amber-400',  text: '#eab308', glow: 'rgba(234,179,8,0.4)',    pill: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' },
  psychic:  { bg: 'from-pink-500 to-purple-500',   text: '#ec4899', glow: 'rgba(236,72,153,0.4)',   pill: 'bg-pink-500/20 text-pink-300 border border-pink-500/30' },
  ice:      { bg: 'from-cyan-400 to-sky-400',      text: '#06b6d4', glow: 'rgba(6,182,212,0.4)',    pill: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' },
  dragon:   { bg: 'from-indigo-500 to-violet-600', text: '#6366f1', glow: 'rgba(99,102,241,0.4)',   pill: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
  dark:     { bg: 'from-gray-700 to-gray-900',     text: '#6b7280', glow: 'rgba(107,114,128,0.4)',  pill: 'bg-gray-700/50 text-gray-300 border border-gray-600/30' },
  fairy:    { bg: 'from-pink-400 to-rose-400',     text: '#f9a8d4', glow: 'rgba(249,168,212,0.4)',  pill: 'bg-pink-400/20 text-pink-200 border border-pink-400/30' },
  fighting: { bg: 'from-red-700 to-red-900',       text: '#dc2626', glow: 'rgba(220,38,38,0.4)',    pill: 'bg-red-700/20 text-red-300 border border-red-700/30' },
  poison:   { bg: 'from-purple-500 to-violet-600', text: '#a855f7', glow: 'rgba(168,85,247,0.4)',   pill: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
  ground:   { bg: 'from-amber-600 to-yellow-700',  text: '#d97706', glow: 'rgba(217,119,6,0.4)',    pill: 'bg-amber-600/20 text-amber-300 border border-amber-600/30' },
  rock:     { bg: 'from-yellow-700 to-amber-900',  text: '#a16207', glow: 'rgba(161,98,7,0.4)',     pill: 'bg-yellow-700/20 text-yellow-600 border border-yellow-700/30' },
  bug:      { bg: 'from-lime-500 to-green-600',    text: '#65a30d', glow: 'rgba(101,163,13,0.4)',   pill: 'bg-lime-600/20 text-lime-300 border border-lime-600/30' },
  ghost:    { bg: 'from-violet-700 to-purple-900', text: '#6d28d9', glow: 'rgba(109,40,217,0.4)',   pill: 'bg-violet-700/20 text-violet-300 border border-violet-700/30' },
  steel:    { bg: 'from-slate-400 to-slate-600',   text: '#64748b', glow: 'rgba(100,116,139,0.4)',  pill: 'bg-slate-500/20 text-slate-300 border border-slate-500/30' },
  flying:   { bg: 'from-sky-400 to-indigo-400',   text: '#7dd3fc', glow: 'rgba(125,211,252,0.4)',  pill: 'bg-sky-500/20 text-sky-300 border border-sky-500/30' },
  normal:   { bg: 'from-gray-400 to-gray-500',     text: '#9ca3af', glow: 'rgba(156,163,175,0.4)', pill: 'bg-gray-500/20 text-gray-300 border border-gray-500/30' },
};

export const getTypeColor = (type: string) =>
  typeColors[type] ?? typeColors['normal'];

export const statNames: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SpATK',
  'special-defense': 'SpDEF',
  speed: 'SPD',
};

export const statColors = (value: number): string => {
  if (value >= 100) return 'from-emerald-400 to-green-400';
  if (value >= 70) return 'from-blue-400 to-cyan-400';
  if (value >= 50) return 'from-yellow-400 to-amber-400';
  return 'from-red-400 to-orange-400';
};

export const parseEvolutionChain = (chain: any): { name: string; id: number; minLevel?: number }[] => {
  const result: { name: string; id: number; minLevel?: number }[] = [];

  const traverse = (node: any) => {
    const url = node.species.url;
    const id = parseInt(url.split('/').filter(Boolean).pop() ?? '0');
    const minLevel = node.evolution_details?.[0]?.min_level ?? undefined;
    result.push({ name: node.species.name, id, minLevel });
    if (node.evolves_to?.length > 0) {
      traverse(node.evolves_to[0]);
    }
  };

  traverse(chain);
  return result;
};
