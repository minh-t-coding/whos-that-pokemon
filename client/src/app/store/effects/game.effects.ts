import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom, filter } from 'rxjs/operators';
import * as GameActions from '../actions/game.actions';
import * as LeaderboardActions from '../actions/leaderboard.actions';
import { selectGameState } from '../selectors/game.selectors';
import { AppState } from '../reducers';
import { StoredGameState, PlayerGameData, CaughtPokemonEntry } from '../../utils/game-type';

const STORAGE_KEY = 'pokemon_game_state';

@Injectable()
export class GameEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);

  loadGameState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadGameState),
      map(() => {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (!saved) {
            return GameActions.loadGameStateSuccess({ state: { players: {} } });
          }
          const parsed = JSON.parse(saved);
          return GameActions.loadGameStateSuccess({ state: parsed });
        } catch (e) {
          return GameActions.loadGameStateFailure({
            error: e instanceof Error ? e.message : String(e),
          });
        }
      })
    )
  );

  persistGameState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          GameActions.addScore,
          GameActions.deductScore,
          GameActions.resetScore,
          GameActions.addCaughtPokemon,
          GameActions.incrementTries,
          GameActions.incrementSkipCount,
          GameActions.setGameSettings,
          GameActions.checkAndResetScoreForNewPlayer,
          GameActions.resetGameAndScore,
          GameActions.resetGame
        ),
        withLatestFrom(this.store.select(selectGameState)),
        tap(([action, gameState]) => {
          const playerName = gameState.gameSettings?.playerName;
          if (playerName) {
            const playerData: PlayerGameData = {
              score: gameState.currentScore,
              currentTries: gameState.currentTries,
              caughtPokemon: gameState.caughtPokemon,
              skipCount: gameState.skipCount,
            };

            const storedState: StoredGameState = {
              players: {
                ...gameState.players,
                [playerName]: playerData,
              },
              lastPlayerName: playerName,
            };

            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(storedState));
            } catch (e) {
              console.error('Failed to save game state to localStorage:', e);
            }
          }
        })
      ),
    { dispatch: false }
  );

  syncLeaderboardOnScoreChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        GameActions.addScore,
        GameActions.deductScore,
        GameActions.resetScore,
        GameActions.resetGameAndScore,
        GameActions.setGameOver
      ),
      withLatestFrom(this.store.select(selectGameState)),
      map(([action, gameState]) => {
        const playerName = gameState.gameSettings?.playerName;
        const currentScore = gameState.currentScore;

        if (playerName) {
          return LeaderboardActions.syncLeaderboardWithScore({
            playerName,
            currentScore,
          });
        }
        return { type: 'NO_OP' };
      }),
      filter((action) => action.type !== 'NO_OP')
    )
  );
}

