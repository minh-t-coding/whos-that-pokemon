import { createAction, props } from '@ngrx/store';
import { LeaderboardEntry } from '../../utils/game-type';

export const loadLeaderboard = createAction('[Leaderboard] Load Leaderboard');
export const loadLeaderboardSuccess = createAction(
  '[Leaderboard] Load Leaderboard Success',
  props<{ entries: LeaderboardEntry[] }>()
);
export const loadLeaderboardFailure = createAction(
  '[Leaderboard] Load Leaderboard Failure',
  props<{ error: string }>()
);

export const addLeaderboardEntry = createAction(
  '[Leaderboard] Add Entry',
  props<{ name: string; score: number }>()
);

export const updateLeaderboardEntry = createAction(
  '[Leaderboard] Update Entry',
  props<{ name: string; score: number }>()
);

export const removeLeaderboardEntry = createAction(
  '[Leaderboard] Remove Entry',
  props<{ name: string }>()
);

export const clearLeaderboard = createAction('[Leaderboard] Clear Leaderboard');

export const syncLeaderboardWithScore = createAction(
  '[Leaderboard] Sync With Score',
  props<{ playerName: string; currentScore: number }>()
);

