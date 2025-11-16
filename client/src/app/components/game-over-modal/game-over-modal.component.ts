import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  selector: 'app-game-over-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './game-over-modal.component.html',
  styleUrl: './game-over-modal.component.css',
})
export class GameOverModalComponent {
  score = input.required<number>();
  retry = output<void>();
  leaderboard = output<void>();
  quit = output<void>();

  onRetry(): void {
    this.retry.emit();
  }

  onLeaderboard(): void {
    this.leaderboard.emit();
  }

  onQuit(): void {
    this.quit.emit();
  }
}
