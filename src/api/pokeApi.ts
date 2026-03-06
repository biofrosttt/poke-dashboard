import axios from 'axios';
import { Pokemon, PokemonListItem, PokemonSpecies } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({ baseURL: BASE_URL });

export const fetchPokemonList = async (limit = 40, offset = 0): Promise<PokemonListItem[]> => {
  const res = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
  return res.data.results;
};

export const fetchPokemon = async (nameOrId: string | number): Promise<Pokemon> => {
  const res = await api.get(`/pokemon/${nameOrId}`);
  return res.data;
};

export const fetchPokemonSpecies = async (id: number): Promise<PokemonSpecies> => {
  const res = await api.get(`/pokemon-species/${id}`);
  return res.data;
};

export const fetchEvolutionChain = async (url: string) => {
  const res = await axios.get(url);
  return res.data;
};

export const searchPokemon = async (query: string): Promise<Pokemon | null> => {
  try {
    const res = await api.get(`/pokemon/${query.toLowerCase().trim()}`);
    return res.data;
  } catch {
    return null;
  }
};
