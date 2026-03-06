export interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
}

export interface Ability {
  ability: { name: string; url: string };
  is_hidden: boolean;
  slot: number;
}

export interface Move {
  move: { name: string; url: string };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
        front_shiny: string;
      };
      dream_world: {
        front_default: string;
      };
    };
  };
  types: PokemonType[];
  stats: Stat[];
  abilities: Ability[];
  moves: Move[];
}

export interface EvolutionChainLink {
  species_name: string;
  id: number;
  min_level?: number;
  evolves_to: EvolutionChainLink[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
    version: { name: string };
  }[];
  evolution_chain: { url: string };
  genera: {
    genus: string;
    language: { name: string };
  }[];
  capture_rate: number;
  base_happiness: number;
  is_legendary: boolean;
  is_mythical: boolean;
}
