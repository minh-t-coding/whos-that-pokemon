import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import * as LeaderboardActions from '../actions/leaderboard.actions';
import { selectLeaderboardEntries } from '../selectors/leaderboard.selectors';
import { AppState } from '../reducers';

const LEADERBOARD_KEY = 'pokemon_game_leaderboard';

@Injectable()
export class LeaderboardEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);

  loadLeaderboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeaderboardActions.loadLeaderboard),
      map(() => {
        try {
          const saved = localStorage.getItem(LEADERBOARD_KEY);
          if (!saved) {
            return LeaderboardActions.loadLeaderboardSuccess({ entries: [] });
          }
          const parsed = JSON.parse(saved);
          return LeaderboardActions.loadLeaderboardSuccess({ entries: parsed });
        } catch (e) {
          return LeaderboardActions.loadLeaderboardFailure({
            error: e instanceof Error ? e.message : String(e),
          });
        }
      })
    )
  );

  persistLeaderboard$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          LeaderboardActions.syncLeaderboardWithScore,
          LeaderboardActions.addLeaderboardEntry,
          LeaderboardActions.updateLeaderboardEntry,
          LeaderboardActions.removeLeaderboardEntry,
          LeaderboardActions.clearLeaderboard
        ),
        withLatestFrom(this.store.select(selectLeaderboardEntries)),
        tap(([action, entries]) => {
          try {
            localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
          } catch (e) {
            console.error('Failed to save leaderboard to localStorage:', e);
          }
        })
      ),
    { dispatch: false }
  );
}

