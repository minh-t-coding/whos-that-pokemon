import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  isOpen = input.required<boolean>();
  title = input<string>('');
  showCloseButton = input<boolean>(true);
  variant = input<'default' | 'pokemon'>('default');

  closeModal = output<void>();

  onClose(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    // Close if clicking the backdrop (not the modal content)
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onModalClick(event: MouseEvent): void {
    // Prevent clicks inside modal from closing it
    event.stopPropagation();
  }
}
