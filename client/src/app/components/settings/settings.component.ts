import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ModalComponent } from '../shared/modal/modal.component';
import { ModalService } from '../../services/modal.service';
import { AppState } from '../../store/reducers';
import * as SettingsActions from '../../store/actions/settings.actions';
import { selectVolume, selectMusic } from '../../store/selectors';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  private readonly MODAL_ID = 'settings' as const;
  isOpen: ReturnType<ModalService['getModalState']>;
  volume!: Signal<number>;
  music!: Signal<number>;

  constructor(
    private store: Store<AppState>,
    private modalService: ModalService
  ) {
    this.isOpen = this.modalService.getModalState(this.MODAL_ID);
    this.volume = this.store.selectSignal(selectVolume);
    this.music = this.store.selectSignal(selectMusic);
  }

  ngOnInit(): void {
    this.store.dispatch(SettingsActions.loadSettings());
  }

  updateVolume(volume: number): void {
    this.store.dispatch(SettingsActions.updateVolume({ volume }));
  }

  updateMusic(music: number): void {
    this.store.dispatch(SettingsActions.updateMusic({ music }));
  }

  onClose(): void {
    this.modalService.close(this.MODAL_ID);
  }
}
