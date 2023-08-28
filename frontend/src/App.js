import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './Components/Main';
import LoginPage from './Components/Login';
import Error404 from './Components/Error404';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
