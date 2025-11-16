export interface AppSettings {
  volume: number;
  music: number;
}

export type ModalId = 'leaderboard' | 'settings' | string;

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  weight: number;
  height: number;
  cries: {
    latest: string;
  };
}

export interface PokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

export type Difficulty = 'kanto' | 'johto' | 'world';

export interface GameSettings {
  difficulty: Difficulty;
  playerName: string;
}

export interface HintState {
  types: boolean;
  blur: boolean;
  reveal: boolean;
  cry: boolean;
}

export interface CaughtPokemonEntry {
  id: number;
  name: string;
  image: string;
}

export interface PlayerGameData {
  score: number;
  currentTries: number;
  caughtPokemon: CaughtPokemonEntry[];
  skipCount: number;
}

export interface StoredGameState {
  players: Record<string, PlayerGameData>;
  lastPlayerName?: string;
}
