import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';
import ru from './locales/ru.json';
import en from './locales/en.json';
import { runSocketListeners } from './socket';

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

  runSocketListeners();
};
