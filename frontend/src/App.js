/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import MainPage from './Components/Main';
import LoginPage from './Components/Login';
import Error404 from './Components/Error404';
import { AuthContext, NetStatusContext } from './contexts';
import socket from './socket';

socket.on('connect', () => console.log('Heelo! Its Client'));

function AuthProvider({ children }) {
  const [isLogged, setLoggedIn] = useState(false);
  const logIn = () => {
    setLoggedIn(true);
  };

  const [username, setUser] = useState('');
  const [netStatus, setStatus] = useState(true);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{
      isLogged, logIn, username, setUser, netStatus, setStatus,
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
  return (
    <NetStatusProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </NetStatusProvider>
  );
}

export default App;
