import React, { useState } from "react";
import { Pokemon } from "../types/pokemon";
import TypeBadge from "./TypeBadge";
import { getTypeColor, padId } from "../utils/helpers";

interface Props {
  pokemon: Pokemon;
  onClick?: () => void;
  index: number;
}

const PokemonCard: React.FC<Props> = ({ pokemon, onClick }) => {
  const [shiny, setShiny] = useState(false);
  const primaryType = pokemon.types[0]?.type.name ?? "normal";
  const color = getTypeColor(primaryType);
  const sprite = shiny
    ? (pokemon.sprites.other["official-artwork"].front_shiny ??
      pokemon.sprites.front_shiny)
    : (pokemon.sprites.other["official-artwork"].front_default ??
      pokemon.sprites.front_default);

  return (
    <div
      className="relative group cursor-pointer card-shimmer"
      onClick={onClick}
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-2xl border transition-all duration-300
          bg-white/[0.04] border-white/[0.07]
          hover:border-white/20 hover:bg-white/[0.07]
          hover:-translate-y-1 hover:shadow-2xl"
        style={{
          boxShadow: `0 0 0 0 ${color.glow}`,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            `0 8px 32px ${color.glow}`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            `0 0 0 0 ${color.glow}`;
        }}
      >
        {/* Top gradient */}
        <div
          className={`absolute inset-x-0 top-0 h-24 opacity-20 bg-gradient-to-b ${color.bg}`}
        />

        {/* ID */}
        <div className="absolute top-3 left-3">
          <span className="font-mono text-[10px] text-white/25 tracking-widest">
            #{padId(pokemon.id)}
          </span>
        </div>

        {/* Shiny toggle */}
        <button
          className="absolute top-2.5 right-2.5 z-10 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity
            px-1.5 py-0.5 rounded-md bg-white/10 text-white/50 hover:text-white/90 hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            setShiny((s) => !s);
          }}
        >
          {shiny ? "✦" : "✧"}
        </button>

        {/* Sprite */}
        <div className="relative pt-6 pb-1 flex justify-center">
          <div className="relative">
            {/* Glow orb behind sprite */}
            <div
              className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-r ${color.bg}`}
              style={{ transform: "scale(0.7) translateY(20%)" }}
            />
            <img
              src={sprite}
              alt={pokemon.name}
              className="relative w-24 h-24 object-contain drop-shadow-lg"
              loading="lazy"
            />
          </div>
        </div>

        {/* Info */}
        <div className="px-3 pb-4">
          <h3 className="font-display text-xl tracking-wider text-white/90 text-center mb-2">
            {pokemon.name.toUpperCase()}
          </h3>
          <div className="flex gap-1.5 justify-center flex-wrap">
            {pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
