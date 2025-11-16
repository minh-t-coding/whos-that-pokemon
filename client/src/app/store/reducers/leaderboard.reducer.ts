import { createReducer, on } from '@ngrx/store';
import * as LeaderboardActions from '../actions/leaderboard.actions';
import { LeaderboardEntry } from '../../utils/game-type';

export interface LeaderboardState {
  entries: LeaderboardEntry[];
  maxEntries: number;
  isLoading: boolean;
  error: string | null;
}

export const initialState: LeaderboardState = {
  entries: [],
  maxEntries: 10,
  isLoading: false,
  error: null,
};

export const leaderboardReducer = createReducer(
  initialState,
  on(LeaderboardActions.loadLeaderboardSuccess, (state, { entries }) => ({
    ...state,
    entries: entries.filter((entry) => entry.score > 0),
    isLoading: false,
    error: null,
  })),
  on(LeaderboardActions.loadLeaderboardFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(LeaderboardActions.syncLeaderboardWithScore, (state, { playerName, currentScore }) => {
    const filteredEntries = state.entries.filter(
      (entry) => entry.name.toLowerCase() !== playerName.toLowerCase()
    );

    if (currentScore > 0) {
      const updatedEntries = [
        ...filteredEntries,
        {
          name: playerName,
          score: currentScore,
          date: new Date().toISOString(),
        },
      ]
        .sort((a, b) => b.score - a.score)
        .slice(0, state.maxEntries);

      return {
        ...state,
        entries: updatedEntries,
      };
    }

    return {
      ...state,
      entries: filteredEntries,
    };
  }),
  on(LeaderboardActions.addLeaderboardEntry, (state, { name, score }) => {
    if (score <= 0) {
      return state;
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      return state;
    }

    const filteredEntries = state.entries.filter(
      (entry) => entry.name.toLowerCase() !== trimmedName.toLowerCase()
    );

    const updatedEntries = [
      ...filteredEntries,
      {
        name: trimmedName,
        score,
        date: new Date().toISOString(),
      },
    ]
      .sort((a, b) => b.score - a.score)
      .slice(0, state.maxEntries);

    return {
      ...state,
      entries: updatedEntries,
    };
  }),
  on(LeaderboardActions.removeLeaderboardEntry, (state, { name }) => {
    const filteredEntries = state.entries.filter(
      (entry) => entry.name.toLowerCase() !== name.toLowerCase()
    );

    return {
      ...state,
      entries: filteredEntries,
    };
  }),
  on(LeaderboardActions.clearLeaderboard, (state) => ({
    ...state,
    entries: [],
  }))
);

