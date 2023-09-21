import {
  Button, Form,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts';
import Card from './CardLogin';

function RegistrationForm() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isValidated, setValidated] = useState(true);

  const SignupSchema = Yup.object().shape({
    username: Yup.string().min(3, 'Слишком короткий ник').required('Введите имя'),
    password: Yup.string().min(3, 'Слишком короткий пароль').required('Введите пароль'),
  });

  return (
    <Formik
      validationSchema={SignupSchema}
      validateOnChange={false}
      onSubmit={(values) => {
        axios.post('/api/v1/login', values)
          .then((response) => {
            localStorage.setItem('token', response.data.token);
            auth.logIn();
            setValidated(true);
            const { username } = values;
            auth.setUser(username);
            navigate('/');
          })
          .catch(() => {
            setValidated(false);
          });
      }}
      initialValues={{
        username: '',
        password: '',
      }}
    >
      {({
        handleSubmit, handleChange, values, errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="username"
              placeholder="Ваш ник"
              value={values.username}
              onChange={handleChange}
              isInvalid={!!errors.username || !isValidated}
            />
            <Form.Control.Feedback type="invalid" className="d-flex justify-content-left">{errors.username}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Пароль"
              value={values.password}
              onChange={handleChange}
              isInvalid={!!errors.password || !isValidated}
            />
            <Form.Control.Feedback type="invalid" className="d-flex justify-content-left">{errors.password}</Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Войти
          </Button>
          {!isValidated
        && (
        <p className="text-danger">
          Неверные имя пользователя или пароль
        </p>
        )}
        </Form>
      )}
    </Formik>
  );
}

function BuildPage() {
  return (
    <Card>
      <RegistrationForm />
    </Card>
  );
}

export default BuildPage;
