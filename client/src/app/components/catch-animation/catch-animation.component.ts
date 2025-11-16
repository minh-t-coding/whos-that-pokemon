import { Component, input, output, OnInit, OnDestroy, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { selectVolume } from '../../store/selectors';

@Component({
  selector: 'app-catch-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catch-animation.component.html',
  styleUrl: './catch-animation.component.css',
})
export class CatchAnimationComponent implements OnInit, OnDestroy {
  pokemonName = input.required<string>();
  pokemonImage = input.required<string>();
  animationComplete = output<void>();

  private animationTimeout: any;
  private captureSound: HTMLAudioElement | null = null;
  pokemonInFront = false;
  volume!: Signal<number>;

  constructor(private store: Store<AppState>) {
    this.volume = this.store.selectSignal(selectVolume);
  }

  ngOnInit(): void {
    this.playCaptureSound();

    setTimeout(() => {
      this.pokemonInFront = true;
    }, 2500);

    this.animationTimeout = setTimeout(() => {
      this.animationComplete.emit();
    }, 5500);
  }

  ngOnDestroy(): void {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    if (this.captureSound) {
      this.captureSound.pause();
      this.captureSound = null;
    }
  }

  private playCaptureSound(): void {
    try {
      this.captureSound = new Audio('/Pokemon_Capture_sound_effect.mp3');
      this.captureSound.volume = this.volume() / 100;
      this.captureSound.play().catch((error) => {
        console.error('Error playing capture sound:', error);
      });
    } catch (error) {
      console.error('Error loading capture sound:', error);
    }
  }
}
