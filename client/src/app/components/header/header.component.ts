import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() showQuit = false;
  @Input() quitLabel = 'quit';
  @Output() quit = new EventEmitter<void>();
  constructor(private modalService: ModalService) {}

  onSettingsClick(): void {
    this.modalService.open('settings');
  }

  onLeaderboardClick(): void {
    this.modalService.open('leaderboard');
  }

  onQuitClick(): void {
    this.quit.emit();
  }
}
