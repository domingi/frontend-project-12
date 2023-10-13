import { io } from 'socket.io-client';
import i18n from 'i18next';
import { notifyError, notifySucces } from './Components/notifications';
import { actions as channelsActions } from './slices/channelSlice';
import { actions as messagesActions } from './slices/messagesSlice';
import store from './slices/index';

const socket = io();
const { dispatch } = store;

const renameChannel = (channel) => {
  socket.emit('renameChannel', channel, (response) => {
    if (response.status !== 'ok') {
      notifyError(i18n.t('notify.socketError'));
    }
    if (response.status === 'ok') {
      notifySucces(i18n.t('notify.rename'));
    }
  });
};

const removeChannel = (id) => {
  socket.emit('removeChannel', { id }, (response) => {
    if (response.status !== 'ok') {
      notifyError(i18n.t('notify.socketError'));
    }
    if (response.status === 'ok') {
      notifySucces(i18n.t('notify.remove'));
    }
  });
};

const newChannel = (channel) => {
  socket.emit('newChannel', channel, (response) => {
    if (response.status !== 'ok') {
      notifyError(i18n.t('notify.socketError'));
    }
    if (response.status === 'ok') {
      dispatch(channelsActions.addOne(response.data));
      dispatch(channelsActions.setCurrentId(response.data.id));
      notifySucces(i18n.t('notify.add'));
    }
  });
};

const newMessage = (message, setConnected, setNewMessage) => {
  socket.emit('newMessage', message, (response) => {
    if (response.status !== 'ok') {
      setConnected(false);
      notifyError(i18n.t('notify.sendError'));
    } else {
      setConnected(true);
      setNewMessage('');
    }
  });
};

export const emits = {
  renameChannel, removeChannel, newChannel, newMessage,
};

export const runSocketListeners = () => {
  socket.on('connect', () => {
    console.log('Соединение установлено');
  });

  socket.on('renameChannel', (channel) => {
    dispatch(channelsActions.updateOne({ id: channel.id, changes: { ...channel } }));
  });

  socket.on('removeChannel', ({ id }) => {
    const state = store.getState();
    dispatch(channelsActions.removeOne(id));
    if (id === state.channels.currentId) {
      dispatch(channelsActions.setCurrentId(1));
    }
  });

  socket.on('newChannel', (channel) => {
    dispatch(channelsActions.addOne(channel));
  });

  socket.on('newMessage', (messageWithId) => {
    dispatch(messagesActions.addOne(messageWithId));
  });
};
