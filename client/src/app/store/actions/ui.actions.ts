import { createAction, props } from '@ngrx/store';
import { ModalId } from '../../utils/game-type';

export const openModal = createAction(
  '[UI] Open Modal',
  props<{ modalId: ModalId }>()
);
export const closeModal = createAction(
  '[UI] Close Modal',
  props<{ modalId: ModalId }>()
);
export const closeAllModals = createAction('[UI] Close All Modals');

