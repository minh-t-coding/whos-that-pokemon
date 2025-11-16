import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ModalComponent } from '../shared/modal/modal.component';
import { ModalService } from '../../services/modal.service';
import { LeaderboardEntry } from '../../utils/game-type';
import { AppState } from '../../store/reducers';
import * as LeaderboardActions from '../../store/actions/leaderboard.actions';
import { selectTopScores } from '../../store/selectors';

@Component({
  selector: 'app-leaderboard-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css',
})
export class LeaderboardComponent implements OnInit {
  private readonly MODAL_ID = 'leaderboard' as const;
  entries: LeaderboardEntry[] = [];
  isOpen: ReturnType<ModalService['getModalState']>;

  constructor(
    private store: Store<AppState>,
    private modalService: ModalService
  ) {
    this.isOpen = this.modalService.getModalState(this.MODAL_ID);
    effect(() => {
      if (this.isOpen()) {
        this.loadEntries();
      }
    });
  }

  ngOnInit(): void {
    this.store.dispatch(LeaderboardActions.loadLeaderboard());
    this.loadEntries();
  }

  private loadEntries(): void {
    this.store.dispatch(LeaderboardActions.loadLeaderboard());
    this.entries = this.store.selectSignal(selectTopScores(10))();
  }

  onClose(): void {
    this.modalService.close(this.MODAL_ID);
  }
}
