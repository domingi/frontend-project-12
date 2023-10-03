import {
  Button, Form,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Components/CardLogin';
import { notifyError } from '../Components/notifications';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isValidated, setValidated] = useState(true);
  const [isFetched, setFetched] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required(t('errors.required')),
    password: Yup.string().required(t('errors.required')),
  });

  return (
    <Formik
      validationSchema={LoginSchema}
      validateOnChange={false}
      onSubmit={(values) => {
        setFetched(true);
        axios.post('/api/v1/login', values)
          .then((response) => {
            localStorage.setItem('token', response.data.token);
            const { username } = values;
            localStorage.setItem('username', username);
            setValidated(true);
            setFetched(false);
            navigate('/');
          })
          .catch((e) => {
            setFetched(false);
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
        handleSubmit, handleChange, values, errors, validateField,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="username" visuallyHidden>{t('login.username')}</Form.Label>
            <Form.Control
              type="text"
              name="username"
              id="username"
              placeholder={t('login.username')}
              value={values.username}
              onChange={handleChange}
              isInvalid={!!errors.username || !isValidated}
              autoFocus
              validate={LoginSchema}
              onBlur={() => validateField('username')}
            />
            <Form.Control.Feedback type="invalid" className="d-flex justify-content-left">{errors.username}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="password" visuallyHidden>{t('login.password')}</Form.Label>
            <Form.Control
              type="password"
              name="password"
              id="password"
              placeholder={t('login.password')}
              value={values.password}
              onChange={handleChange}
              isInvalid={!!errors.password || !isValidated}
              validate={LoginSchema}
              onBlur={() => validateField('password')}
            />
            <Form.Control.Feedback type="invalid" className="d-flex justify-content-left">{errors.password}</Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100" disabled={isFetched}>
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
};

const BuildPage = () => (
  <Card>
    <RegistrationForm />
  </Card>
);

export default BuildPage;
