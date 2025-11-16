import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Difficulty } from '../../utils/game-type';
import { MusicService } from '../../services/music.service';
import { ModalService } from '../../services/modal.service';
import { AppState } from '../../store/reducers';
import * as GameActions from '../../store/actions/game.actions';
import { selectStoredPlayerName } from '../../store/selectors';

@Component({
  selector: 'app-difficulty',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './difficulty.component.html',
  styleUrl: './difficulty.component.css',
})
export class DifficultyComponent implements OnInit {
  selectedDifficulty = signal<Difficulty | null>(null);
  playerName = signal('');

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private musicService: MusicService,
    private modalService: ModalService
  ) {
    this.musicService.resume();
  }

  ngOnInit(): void {
    this.store.dispatch(GameActions.loadGameState());
    const storedName = this.store.selectSignal(selectStoredPlayerName)();
    if (storedName) {
      this.playerName.set(storedName);
      this.store.dispatch(
        GameActions.checkAndResetScoreForNewPlayer({ playerName: storedName })
      );
    }
  }

  selectDifficulty(difficulty: Difficulty): void {
    this.selectedDifficulty.set(difficulty);
  }

  onStart(): void {
    if (this.selectedDifficulty() && this.playerName().trim()) {
      const trimmedName = this.playerName().trim();
      this.store.dispatch(
        GameActions.checkAndResetScoreForNewPlayer({ playerName: trimmedName })
      );
      this.store.dispatch(GameActions.resetRoundState());
      this.store.dispatch(
        GameActions.setGameSettings({
          settings: {
            playerName: trimmedName,
            difficulty: this.selectedDifficulty()!,
          },
        })
      );
      this.router.navigate(['/game']);
      this.musicService.play();
    }
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  onLeaderboardClick(): void {
    this.modalService.open('leaderboard');
  }
}
