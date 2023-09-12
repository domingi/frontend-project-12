import {
  Button, Form, Row, Col, Container, Image,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authContext from '../contexts';

function AuthCheck() {
  if (localStorage.getItem('token')) {
    return (
      <button type="button" onClick={() => { localStorage.clear(); }}>
        Очистить локал сторэйдж
      </button>
    );
  }
  return null;
}

function RegistrationForm() {
  const auth = useContext(authContext);
  const navigate = useNavigate();
  const [isValidated, setValidated] = useState(true);

  const SignupSchema = Yup.object().shape({
    username: Yup.string().min(3, 'Слишком короткий ник').required('Введите имя'),
    password: Yup.string().min(3, 'Слишком короткий пароль').required('Введите пароль'),
  });

  return (
    <Formik
      validationSchema={SignupSchema}
      onSubmit={(values) => {
        axios.post('/api/v1/login', values)
          .then((response) => {
            localStorage.setItem('token', response.data.token);
            auth.logIn();
            setValidated(true);
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
            <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
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
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit">
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
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col md="2">
          <Image src="https://sun9-13.userapi.com/impg/qxiJUmiKN2yz3jEW03gdXqyq2-0i_ePOoHbl2A/MDxst8Hb2tk.jpg?size=200x200&quality=95&sign=780dae9705ad31218ba234936bfb20f6&type=album" roundedCircle />
        </Col>
        <Col md="3">
          <h2>Войти</h2>
          <RegistrationForm />
        </Col>
      </Row>
      <Row>
        <AuthCheck />
      </Row>
    </Container>
  );
}

export default BuildPage;
