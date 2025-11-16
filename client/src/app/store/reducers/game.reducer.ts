import { createReducer, on } from '@ngrx/store';
import * as GameActions from '../actions/game.actions';
import {
  GameSettings,
  CaughtPokemonEntry,
  HintState,
  PlayerGameData,
  StoredGameState,
  Difficulty,
} from '../../utils/game-type';

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
export interface GameState {
  currentScore: number;
  currentTries: number;
  maxTries: number;
  skipCount: number;
  maxSkips: number;
  currentPokemonId: number | null;
  currentPokemonName: string;
  pokemonStartTime: number | null;
  hintsUsedForCurrentPokemon: number;
  hintState: HintState;
  isGameOver: boolean;
  gameSettings: GameSettings | null;
  caughtPokemon: CaughtPokemonEntry[];
  players: Record<string, PlayerGameData>;
  lastPlayerName: string | null;
  isLoadingPokemon: boolean;
}

const createEmptyPlayerData = (): PlayerGameData => ({
  score: 0,
  currentTries: 0,
  caughtPokemon: [],
  skipCount: 0,
});

const getResetRoundState = () => ({
  currentPokemonId: null,
  currentPokemonName: '',
  hintState: {
    types: false,
    blur: false,
    reveal: false,
    cry: false,
  },
  isGameOver: false,
  pokemonStartTime: null,
  hintsUsedForCurrentPokemon: 0,
});

export const initialState: GameState = {
  currentScore: 0,
  currentTries: 0,
  maxTries: 3,
  skipCount: 0,
  maxSkips: 5,
  currentPokemonId: null,
  currentPokemonName: '',
  pokemonStartTime: null,
  hintsUsedForCurrentPokemon: 0,
  hintState: {
    types: false,
    blur: false,
    reveal: false,
    cry: false,
  },
  isGameOver: false,
  gameSettings: null,
  caughtPokemon: [],
  players: {},
  lastPlayerName: null,
  isLoadingPokemon: false,
};

export const gameReducer = createReducer(
  initialState,
  on(GameActions.setGameSettings, (state, { settings }) => ({
    ...state,
    gameSettings: settings,
  })),
  on(GameActions.loadGameStateSuccess, (state, { state: storedState }) => {
    const storedPlayerName =
      state.gameSettings?.playerName ||
      storedState.lastPlayerName ||
      Object.keys(storedState.players)[0];

    if (!storedPlayerName) {
      return { ...state, players: storedState.players };
    }

    const playerData = storedState.players[storedPlayerName] ?? createEmptyPlayerData();

    return {
      ...state,
      currentScore: playerData.score ?? 0,
      currentTries: playerData.currentTries ?? 0,
      caughtPokemon: [...(playerData.caughtPokemon || [])],
      skipCount: playerData.skipCount ?? 0,
      players: storedState.players,
      lastPlayerName: storedPlayerName,
      gameSettings: state.gameSettings || {
        difficulty: 'kanto',
        playerName: storedPlayerName,
      },
    };
  }),
  on(GameActions.addScore, (state, { points }) => ({
    ...state,
    currentScore: points > 0 ? round2(state.currentScore + points) : state.currentScore,
  })),
  on(GameActions.deductScore, (state, { amount }) => ({
    ...state,
    currentScore: Math.max(0, round2(state.currentScore - amount)),
  })),
  on(GameActions.resetScore, (state) => ({
    ...state,
    currentScore: 0,
  })),
  on(GameActions.resetGame, (state) => ({
    ...state,
    ...getResetRoundState(),
    currentTries: 0,
    currentScore: 0,
    caughtPokemon: [],
    skipCount: 0,
  })),
  on(GameActions.resetGameAndScore, (state) => {
    const playerName = state.gameSettings?.playerName;
    const updatedPlayers = { ...state.players };

    if (playerName) {
      updatedPlayers[playerName] = createEmptyPlayerData();
    }

    return {
      ...state,
      currentScore: 0,
      currentTries: 0,
      skipCount: 0,
      caughtPokemon: [],
      players: updatedPlayers,
      lastPlayerName: playerName || null,
      ...getResetRoundState(),
    };
  }),
  on(GameActions.startNewPokemon, (state, { pokemonId, pokemonName }) => ({
    ...state,
    currentPokemonId: pokemonId,
    currentPokemonName: pokemonName,
    pokemonStartTime: Date.now(),
    hintsUsedForCurrentPokemon: 0,
    hintState: {
      types: false,
      blur: false,
      reveal: false,
      cry: false,
    },
    isGameOver: false,
  })),
  on(GameActions.incrementTries, (state) => {
    const newTries = state.currentTries + 1;
    return {
      ...state,
      currentTries: newTries,
      isGameOver: newTries >= state.maxTries,
    };
  }),
  on(GameActions.incrementSkipCount, (state) => {
    const newSkipCount = state.skipCount + 1;
    return {
      ...state,
      skipCount: newSkipCount,
      isGameOver: newSkipCount >= state.maxSkips,
    };
  }),
  on(GameActions.resetSkipCount, (state) => ({
    ...state,
    skipCount: 0,
  })),
  on(GameActions.unlockHint, (state, { hintType, penalize = true }) => {
    if (state.hintState[hintType]) {
      return state;
    }

    let newHintsUsed = state.hintsUsedForCurrentPokemon;
    if (penalize && hintType !== 'reveal') {
      newHintsUsed = state.hintsUsedForCurrentPokemon + 1;
    }

    return {
      ...state,
      hintState: {
        ...state.hintState,
        [hintType]: true,
      },
      hintsUsedForCurrentPokemon: newHintsUsed,
    };
  }),
  on(GameActions.addCaughtPokemon, (state, { id, name, image }) => {
    const exists = state.caughtPokemon.some((p) => p.id === id);
    if (exists) {
      return state;
    }
    return {
      ...state,
      caughtPokemon: [...state.caughtPokemon, { id, name, image }],
    };
  }),
  on(GameActions.setGameOver, (state) => ({
    ...state,
    isGameOver: true,
  })),
  on(GameActions.resetRoundState, (state) => ({
    ...state,
    ...getResetRoundState(),
  })),
  on(GameActions.checkAndResetScoreForNewPlayer, (state, { playerName }) => {
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      return state;
    }

    const existingPlayer = state.players[trimmedName];
    const updatedPlayers = { ...state.players };

    if (existingPlayer) {
      return {
        ...state,
        currentScore: existingPlayer.score ?? 0,
        currentTries: existingPlayer.currentTries ?? 0,
        caughtPokemon: [...(existingPlayer.caughtPokemon || [])],
        skipCount: existingPlayer.skipCount ?? 0,
        lastPlayerName: trimmedName,
        gameSettings: state.gameSettings
          ? { ...state.gameSettings, playerName: trimmedName }
          : { difficulty: 'kanto', playerName: trimmedName },
      };
    }

    return {
      ...state,
      currentScore: 0,
      currentTries: 0,
      caughtPokemon: [],
      skipCount: 0,
      lastPlayerName: trimmedName,
      gameSettings: state.gameSettings
        ? { ...state.gameSettings, playerName: trimmedName }
        : { difficulty: 'kanto', playerName: trimmedName },
    };
  }),
  on(GameActions.setPokemonStartTime, (state, { time }) => ({
    ...state,
    pokemonStartTime: time,
  })),
  on(GameActions.setHintsUsedForCurrentPokemon, (state, { count }) => ({
    ...state,
    hintsUsedForCurrentPokemon: count,
  })),
  on(GameActions.setLoadingPokemon, (state, { isLoading }) => ({
    ...state,
    isLoadingPokemon: isLoading,
  }))
);
