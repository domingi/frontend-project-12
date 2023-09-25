/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as channelActions } from './channelSlice';

const messagesAdapter = createEntityAdapter();

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    setAll: messagesAdapter.setAll,
    addOne: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder.addCase(channelActions.removeOne, (state, action) => {
      const channelId = action.payload;
      const restEntities = Object.values(state.entities).filter((e) => e.channelId !== channelId);
      messagesAdapter.setAll(state, restEntities);
    });
  },
});

export const { actions } = messagesSlice;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
