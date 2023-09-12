/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: 10,
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    merge: (state, action) => {
      state = Object.assign(state, action.payload);
    },
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
  },
});

export const { merge, setCurrentChannelId } = chatsSlice.actions;
export default chatsSlice.reducer;
