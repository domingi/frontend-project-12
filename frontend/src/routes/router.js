import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../Pages/Main';
import LoginPage from '../Pages/Login';
import SignupPage from '../Pages/Signup';
import Error404 from '../Pages/Error404';
import pathes from './index';

const router = createBrowserRouter([
  {
    path: pathes.main,
    element: <MainPage />,
  },
  {
    path: pathes.login,
    element: <LoginPage />,
  },
  {
    path: pathes.signup,
    element: <SignupPage />,
  },
  {
    path: '*',
    element: <Error404 />,
  },
]);

export default router;
