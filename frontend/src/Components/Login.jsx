import {
  Button, Form,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts';
import Card from './CardLogin';
import { notifyError } from './notifications';

function RegistrationForm() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isValidated, setValidated] = useState(true);

  const SignupSchema = Yup.object().shape({
    username: Yup.string().required(t('errors.requiredName')),
    password: Yup.string().min(3, t('errors.shortPassword')).required(t('errors.requiredPassword')),
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
          .catch((e) => {
            console.log(e);
            if (e.code === 'ERR_BAD_REQUEST') {
              setValidated(false);
            }
            if (e.code === 'ERR_NETWORK') {
              notifyError(t('notify.serverError'));
            }
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
              placeholder={t('login.username')}
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
              placeholder={t('login.password')}
              value={values.password}
              onChange={handleChange}
              isInvalid={!!errors.password || !isValidated}
            />
            <Form.Control.Feedback type="invalid" className="d-flex justify-content-left">{errors.password}</Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            {t('login.title')}
          </Button>
          {!isValidated
        && (
        <p className="text-danger">
          {t('errors.auth')}
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
