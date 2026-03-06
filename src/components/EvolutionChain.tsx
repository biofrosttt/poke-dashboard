import React from 'react';
import { capitalize } from '../utils/helpers';

interface EvoNode {
  name: string;
  id: number;
  minLevel?: number;
}

interface Props {
  chain: EvoNode[];
  currentId: number;
  onSelect: (id: number) => void;
}

const EvolutionChain: React.FC<Props> = ({ chain, currentId, onSelect }) => {
  if (chain.length <= 1) return null;

  return (
    <div className="mt-6">
      <h4 className="font-mono text-xs tracking-widest text-white/30 uppercase mb-4">Evolution Chain</h4>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {chain.map((node, i) => (
          <React.Fragment key={node.id}>
            {/* Evo arrow */}
            {i > 0 && (
              <div className="flex flex-col items-center shrink-0 px-1">
                <span className="text-white/20 text-lg">→</span>
                {chain[i].minLevel && (
                  <span className="text-[9px] font-mono text-white/25">Lv.{chain[i].minLevel}</span>
                )}
              </div>
            )}
            {/* Pokemon */}
            <button
              onClick={() => onSelect(node.id)}
              className={`flex flex-col items-center shrink-0 p-2 rounded-xl transition-all
                ${node.id === currentId
                  ? 'bg-white/10 ring-1 ring-white/20'
                  : 'hover:bg-white/5 opacity-60 hover:opacity-100'
                }`}
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${node.id}.png`}
                alt={node.name}
                className="w-14 h-14 object-contain"
              />
              <span className="text-[10px] font-mono text-white/60 mt-1">{capitalize(node.name)}</span>
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default EvolutionChain;
