import { Injectable, signal, effect, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { selectMusic } from '../store/selectors';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = signal(false);
  private isPaused = signal(false);
  private isMuted = signal(false);
  musicVolume!: Signal<number>;

  constructor(private store: Store<AppState>) {
    this.musicVolume = this.store.selectSignal(selectMusic);
    effect(() => {
      const musicVolume = this.musicVolume();
      if (this.audio) {
        this.audio.volume = musicVolume / 100;
      }
    });
  }

  initialize(): void {
    if (!this.audio) {
      const musicPath = './Pokemon_music.mp3';
      this.audio = new Audio(musicPath);
      this.audio.loop = true;
      this.audio.volume = this.musicVolume() / 100;
      this.audio.preload = 'auto';

      this.audio.addEventListener('error', (e) => {
        const error = this.audio?.error;
        if (error) {
          console.error('Audio error code:', error.code);
          console.error('Audio error message:', error.message);
          console.error('Tried to load:', musicPath);
          if (error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
            console.error('Then update the path in music.service.ts to match the new filename');
          }
        }
      });

      this.audio.addEventListener('canplaythrough', () => {
        console.log('Background music loaded and ready');
      });

      this.audio.load();
    }
  }

  play(): void {
    if (!this.audio) {
      this.initialize();
    }

    if (this.audio && !this.isPlaying()) {
      const tryPlay = () => {
        if (this.audio) {
          const playPromise = this.audio.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                this.isPlaying.set(true);
                this.isPaused.set(false);
                console.log('Background music started playing');
              })
              .catch((error) => {
                console.error('Error playing background music:', error);
                console.error('Error name:', error.name);
                console.error('Error message:', error.message);
                if (this.audio && this.audio.readyState < 2) {
                  this.audio.addEventListener('canplay', tryPlay, { once: true });
                } else if (error.name === 'NotAllowedError') {
                  console.warn('Autoplay blocked. Music will play after user interaction.');
                }
              });
          }
        }
      };

      if (this.audio.readyState >= 2) {
        tryPlay();
      } else {
        this.audio.addEventListener('canplay', tryPlay, { once: true });
        if (this.audio.readyState === 0) {
          this.audio.load();
        }
      }
    } else if (this.audio && this.isPaused()) {
      this.resume();
    }
  }

  pause(): void {
    if (this.audio && this.isPlaying()) {
      this.audio.pause();
      this.isPaused.set(true);
    }
  }

  resume(): void {
    if (!this.audio) {
      this.initialize();
    }

    if (this.audio && this.isPaused()) {
      this.audio
        .play()
        .then(() => {
          this.isPaused.set(false);
          this.isPlaying.set(true);
        })
        .catch((error) => {
          console.error('Error resuming background music:', error);
        });
    } else if (this.audio && !this.isPlaying()) {
      this.play();
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying.set(false);
      this.isPaused.set(false);
    }
  }

  getPlayingState(): boolean {
    return this.isPlaying();
  }
}
