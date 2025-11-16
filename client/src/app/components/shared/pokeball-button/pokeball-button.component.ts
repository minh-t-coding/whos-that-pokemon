import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokeball-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokeball-button.component.html',
  styleUrl: './pokeball-button.component.css',
})
export class PokeballButtonComponent {
  label = input.required<string>();
  disabled = input<boolean>(false);
  variant = input<'default' | 'action'>('default');
  iconSize = input<string>('60px');

  clicked = output<void>();

  onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
