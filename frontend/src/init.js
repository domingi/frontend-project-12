import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';
import socket from './socket';
import ru from './locales/ru.json';
import en from './locales/en.json';
import { actions as channelsActions } from './slices/channelSlice';
import { actions as messagesActions } from './slices/messagesSlice';
import store from './slices/index';
import { notifySucces } from './Components/notifications';

const { dispatch } = store;
const { getState } = store;

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

  filter.loadDictionary('ru');

  console.log('инициализация');

  socket.on('connect', () => {
    console.log('Heelo! Its Client');
  });

  socket.on('renameChannel', (channel) => {
    dispatch(channelsActions.updateOne({ id: channel.id, changes: { ...channel } }));
    notifySucces(i18n.t('notify.rename'));
  });

  socket.on('removeChannel', ({ id }) => {
    dispatch(channelsActions.removeOne(id));
    const { channels: { currentId } } = getState();
    if (id === currentId) {
      dispatch(channelsActions.setCurrentId(1));
    }
    notifySucces(i18n.t('notify.remove'));
  });

  socket.on('newChannel', (channel) => {
    dispatch(channelsActions.addOne(channel));
    dispatch(channelsActions.setCurrentId(channel.id));
    notifySucces(i18n.t('notify.add'));
  });

  socket.on('newMessage', (messageWithId) => {
    dispatch(messagesActions.addOne(messageWithId));
  });
};
