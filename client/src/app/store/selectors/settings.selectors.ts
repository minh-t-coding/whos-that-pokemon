import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SettingsState } from '../reducers/settings.reducer';

export const selectSettingsState = createFeatureSelector<SettingsState>('settings');

export const selectVolume = createSelector(selectSettingsState, (state) => state.volume);

export const selectMusic = createSelector(selectSettingsState, (state) => state.music);

