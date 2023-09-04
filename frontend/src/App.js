/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import MainPage from './Components/Main';
import LoginPage from './Components/Login';
import Error404 from './Components/Error404';
import AuthContext from './contexts';

function AuthProvider({ children }) {
  const [isLogged, setLoggedIn] = useState(false);

  const logIn = () => {
    setLoggedIn(true);
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{ isLogged, logIn }}>
      {children}
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
