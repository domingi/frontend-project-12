import {
  Button, Form,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts';
import Card from './CardSignup';

function SignupForm() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isValidated, setValidated] = useState(true);

  const SignupSchema = Yup.object().shape({
    username: Yup.string().min(3, 'Введите имя от 3 до 20 символов').max(20, 'Введите имя от 3 до 20 символов').required('Введите имя'),
    password: Yup.string().min(6, 'Слишком короткий пароль').required('Введите пароль'),
    confirmPassword: Yup.string().required('Подтвердите пароль').oneOf([Yup.ref('password'), null], 'Пароли должны совпадать'),
  });

  return (
    <Formik
      validationSchema={SignupSchema}
      validateOnChange={false}
      onSubmit={(values) => {
        axios.post('/api/v1/signup', values)
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
        confirmPassword: '',
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
              placeholder="Имя пользователя"
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
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid" className="d-flex justify-content-left">{errors.password}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Подтвердите пароль"
              value={values.confirmPassword}
              onChange={handleChange}
              isInvalid={!!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid" className="d-flex justify-content-left">{errors.confirmPassword}</Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Зарегистрироваться
          </Button>
          {!isValidated
        && (
        <p className="text-danger">
          Такое имя уже занято, придумайте другое
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
      <SignupForm />
    </Card>
  );
}

export default BuildPage;
