import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { SettingsComponent } from './components/settings/settings.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LeaderboardComponent, SettingsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('pokemon-quiz');
}
