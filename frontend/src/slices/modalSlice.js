/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = { show: false };

const modalSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    show(state, { payload }) {
      state.show = payload;
    },
    close(state) {
      state.show = false;
    },
  },
});

export const { show, close } = modalSlice.actions;
export default modalSlice.reducer;
