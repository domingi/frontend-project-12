/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({ ids: [], entities: [], currentId: 1 }),
  reducers: {
    setAll: channelsAdapter.setAll,
    addOne: channelsAdapter.addOne,
    removeOne: channelsAdapter.removeOne,
    updateOne: channelsAdapter.updateOne,
    setCurrentId(state, action) {
      state.currentId = action.payload === 'undefined' ? 1 : action.payload;
    },
  },
});

export const { actions } = channelsSlice;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;
