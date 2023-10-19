/* eslint-disable react/prop-types */
import { RouterProvider } from 'react-router-dom';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Provider, ErrorBoundary } from '@rollbar/react';
import router from './routes/router';
import AuthContext from './contexts';

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_CONFIG,
  environment: 'production',
};

const AuthProvider = ({ children }) => {
  const [isLogged, setLoggedIn] = useState(false);
  const [username, setUser] = useState(null);

  const logIn = (name, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', name);
    setUser(name);
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.clear();
    setUser(null);
    setLoggedIn(false);
  };
  const checkAndAuth = () => {
    if (isLogged) return true;
    if (localStorage.getItem('token')) {
      logIn(localStorage.getItem('username'), localStorage.getItem('token'));
      return true;
    }
    return false;
  };
  const getToken = () => localStorage.getItem('token');

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{
      isLogged, logIn, checkAndAuth, logOut, username, getToken,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const App = () => (
  <Provider config={rollbarConfig}>
    <ErrorBoundary>
      <AuthProvider>
        <ToastContainer />
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  </Provider>
);

export default App;
