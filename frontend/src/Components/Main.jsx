import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCheck() {
  if (localStorage.getItem('token')) {
    return (
      <>
        <h1>Главная страница</h1>
        <h2>Тут будет чат</h2>
        <button type="button" onClick={() => { localStorage.clear(); }}>
          Очистить локал сторэйдж
        </button>
      </>
    );
  }
  return null;
}

function BuildPage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);
  return (
    <AuthCheck />
  );
}

export default BuildPage;
