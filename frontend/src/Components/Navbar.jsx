import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../contexts';

const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          {t('navbar.logo')}
        </a>
        {auth.isLogged
        && (
          <button type="button" className="btn btn-primary" onClick={handleClick}>{t('navbar.button')}</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
