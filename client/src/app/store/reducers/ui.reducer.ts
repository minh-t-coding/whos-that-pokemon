import { createReducer, on } from '@ngrx/store';
import * as UIActions from '../actions/ui.actions';
import { ModalId } from '../../utils/game-type';

export interface UIState {
  openModals: Set<ModalId>;
}

export const initialState: UIState = {
  openModals: new Set<ModalId>(),
};

export const uiReducer = createReducer(
  initialState,
  on(UIActions.openModal, (state, { modalId }) => ({
    ...state,
    openModals: new Set(state.openModals).add(modalId),
  })),
  on(UIActions.closeModal, (state, { modalId }) => {
    const updated = new Set(state.openModals);
    updated.delete(modalId);
    return {
      ...state,
      openModals: updated,
    };
  }),
  on(UIActions.closeAllModals, (state) => ({
    ...state,
    openModals: new Set<ModalId>(),
  }))
);

