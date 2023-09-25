/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import { useTranslation } from 'react-i18next';
import MainPage from './Components/Main';
import LoginPage from './Components/Login';
import SignupPage from './Components/Signup';
import Error404 from './Components/Error404';
import Navbar from './Components/Navbar';
import { AuthContext, NetStatusContext } from './contexts';
import { actions } from './slices/channelSlice';
import socket from './socket';
import { notifySucces } from './Components/notifications';

socket.on('connect', () => {
  console.log('Heelo! Its Client');
});

function AuthProvider({ children }) {
  const [isLogged, setLoggedIn] = useState(false);
  const logIn = () => {
    setLoggedIn(true);
  };
  const logOut = () => {
    setLoggedIn(false);
  };

  const [username, setUser] = useState('');

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{
      isLogged, logIn, logOut, username, setUser,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function NetStatusProvider({ children }) {
  const [status, setStatus] = useState(true);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <NetStatusContext.Provider value={{
      status, setStatus,
    }}
    >
      {children}
    </NetStatusContext.Provider>
  );
}

function App() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [currentChannelId, setCurrentChannelId] = useState(1);

  useEffect(() => {
    console.log('инициализация');
    socket.on('renameChannel', (channel) => {
      dispatch(actions.updateOne({ id: channel.id, changes: { ...channel } }));
      notifySucces(t('notify.rename'));
    });
    socket.on('removeChannel', ({ id }) => {
      dispatch(actions.removeOne(id));
      if (id === currentChannelId) {
        setCurrentChannelId(1);
      }
      notifySucces(t('notify.remove'), id);
    });
    socket.on('newChannel', (channel) => {
      dispatch(actions.addOne(channel));
      setCurrentChannelId(channel.id);
      notifySucces(t('notify.add'));
    });
  }, [dispatch, t, currentChannelId, setCurrentChannelId]);

  return (
    <NetStatusProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<MainPage currentChannelId={currentChannelId} setCurrentChannelId={setCurrentChannelId} />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </NetStatusProvider>
  );
}

export default App;
