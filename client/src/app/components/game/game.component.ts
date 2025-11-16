import { Component, OnInit, OnDestroy, signal, computed, effect, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PokemonService } from '../../services/pokemon.service';
import { MusicService } from '../../services/music.service';
import { ModalService } from '../../services/modal.service';
import { CatchAnimationComponent } from '../catch-animation/catch-animation.component';
import { CaughtPokemonModalComponent } from '../caught-pokemon-modal/caught-pokemon-modal.component';
import { GameOverModalComponent } from '../game-over-modal/game-over-modal.component';
import { PokeballButtonComponent } from '../shared/pokeball-button/pokeball-button.component';
import { HeaderComponent } from '../header/header.component';
import { Pokemon, HintState, GameSettings, CaughtPokemonEntry } from '../../utils/game-type';
import { AppState } from '../../store/reducers';
import * as GameActions from '../../store/actions/game.actions';
import * as LeaderboardActions from '../../store/actions/leaderboard.actions';
import * as UIActions from '../../store/actions/ui.actions';
import {
  selectCurrentScore,
  selectCurrentTries,
  selectMaxTries,
  selectSkipCount,
  selectMaxSkips,
  selectHintState,
  selectIsGameOver,
  selectGameSettings,
  selectCaughtPokemon,
  selectCurrentPokemonId,
  selectPokemonStartTime,
  selectHintsUsedForCurrentPokemon,
  selectDifficultyRange,
  selectVolume,
} from '../../store/selectors';
import { calculateScore, calculateHintPenalty, calculateTryPenalty } from '../../store/utils/score.utils';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CatchAnimationComponent,
    CaughtPokemonModalComponent,
    GameOverModalComponent,
    PokeballButtonComponent,
    HeaderComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit, OnDestroy {
  currentPokemon = signal<Pokemon | null>(null);
  guess = signal('');
  isLoading = signal(false);
  isRevealed = signal(false);
  showCatchAnimation = signal(false);
  isCorrectGuess = signal(false);
  caughtPokemon = signal<{ name: string; image: string } | null>(null);
  showCaughtPokemonModal = signal(false);
  showGameOverModal = signal(false);
  feedbackMessage = signal('');
  feedbackType = signal<'correct' | 'wrong'>('wrong');
  audioContext: AudioContext | null = null;
  private feedbackTimeout: any;

  score!: Signal<number>;
  tries!: Signal<number>;
  maxTries!: Signal<number>;
  skipCount!: Signal<number>;
  maxSkips!: Signal<number>;
  hintState!: Signal<HintState>;
  isGameOver!: Signal<boolean>;
  gameSettings!: Signal<GameSettings | null>;
  caughtPokemonList!: Signal<CaughtPokemonEntry[]>;
  volume!: Signal<number>;

  private wasGameOver = false;
  private readonly LEADERBOARD_MODAL_ID = 'leaderboard' as const;
  private readonly SETTINGS_MODAL_ID = 'settings' as const;

  constructor(
    private router: Router,
    private pokemonService: PokemonService,
    private store: Store<AppState>,
    private musicService: MusicService,
    private modalService: ModalService
  ) {
    this.score = this.store.selectSignal(selectCurrentScore);
    this.tries = this.store.selectSignal(selectCurrentTries);
    this.maxTries = this.store.selectSignal(selectMaxTries);
    this.skipCount = this.store.selectSignal(selectSkipCount);
    this.maxSkips = this.store.selectSignal(selectMaxSkips);
    this.hintState = this.store.selectSignal(selectHintState);
    this.isGameOver = this.store.selectSignal(selectIsGameOver);
    this.gameSettings = this.store.selectSignal(selectGameSettings);
    this.caughtPokemonList = this.store.selectSignal(selectCaughtPokemon);
    this.volume = this.store.selectSignal(selectVolume);
    effect(() => {
      const gameOver = this.isGameOver();
      if (gameOver && !this.wasGameOver) {
        this.showGameOverModal.set(true);
      }
      this.wasGameOver = gameOver;
    });
  }

  ngOnInit(): void {
    this.store.dispatch(GameActions.loadGameState());
    this.store.dispatch(LeaderboardActions.loadLeaderboard());

    const settings = this.gameSettings();
    if (!settings) {
      this.router.navigate(['/difficulty']);
      return;
    }

    const currentPokemonId = this.store.selectSignal(selectCurrentPokemonId)();
    if (!currentPokemonId) {
      this.loadNewPokemon();
    }
  }

  ngOnDestroy(): void {
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.musicService.resume();
    this.clearFeedback();
  }

  loadNewPokemon(): void {
    const settings = this.gameSettings();
    if (!settings) {
      return;
    }

    this.isLoading.set(true);
    this.isRevealed.set(false);
    this.isCorrectGuess.set(false);
    this.showCatchAnimation.set(false);
    this.caughtPokemon.set(null);
    this.clearFeedback();

    const range = this.store.selectSignal(selectDifficultyRange)();

    this.pokemonService.getRandomPokemon(range.min, range.max).subscribe({
      next: (pokemon) => {
        this.currentPokemon.set(pokemon);
        this.store.dispatch(
          GameActions.startNewPokemon({ pokemonId: pokemon.id, pokemonName: pokemon.name })
        );
        this.guess.set('');
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading Pokemon:', error);
        this.isLoading.set(false);
      },
    });
  }

  onSubmitGuess(): void {
    if (this.isRevealed() || this.isGameOver() || this.showCatchAnimation()) {
      return;
    }

    this.clearFeedback();

    const currentGuess = this.guess().trim().toLowerCase();
    const pokemonName = this.currentPokemon()?.name.toLowerCase();

    if (!currentGuess || !pokemonName) {
      return;
    }

    if (currentGuess === pokemonName) {
      const pokemon = this.currentPokemon();
      if (pokemon) {
        const startTime = this.store.selectSignal(selectPokemonStartTime)();
        const hintsUsed = this.store.selectSignal(selectHintsUsedForCurrentPokemon)();
        const settings = this.gameSettings();

        if (startTime && settings) {
          const timeTaken = (Date.now() - startTime) / 1000;
          const points = calculateScore(timeTaken, hintsUsed, settings.difficulty);
          this.store.dispatch(GameActions.addScore({ points }));
        }

        this.store.dispatch(GameActions.unlockHint({ hintType: 'reveal', penalize: false }));
        this.isRevealed.set(true);
        this.isCorrectGuess.set(true);
        this.guess.set('');

        this.store.dispatch(
          GameActions.addCaughtPokemon({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.front_default,
          })
        );

        this.caughtPokemon.set({
          name: pokemon.name,
          image: pokemon.sprites.front_default,
        });

        setTimeout(() => {
          this.showCatchAnimation.set(true);
        }, 1500);
      }
    } else {
      const settings = this.gameSettings();
      if (settings) {
        const tryNumber = this.tries() + 1;
        const penalty = calculateTryPenalty(tryNumber, settings.difficulty);
        this.store.dispatch(GameActions.deductScore({ amount: penalty }));
      }
      this.store.dispatch(GameActions.incrementTries());
      this.guess.set('');
      this.showFeedback('Wrong guess! Try again.', 'wrong');
    }
  }

  onCatchAnimationComplete(): void {
    this.showCatchAnimation.set(false);
    this.caughtPokemon.set(null);
    this.isRevealed.set(false);
    this.isCorrectGuess.set(false);
    this.loadNewPokemon();
  }

  private showFeedback(message: string, type: 'correct' | 'wrong'): void {
    this.clearFeedback();
    this.feedbackMessage.set(message);
    this.feedbackType.set(type);
    this.feedbackTimeout = setTimeout(() => {
      this.feedbackMessage.set('');
      this.feedbackTimeout = null;
    }, 3000);
  }

  private clearFeedback(): void {
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
      this.feedbackTimeout = null;
    }
    this.feedbackMessage.set('');
  }

  onSkip(): void {
    if (this.isRevealed() || this.isGameOver() || this.showCatchAnimation()) {
      return;
    }

    this.store.dispatch(GameActions.incrementSkipCount());
    const skipCount = this.skipCount();
    if (skipCount >= this.maxSkips()) {
      this.showFeedback('Skip limit reached! Game over.', 'wrong');
      this.store.dispatch(GameActions.setGameOver());
      return;
    }

    this.loadNewPokemon();
  }

  onHintButtonClick(): void {
    if (this.isRevealed() || this.isGameOver()) {
      return;
    }

    const hints = this.hintState();

    if (!hints.cry) {
      this.store.dispatch(GameActions.unlockHint({ hintType: 'cry' }));
      this.applyHintPenalty('cry');
      this.playCry();
    } else if (!hints.types) {
      this.store.dispatch(GameActions.unlockHint({ hintType: 'types' }));
      this.applyHintPenalty('types');
    } else if (!hints.blur) {
      this.store.dispatch(GameActions.unlockHint({ hintType: 'blur' }));
      this.applyHintPenalty('blur');
    } else if (!hints.reveal) {
      this.store.dispatch(GameActions.unlockHint({ hintType: 'reveal' }));
      this.store.dispatch(GameActions.incrementTries());
      this.isRevealed.set(true);
    }
  }

  onHintClick(hintType: 'types' | 'blur' | 'reveal'): void {
    if (this.isRevealed() || this.isGameOver()) {
      return;
    }

    if (!this.hintState()[hintType]) {
      this.store.dispatch(GameActions.unlockHint({ hintType }));
      this.applyHintPenalty(hintType);
      if (hintType === 'reveal') {
        this.store.dispatch(GameActions.incrementTries());
        this.isRevealed.set(true);
      }
    }
  }

  private applyHintPenalty(hintType: 'cry' | 'types' | 'blur' | 'reveal'): void {
    const settings = this.gameSettings();
    if (settings && hintType !== 'reveal') {
      const penalty = calculateHintPenalty(hintType, settings.difficulty);
      this.store.dispatch(GameActions.deductScore({ amount: penalty }));
    }
  }

  onNextPokemon(): void {
    if (this.isGameOver()) {
      this.showGameOverModal.set(true);
      return;
    }

    this.isRevealed.set(false);
    this.isCorrectGuess.set(false);
    this.loadNewPokemon();
  }

  playCry(): void {
    const pokemon = this.currentPokemon();
    if (!pokemon?.cries?.latest) {
      return;
    }

    this.musicService.pause();

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const volume = this.volume();
    fetch(pokemon.cries.latest)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => this.audioContext!.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        const source = this.audioContext!.createBufferSource();
        const gainNode = this.audioContext!.createGain();
        const sfxVolume = volume / 100;
        source.buffer = audioBuffer;
        gainNode.gain.value = sfxVolume;
        source.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);
        source.onended = () => {
          this.musicService.resume();
        };
        source.start(0);
      })
      .catch((error) => {
        console.error('Error playing cry:', error);
        this.musicService.resume();
      });
  }

  getPokemonTypes(): string {
    const pokemon = this.currentPokemon();
    if (!pokemon) {
      return '';
    }
    return pokemon.types
      .map((typeInfo: { type: { name: string } }) => typeInfo.type.name)
      .join(', ');
  }

  onSettingsClick(): void {
    this.modalService.open(this.SETTINGS_MODAL_ID);
  }

  onLeaderboardClick(): void {
    this.modalService.open(this.LEADERBOARD_MODAL_ID);
  }

  onCaughtPokemonClick(): void {
    this.showCaughtPokemonModal.set(true);
  }

  onCloseCaughtPokemonModal(): void {
    this.showCaughtPokemonModal.set(false);
  }

  onLeaderboardFromGameOver(): void {
    this.modalService.open(this.LEADERBOARD_MODAL_ID);
  }

  onRetry(): void {
    this.showGameOverModal.set(false);
    this.store.dispatch(GameActions.resetGameAndScore());
    this.loadNewPokemon();
  }

  onQuit(): void {
    this.showGameOverModal.set(false);
    this.store.dispatch(GameActions.resetGame());
    this.musicService.resume();
    this.router.navigate(['/']);
  }

  onQuitFromGame(): void {
    this.store.dispatch(GameActions.resetGameAndScore());
    this.musicService.resume();
    this.router.navigate(['/']);
  }
}
