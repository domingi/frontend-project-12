import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts';

export default function Navbar() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.clear();
    auth.logOut();
    navigate('/login');
  };
  return (
    <nav className="navbar bg-body-tertiary shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src="https://static.thenounproject.com/png/739210-200.png" alt="Logo" width="30" height="24" className="d-inline-block align-text-top" />
          Hexlet Chat
        </a>
        {auth.isLogged
        && (
          <button type="button" className="btn btn-primary" onClick={handleClick}>Выйти</button>
        )}
      </div>
    </nav>
  );
}
