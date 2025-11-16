import { createReducer, on } from '@ngrx/store';
import * as SettingsActions from '../actions/settings.actions';

export interface SettingsState {
  volume: number;
  music: number;
}

export const initialState: SettingsState = {
  volume: 50,
  music: 50,
};

export const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.loadSettingsSuccess, (state, { settings }) => ({
    ...state,
    ...settings,
  })),
  on(SettingsActions.updateVolume, (state, { volume }) => ({
    ...state,
    volume,
  })),
  on(SettingsActions.updateMusic, (state, { music }) => ({
    ...state,
    music,
  }))
);

