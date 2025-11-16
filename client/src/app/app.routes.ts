import { Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { HomeComponent } from './components/home/home.component';
import { DifficultyComponent } from './components/difficulty/difficulty.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'difficulty', component: DifficultyComponent },
  { path: 'game', component: GameComponent },
  { path: '**', redirectTo: '' },
];
