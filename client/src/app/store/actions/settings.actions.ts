import { createAction, props } from '@ngrx/store';

export const loadSettings = createAction('[Settings] Load Settings');
export const loadSettingsSuccess = createAction(
  '[Settings] Load Settings Success',
  props<{ settings: { volume: number; music: number } }>()
);
export const updateVolume = createAction(
  '[Settings] Update Volume',
  props<{ volume: number }>()
);
export const updateMusic = createAction(
  '[Settings] Update Music',
  props<{ music: number }>()
);

