import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import * as Yup from 'yup';
import { Formik } from 'formik';

function RegistrationForm() {
  const SignupSchema = Yup.object().shape({
    name: Yup.string().min(3, 'Слишком короткий ник').required('Введите имя'),
    password: Yup.string().min(3, 'Слишком короткий пароль').required('Введите пароль'),
  });

  return (
    <Formik
      validationSchema={SignupSchema}
      onSubmit={(values) => {
        console.log(JSON.stringify(values, null, 2));
      }}
      initialValues={{
        name: '',
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
              name="name"
              placeholder="Ваш ник"
              value={values.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
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
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit">
            Войти
          </Button>
        </Form>
      )}
    </Formik>
  );
/*
  (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Ваш ник"
          id="name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Control
          type="password"
          placeholder="Пароль"
          id="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Войти
      </Button>
    </Form>
  );
*/
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
    </Container>
  );
}

export default BuildPage;
