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
import Card from './CardSignup';

function SignupForm() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isValidated, setValidated] = useState(true);

  const SignupSchema = Yup.object().shape({
    username: Yup.string().min(6, t('errors.nameLength')).max(20, t('errors.nameLength')).required(t('errors.requiredName')),
    password: Yup.string().min(6, t('errors.shortPassword')).required(t('errors.requiredPassword')),
    confirmPassword: Yup.string().required(t('errors.requiredConfirmPassword')).oneOf([Yup.ref('password'), null], t('errors.confirmedPassword')),
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
            console.log('Ошибка соединения');
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
              placeholder={t('signup.username')}
              value={values.username}
              onChange={handleChange}
              isInvalid={!!errors.username || !isValidated}
            />
            <Form.Control.Feedback type="invalid" className="d-flex justify-content-left">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder={t('signup.password')}
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
              placeholder={t('signup.passwordConfirm')}
              value={values.confirmPassword}
              onChange={handleChange}
              isInvalid={!!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid" className="d-flex justify-content-left">{errors.confirmPassword}</Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            {t('signup.button')}
          </Button>
          {!isValidated
        && (
        <Form.Control.Feedback type="invalid" className="d-flex">
          {t('errors.wrongName')}
        </Form.Control.Feedback>
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
