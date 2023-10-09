import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../Pages/Main';
import LoginPage from '../Pages/Login';
import SignupPage from '../Pages/Signup';
import Error404 from '../Pages/Error404';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'signup',
    element: <SignupPage />,
  },
  {
    path: '*',
    element: <Error404 />,
  },
]);

export default router;
