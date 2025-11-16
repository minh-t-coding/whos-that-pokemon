import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import * as SettingsActions from '../actions/settings.actions';
import { selectSettingsState } from '../selectors/settings.selectors';
import { AppState } from '../reducers';

const SETTINGS_KEY = 'pokemon_game_settings';

@Injectable()
export class SettingsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);

  loadSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.loadSettings),
      map(() => {
        try {
          const saved = localStorage.getItem(SETTINGS_KEY);
          if (!saved) {
            return SettingsActions.loadSettingsSuccess({
              settings: { volume: 50, music: 50 },
            });
          }
          const parsed = JSON.parse(saved);
          return SettingsActions.loadSettingsSuccess({ settings: parsed });
        } catch (e) {
          return SettingsActions.loadSettingsSuccess({
            settings: { volume: 50, music: 50 },
          });
        }
      })
    )
  );

  persistSettings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SettingsActions.updateVolume, SettingsActions.updateMusic),
        withLatestFrom(this.store.select(selectSettingsState)),
        tap(([action, settings]) => {
          try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
          } catch (e) {
            console.error('Failed to save settings to localStorage:', e);
          }
        })
      ),
    { dispatch: false }
  );
}

