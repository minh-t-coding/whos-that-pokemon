import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../shared/modal/modal.component';
import { CaughtPokemonEntry } from '../../utils/game-type';

@Component({
  selector: 'app-caught-pokemon-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './caught-pokemon-modal.component.html',
  styleUrl: './caught-pokemon-modal.component.css',
})
export class CaughtPokemonModalComponent {
  caughtPokemon = input.required<CaughtPokemonEntry[]>();
  isOpen = input.required<boolean>();
  closeModal = output<void>();

  onClose(): void {
    this.closeModal.emit();
  }

  // Create a grid of 36 slots (6x6) for display
  pokemonGrid = computed(() => {
    const caught = this.caughtPokemon();
    const grid: (CaughtPokemonEntry | null)[] = new Array(36).fill(null);

    // Fill in caught Pokemon
    caught.forEach((pokemon, index) => {
      if (index < 36) {
        grid[index] = pokemon;
      }
    });

    return grid;
  });
}
