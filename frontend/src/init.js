import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';
import socket from './socket';
import ru from './locales/ru.json';
import en from './locales/en.json';
import { actions as channelsActions } from './slices/channelSlice';
import { actions as messagesActions } from './slices/messagesSlice';
import store from './slices/index';

const { dispatch } = store;

const resources = {
  ru: {
    translation: ru,
  },
  en: {
    translation: en,
  },
};

export default () => {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    });

  filter.loadDictionary('en');

  socket.on('connect', () => {
    console.log('Соединение установлено');
  });

  socket.on('renameChannel', (channel) => {
    dispatch(channelsActions.updateOne({ id: channel.id, changes: { ...channel } }));
  });

  socket.on('removeChannel', ({ id }) => {
    dispatch(channelsActions.removeOne(id));
  });

  socket.on('newChannel', (channel) => {
    dispatch(channelsActions.addOne(channel));
  });

  socket.on('newMessage', (messageWithId) => {
    dispatch(messagesActions.addOne(messageWithId));
  });
};
