import {
  Button, Form,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts';
import Card from '../Components/CardSignup';
import { notifyError } from '../Components/notifications';
import Navbar from '../Components/Navbar';
import pathes from '../routes/index';

const SignupForm = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isValidated, setValidated] = useState(true);
  const [isFetched, setFetched] = useState(false);

  const SignupSchema = Yup.object().shape({
    username: Yup.string().required(t('errors.required')).min(3, t('errors.nameLength')).max(20, t('errors.nameLength')),
    password: Yup.string().required(t('errors.required')).min(6, t('errors.shortPassword')),
    confirmPassword: Yup.string().required(t('errors.requiredConfirmPassword')).oneOf([Yup.ref('password'), null], t('errors.confirmedPassword')),
  });

  return (
    <Formik
      validationSchema={SignupSchema}
      validateOnChange={false}
      onSubmit={(values) => {
        setFetched(true);
        axios.post('/api/v1/signup', values)
          .then((response) => {
            const { token } = response.data;
            const { username } = values;
            auth.logIn(username, token);
            setValidated(true);
            setFetched(false);
            navigate(pathes.main);
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
        confirmPassword: '',
      }}
    >
      {({
        handleSubmit, handleChange, values, errors, validateField,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="username" visuallyHidden>{t('signup.username')}</Form.Label>
            <Form.Control
              type="text"
              name="username"
              id="username"
              placeholder={t('signup.username')}
              value={values.username}
              onChange={handleChange}
              isInvalid={!!errors.username || !isValidated}
              autoFocus
              autoComplete="off"
              validate={SignupSchema}
              onBlur={() => validateField('username')}
            />
            <Form.Control.Feedback type="invalid" className="d-flex justify-content-left">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="password" visuallyHidden>{t('signup.password')}</Form.Label>
            <Form.Control
              type="password"
              name="password"
              id="password"
              placeholder={t('signup.password')}
              value={values.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
              autoComplete="off"
              validate={SignupSchema}
              onBlur={() => validateField('password')}
            />
            <Form.Control.Feedback type="invalid" className="d-flex justify-content-left">{errors.password}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="confirmPassword" visuallyHidden>{t('signup.passwordConfirm')}</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder={t('signup.passwordConfirm')}
              value={values.confirmPassword}
              onChange={handleChange}
              isInvalid={!!errors.confirmPassword}
              autoComplete="off"
              validate={SignupSchema}
              onBlur={() => validateField('confirmPassword')}
            />
            <Form.Control.Feedback type="invalid" className="d-flex justify-content-left">{errors.confirmPassword}</Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100" disabled={isFetched}>
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
};

const BuildPage = () => (
  <>
    <Navbar />
    <Card>
      <SignupForm />
    </Card>
  </>
);

export default BuildPage;
