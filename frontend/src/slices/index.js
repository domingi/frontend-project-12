import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelSlice';
import messagesReducer from './messagesSlice';
import modalReducer from './modalSlice';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    modals: modalReducer,
  },
});
