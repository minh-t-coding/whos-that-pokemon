import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../services/music.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private musicStarted = false;
  constructor(
    private router: Router,
    private musicService: MusicService
  ) {}

  ngOnInit(): void {
    // Initialize music service to start loading the file
    this.musicService.initialize();
  }

  startMusicOnce(): void {
    if (!this.musicStarted) {
      this.musicStarted = true;
      this.musicService.play();
    }
  }

  onPlayClick(): void {
    this.startMusicOnce();
    this.router.navigate(['/difficulty']);
  }
}
