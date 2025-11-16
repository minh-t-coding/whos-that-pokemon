import { createAction, props } from '@ngrx/store';
import {
  GameSettings,
  CaughtPokemonEntry,
  HintState,
  StoredGameState,
} from '../../utils/game-type';

export const setGameSettings = createAction(
  '[Game] Set Game Settings',
  props<{ settings: GameSettings }>()
);

export const loadGameState = createAction('[Game] Load Game State');
export const loadGameStateSuccess = createAction(
  '[Game] Load Game State Success',
  props<{ state: StoredGameState }>()
);
export const loadGameStateFailure = createAction(
  '[Game] Load Game State Failure',
  props<{ error: string }>()
);

export const addScore = createAction(
  '[Game] Add Score',
  props<{ points: number }>()
);

export const deductScore = createAction(
  '[Game] Deduct Score',
  props<{ amount: number }>()
);

export const resetScore = createAction('[Game] Reset Score');
export const resetGame = createAction('[Game] Reset Game');
export const resetGameAndScore = createAction('[Game] Reset Game And Score');

export const startNewPokemon = createAction(
  '[Game] Start New Pokemon',
  props<{ pokemonId: number; pokemonName: string }>()
);

export const incrementTries = createAction('[Game] Increment Tries');
export const incrementSkipCount = createAction('[Game] Increment Skip Count');
export const resetSkipCount = createAction('[Game] Reset Skip Count');

export const unlockHint = createAction(
  '[Game] Unlock Hint',
  props<{ hintType: keyof HintState; penalize?: boolean }>()
);

export const addCaughtPokemon = createAction(
  '[Game] Add Caught Pokemon',
  props<{ id: number; name: string; image: string }>()
);

export const setGameOver = createAction('[Game] Set Game Over');
export const resetRoundState = createAction('[Game] Reset Round State');

export const checkAndResetScoreForNewPlayer = createAction(
  '[Game] Check And Reset Score For New Player',
  props<{ playerName: string }>()
);

export const savePlayerState = createAction('[Game] Save Player State');

export const setPokemonStartTime = createAction(
  '[Game] Set Pokemon Start Time',
  props<{ time: number }>()
);

export const setHintsUsedForCurrentPokemon = createAction(
  '[Game] Set Hints Used For Current Pokemon',
  props<{ count: number }>()
);

export const setLoadingPokemon = createAction(
  '[Game] Set Loading Pokemon',
  props<{ isLoading: boolean }>()
);

