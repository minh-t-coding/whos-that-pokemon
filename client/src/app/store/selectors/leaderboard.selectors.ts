import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LeaderboardState } from '../reducers/leaderboard.reducer';

export const selectLeaderboardState = createFeatureSelector<LeaderboardState>('leaderboard');

export const selectLeaderboardEntries = createSelector(
  selectLeaderboardState,
  (state) => state.entries.filter((entry) => entry.score > 0)
);

export const selectTopScores = (count: number) =>
  createSelector(selectLeaderboardEntries, (entries) => entries.slice(0, count));

export const selectLeaderboardLoading = createSelector(
  selectLeaderboardState,
  (state) => state.isLoading
);

export const selectLeaderboardError = createSelector(
  selectLeaderboardState,
  (state) => state.error
);

