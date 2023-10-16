/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = { renameChannel: false, removeChannel: false, newChannel: false };

const modalSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showRename(state) {
      state.renameChannel = true;
    },
    showRemove(state) {
      state.removeChannel = true;
    },
    showNew(state) {
      state.newChannel = true;
    },
    closeModals(state) {
      state.renameChannel = false;
      state.removeChannel = false;
      state.newChannel = false;
    },
  },
});

export const {
  showRename, showRemove, showNew, closeModals,
} = modalSlice.actions;
export default modalSlice.reducer;
