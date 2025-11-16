import { Injectable, signal, computed } from '@angular/core';
import { ModalId } from '../utils/game-type';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private openModals = signal<Set<ModalId>>(new Set());
  private modalStateCache = new Map<ModalId, ReturnType<typeof computed<boolean>>>();

  getModalState(modalId: ModalId) {
    if (!this.modalStateCache.has(modalId)) {
      this.modalStateCache.set(
        modalId,
        computed(() => this.openModals().has(modalId))
      );
    }
    return this.modalStateCache.get(modalId)!;
  }

  open(modalId: ModalId): void {
    this.openModals.update((modals) => new Set(modals).add(modalId));
  }

  close(modalId: ModalId): void {
    this.openModals.update((modals) => {
      const updated = new Set(modals);
      updated.delete(modalId);
      return updated;
    });
  }

  toggle(modalId: ModalId): void {
    if (this.openModals().has(modalId)) {
      this.close(modalId);
    } else {
      this.open(modalId);
    }
  }

  closeAll(): void {
    this.openModals.set(new Set());
  }
}
