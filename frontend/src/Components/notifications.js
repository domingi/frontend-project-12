import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifySucces = (text, id) => toast.success(text, {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
  toastId: id,
});

export const notifyError = (text) => toast.error(text, {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
  toastId: text,
});
