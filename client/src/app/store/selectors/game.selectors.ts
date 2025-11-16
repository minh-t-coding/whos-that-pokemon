import { createSelector, createFeatureSelector } from '@ngrx/store';
import { GameState } from '../reducers/game.reducer';
import { Difficulty } from '../../utils/game-type';

export const selectGameState = createFeatureSelector<GameState>('game');

export const selectCurrentScore = createSelector(
  selectGameState,
  (state) => state.currentScore
);

export const selectCurrentTries = createSelector(
  selectGameState,
  (state) => state.currentTries
);

export const selectMaxTries = createSelector(
  selectGameState,
  (state) => state.maxTries
);

export const selectSkipCount = createSelector(
  selectGameState,
  (state) => state.skipCount
);

export const selectMaxSkips = createSelector(
  selectGameState,
  (state) => state.maxSkips
);

export const selectIsGameOver = createSelector(
  selectGameState,
  (state) => state.isGameOver
);

export const selectGameSettings = createSelector(
  selectGameState,
  (state) => state.gameSettings
);

export const selectCaughtPokemon = createSelector(
  selectGameState,
  (state) => state.caughtPokemon
);

export const selectHintState = createSelector(
  selectGameState,
  (state) => state.hintState
);

export const selectCurrentPokemonId = createSelector(
  selectGameState,
  (state) => state.currentPokemonId
);

export const selectCurrentPokemonName = createSelector(
  selectGameState,
  (state) => state.currentPokemonName
);

export const selectPokemonStartTime = createSelector(
  selectGameState,
  (state) => state.pokemonStartTime
);

export const selectHintsUsedForCurrentPokemon = createSelector(
  selectGameState,
  (state) => state.hintsUsedForCurrentPokemon
);

export const selectDifficulty = createSelector(selectGameSettings, (settings) => settings?.difficulty);

export const selectPlayerName = createSelector(selectGameSettings, (settings) => settings?.playerName);

export const selectDifficultyRange = createSelector(selectDifficulty, (difficulty) => {
  const difficultyRanges: Record<Difficulty, { min: number; max: number }> = {
    kanto: { min: 1, max: 151 },
    johto: { min: 152, max: 251 },
    world: { min: 1, max: 1025 },
  };
  return difficulty ? difficultyRanges[difficulty] : difficultyRanges.kanto;
});

export const selectIsLoadingPokemon = createSelector(
  selectGameState,
  (state) => state.isLoadingPokemon
);

export const selectStoredPlayerName = createSelector(selectGameState, (state) => {
  if (state.lastPlayerName) {
    return state.lastPlayerName;
  }
  const storedNames = Object.keys(state.players);
  return storedNames.length ? storedNames[0] : '';
});

