import { ActionReducerMap } from '@ngrx/store';
import { gameReducer, GameState } from './game.reducer';
import { leaderboardReducer, LeaderboardState } from './leaderboard.reducer';
import { settingsReducer, SettingsState } from './settings.reducer';
import { uiReducer, UIState } from './ui.reducer';

export interface AppState {
  game: GameState;
  leaderboard: LeaderboardState;
  settings: SettingsState;
  ui: UIState;
}

export const reducers: ActionReducerMap<AppState> = {
  game: gameReducer,
  leaderboard: leaderboardReducer,
  settings: settingsReducer,
  ui: uiReducer,
};

