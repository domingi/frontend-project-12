/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import MainPage from './Components/Main';
import LoginPage from './Components/Login';
import SignupPage from './Components/Signup';
import Error404 from './Components/Error404';
import Navbar from './Components/Navbar';
import { AuthContext, NetStatusContext } from './contexts';

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
  return (
    <NetStatusProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<MainPage />} />
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
